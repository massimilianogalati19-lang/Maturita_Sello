import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Send, Volume2, VolumeX, Radio, Sparkles } from 'lucide-react';

interface InputBarProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  isListening: boolean;
  onToggleListening: () => void;
  isTtsEnabled: boolean;
  onToggleTts: () => void;
  transcriptText: string;
}

export const InputBar: React.FC<InputBarProps> = ({
  onSendMessage,
  isLoading,
  isListening,
  onToggleListening,
  isTtsEnabled,
  onToggleTts,
  transcriptText,
}) => {
  const [inputText, setInputText] = useState('');

  // Update input text when speech recognition returns live transcript
  useEffect(() => {
    if (transcriptText) {
      setInputText(transcriptText);
    }
  }, [transcriptText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <footer id="input-bar-container" className="bg-slate-900 border-t border-slate-800 p-3 sm:p-4 sticky bottom-0 z-30 shadow-2xl">
      <div className="max-w-5xl mx-auto space-y-2">
        
        {/* Animated Listening Waves Bar */}
        {isListening && (
          <div className="flex items-center justify-between px-3 py-1.5 bg-red-950/80 border border-red-800/80 rounded-lg text-red-200 text-xs animate-pulse">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-red-400 animate-spin" />
              <span className="font-semibold">In ascolto... Parla ora in italiano</span>
            </div>
            <div className="flex gap-1 items-center">
              <span className="w-1 h-3 bg-red-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1 h-4 bg-red-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1 h-5 bg-red-400 rounded-full animate-bounce"></span>
              <span className="w-1 h-3 bg-red-400 rounded-full animate-bounce [animation-delay:-0.2s]"></span>
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 sm:gap-3">
          
          {/* Microphone Button */}
          <button
            id="mic-recording-btn"
            type="button"
            onClick={onToggleListening}
            disabled={isLoading}
            className={`p-3 rounded-xl border transition-all flex items-center justify-center shrink-0 ${
              isListening
                ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/40 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
            }`}
            title={isListening ? 'Disattiva microfono' : 'Attiva microfono (Speech-to-Text)'}
          >
            {isListening ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Textarea / Input Field */}
          <div className="relative flex-1">
            <input
              id="student-response-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Rispondi alla commissione..."
              disabled={isLoading}
              className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm sm:text-base disabled:opacity-50"
            />
          </div>

          {/* Voice Synthesis Toggle Button */}
          <button
            id="tts-toggle-btn"
            type="button"
            onClick={onToggleTts}
            className={`p-3 rounded-xl border transition-all flex items-center justify-center shrink-0 ${
              isTtsEnabled
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
                : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300'
            }`}
            title={isTtsEnabled ? 'Lettura vocale attiva (SpeechSynthesis)' : 'Lettura vocale disattivata'}
          >
            {isTtsEnabled ? <Volume2 className="w-5 h-5 text-amber-400" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Send Button */}
          <button
            id="send-message-btn"
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="py-3 px-4 sm:px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold transition-all shadow-md shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0"
          >
            <span className="hidden sm:inline">Invia</span>
            <Send className="w-4 h-4 text-slate-950" />
          </button>

        </form>

        {/* Footer info note as requested by user specification */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 px-1 pt-1 gap-1">
          <span className="italic">
            💡 Nota: La modalità vocale funziona al meglio su <strong>Google Chrome</strong>.
          </span>
          <span className="text-slate-400 font-mono">
            {isTtsEnabled ? '🔊 Lettura vocale commissione ATTIVA' : '🔇 Lettura vocale DISATTIVA'}
          </span>
        </div>

      </div>
    </footer>
  );
};
