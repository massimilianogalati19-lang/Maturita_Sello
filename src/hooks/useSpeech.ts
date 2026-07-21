import { useState, useEffect, useRef, useCallback } from 'react';

// Declaration for SpeechRecognition web API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function useSpeech() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isTtsEnabled, setIsTtsEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(true);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setHasSpeechSupport(false);
    }
  }, []);

  const startListening = useCallback((onResultCallback: (text: string) => void) => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      alert('La sintesi/riconoscimento vocale non è supportata da questo browser. Si consiglia l\'uso di Google Chrome.');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      const recognition = new SpeechRecognitionAPI();
      recognition.lang = 'it-IT';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
        onResultCallback(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error('Error starting speech recognition:', e);
      setIsListening(false);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error('Error stopping speech recognition:', e);
      }
      setIsListening(false);
    }
  }, []);

  const speakText = useCallback((text: string) => {
    if (!isTtsEnabled || !('speechSynthesis' in window)) return;

    // Clean markdown tags and phase tags like [FASE 1 di 5 — APERTURA] before speaking
    const cleanText = text
      .replace(/\[FASE \d di \d — [^\]]+\]/g, '')
      .replace(/[\*\_#`]/g, '')
      .trim();

    if (!cleanText) return;

    window.speechSynthesis.cancel(); // stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'it-IT';
    utterance.rate = 0.95; // Slightly slower, clear formal tone
    utterance.pitch = 1.0;

    // Pick best formal Italian voice if available
    const voices = window.speechSynthesis.getVoices();
    const italianVoices = voices.filter(v => v.lang.startsWith('it'));
    if (italianVoices.length > 0) {
      // Prefer Google or natural Italian voices if present
      const preferred = italianVoices.find(v => v.name.includes('Google') || v.name.includes('Alice') || v.name.includes('Federica') || v.name.includes('Luca')) || italianVoices[0];
      utterance.voice = preferred;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [isTtsEnabled]);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    isTtsEnabled,
    setIsTtsEnabled,
    isSpeaking,
    speakText,
    stopSpeaking,
    hasSpeechSupport,
  };
}
