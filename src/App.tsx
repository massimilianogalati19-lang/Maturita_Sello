/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { WelcomeForm } from './components/WelcomeForm';
import { ExamHeader } from './components/ExamHeader';
import { PhaseProgress } from './components/PhaseProgress';
import { ChatArea } from './components/ChatArea';
import { InputBar } from './components/InputBar';
import { FeedbackModal } from './components/FeedbackModal';
import { DocumentInfoModal } from './components/DocumentInfoModal';
import { useSpeech } from './hooks/useSpeech';
import { ChatMessage, ExamPhase } from './types';
import { DEFAULT_SUBJECTS } from './data/documento15maggioContext';

export default function App() {
  const [studentName, setStudentName] = useState<string>('');
  const [extractedSubjects, setExtractedSubjects] = useState<string[]>(DEFAULT_SUBJECTS);
  const [currentPhase, setCurrentPhase] = useState<ExamPhase>(1);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [showDocInfoModal, setShowDocInfoModal] = useState<boolean>(false);

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    isTtsEnabled,
    setIsTtsEnabled,
    isSpeaking,
    speakText,
    stopSpeaking,
  } = useSpeech();

  // Parse response to see if current phase updated
  const detectPhaseFromText = (text: string): ExamPhase | null => {
    const match = text.match(/\[FASE\s+(\d)\s+di\s+5/i);
    if (match && match[1]) {
      const p = parseInt(match[1], 10);
      if (p >= 1 && p <= 5) {
        return p as ExamPhase;
      }
    }
    return null;
  };

  // Start exam session
  const handleStartExam = async (name: string, subjects: string[]) => {
    setStudentName(name);
    setExtractedSubjects(subjects);
    setCurrentPhase(1);
    setMessages([]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: name,
          extractedSubjects: subjects,
          currentPhase: 1,
          messages: [],
        }),
      });

      const data = await res.json();
      if (res.ok && data.text) {
        const initialMsg: ChatMessage = {
          id: Date.now().toString(),
          sender: 'commission',
          text: data.text,
          phase: 1,
          timestamp: Date.now(),
        };
        setMessages([initialMsg]);

        const detectedP = detectPhaseFromText(data.text);
        if (detectedP) setCurrentPhase(detectedP);

        // Auto-read initial welcome message if TTS is active
        if (isTtsEnabled) {
          speakText(data.text);
        }
      } else {
        alert(data.error || 'Si è verificato un errore durante la connessione con la commissione.');
      }
    } catch (err) {
      console.error('API Error:', err);
      alert('Errore di connessione al server.');
    } finally {
      setIsLoading(false);
    }
  };

  // Send student response message
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    if (isListening) {
      stopListening();
    }
    stopSpeaking();

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'student',
      text: text,
      phase: currentPhase,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          extractedSubjects,
          currentPhase,
          messages: newMessages,
        }),
      });

      const data = await res.json();
      if (res.ok && data.text) {
        const commMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'commission',
          text: data.text,
          phase: currentPhase,
          timestamp: Date.now(),
        };

        const updatedMessages = [...newMessages, commMsg];
        setMessages(updatedMessages);

        const detectedP = detectPhaseFromText(data.text);
        if (detectedP) {
          setCurrentPhase(detectedP);
          commMsg.phase = detectedP;
        }

        // Check if text is a feedback summary
        if (data.text.includes('[VALUTAZIONE FINALE') || data.text.includes('Punti di forza')) {
          setFeedbackText(data.text);
          setShowFeedbackModal(true);
        }

        // Auto read response out loud
        if (isTtsEnabled) {
          speakText(data.text);
        }
      } else {
        alert(data.error || 'Errore di risposta dalla commissione.');
      }
    } catch (err) {
      console.error('API Error:', err);
      alert('Impossibile comunicare con la commissione. Riprova.');
    } finally {
      setIsLoading(false);
    }
  };

  // Request final feedback
  const handleFinishAndFeedback = async () => {
    stopSpeaking();
    if (isListening) stopListening();

    setIsLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          extractedSubjects,
          currentPhase,
          messages,
          requestFinalFeedback: true,
        }),
      });

      const data = await res.json();
      if (res.ok && data.text) {
        setFeedbackText(data.text);
        setShowFeedbackModal(true);

        // Add feedback message to chat as well
        const feedbackMsg: ChatMessage = {
          id: Date.now().toString(),
          sender: 'commission',
          text: data.text,
          phase: currentPhase,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, feedbackMsg]);

        if (isTtsEnabled) {
          speakText("La commissione si è riunita in camera di consiglio. Ecco la valutazione qualitativa del tuo colloquio.");
        }
      } else {
        alert(data.error || 'Errore nella generazione del feedback.');
      }
    } catch (err) {
      console.error('API Error:', err);
      alert('Impossibile ottenere il feedback dalla commissione.');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle mic speech recognition
  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening((text) => {
        // live transcript updated in hook
      });
    }
  };

  // Manual speech playback of a specific message
  const handleSpeakMessage = (text: string) => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(text);
    }
  };

  // Restart exam
  const handleNewExam = () => {
    stopSpeaking();
    if (isListening) stopListening();

    if (messages.length > 1) {
      const confirmRestart = window.confirm('Sei sicuro di voler ricominciare? La simulazione corrente verrà azzerata.');
      if (!confirmRestart) return;
    }

    setStudentName('');
    setMessages([]);
    setCurrentPhase(1);
    setShowFeedbackModal(false);
    setShowDocInfoModal(false);
  };

  // Render welcome screen if name not set yet
  if (!studentName) {
    return <WelcomeForm onStartExam={handleStartExam} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans h-screen overflow-hidden">
      
      {/* Sticky Header */}
      <ExamHeader
        studentName={studentName}
        currentPhase={currentPhase}
        onFinishAndFeedback={handleFinishAndFeedback}
        onNewExam={handleNewExam}
        onOpenDocInfo={() => setShowDocInfoModal(true)}
        isLoading={isLoading}
      />

      {/* Phase Indicator Stepper Bar */}
      <PhaseProgress currentPhase={currentPhase} />

      {/* Main Chat Scroll Container */}
      <ChatArea
        messages={messages}
        isLoading={isLoading}
        onSpeakMessage={handleSpeakMessage}
        isSpeaking={isSpeaking}
      />

      {/* Fixed Bottom Voice & Text Input Controls */}
      <InputBar
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        isListening={isListening}
        onToggleListening={handleToggleListening}
        isTtsEnabled={isTtsEnabled}
        onToggleTts={() => {
          if (isTtsEnabled) stopSpeaking();
          setIsTtsEnabled(!isTtsEnabled);
        }}
        transcriptText={transcript}
      />

      {/* Qualitative Feedback Modal */}
      {showFeedbackModal && (
        <FeedbackModal
          studentName={studentName}
          feedbackText={feedbackText}
          onClose={() => setShowFeedbackModal(false)}
          onNewExam={handleNewExam}
        />
      )}

      {/* Document 15 Maggio Info Modal */}
      {showDocInfoModal && (
        <DocumentInfoModal
          onClose={() => setShowDocInfoModal(false)}
          extractedSubjects={extractedSubjects}
        />
      )}

    </div>
  );
}
