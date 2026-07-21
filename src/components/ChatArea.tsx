import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Volume2, VolumeX, Sparkles, User, Users, ShieldAlert } from 'lucide-react';

interface ChatAreaProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSpeakMessage: (text: string) => void;
  isSpeaking: boolean;
  currentlySpeakingId?: string | null;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isLoading,
  onSpeakMessage,
  isSpeaking,
  currentlySpeakingId,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Extract phase tag from message text if present, e.g. [FASE 1 di 5 — APERTURA]
  const parseMessageText = (text: string) => {
    const phaseMatch = text.match(/^(\[FASE \d di 5 — [^\]]+\])/i);
    if (phaseMatch) {
      const tag = phaseMatch[1];
      const rest = text.substring(tag.length).trim();
      return { tag, rest };
    }
    return { tag: null, rest: text };
  };

  return (
    <div id="chat-messages-container" className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-950/60">
      
      {messages.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-6 text-slate-400">
          <Users className="w-12 h-12 text-amber-500/60 mb-3 animate-pulse" />
          <p className="text-base font-medium text-slate-300">
            La Commissione d'Esame si sta accomodando...
          </p>
          <p className="text-xs text-slate-500 max-w-sm mt-1">
            Premi il pulsante sotto o attendi l'apertura della sessione per iniziare la simulazione della Maturità 2026.
          </p>
        </div>
      )}

      {messages.map((msg) => {
        const isCommission = msg.sender === 'commission';
        const isSystem = msg.sender === 'system';
        const { tag, rest } = parseMessageText(msg.text);

        if (isSystem) {
          return (
            <div key={msg.id} className="flex justify-center my-3">
              <div className="bg-slate-900/90 border border-slate-700/60 px-4 py-2 rounded-full text-xs text-amber-300 font-mono flex items-center gap-2 shadow-sm">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{msg.text}</span>
              </div>
            </div>
          );
        }

        return (
          <div
            key={msg.id}
            id={`message-${msg.id}`}
            className={`flex items-start gap-3 max-w-4xl ${
              isCommission ? 'mr-auto' : 'ml-auto flex-row-reverse'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                isCommission
                  ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-slate-950 font-bold border border-amber-500/30'
                  : 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white border border-blue-400/30'
              }`}
            >
              {isCommission ? <Users className="w-5 h-5 text-amber-200" /> : <User className="w-5 h-5" />}
            </div>

            {/* Bubble Container */}
            <div className={`flex flex-col space-y-1.5 max-w-[85%] sm:max-w-[80%]`}>
              
              {/* Header Label */}
              <div
                className={`flex items-center gap-2 text-xs font-medium px-1 ${
                  isCommission ? 'text-amber-300' : 'text-blue-300 justify-end'
                }`}
              >
                <span>{isCommission ? 'Commissione d\'Esame (Maturità 2026)' : 'Studente'}</span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Message Content Box */}
              <div
                className={`p-4 rounded-2xl shadow-md text-sm sm:text-base leading-relaxed whitespace-pre-wrap ${
                  isCommission
                    ? 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-sm'
                    : 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-tr-sm border border-blue-500/30'
                }`}
              >
                {/* Embedded Phase Badge if parsed */}
                {tag && (
                  <div className="mb-3 inline-block bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-bold text-xs px-2.5 py-1 rounded-md">
                    {tag}
                  </div>
                )}

                <div>{rest}</div>

                {/* Speech audio playback button for commission messages */}
                {isCommission && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                      Liceo Artistico "G. Sello" Udine
                    </span>
                    <button
                      type="button"
                      onClick={() => onSpeakMessage(msg.text)}
                      className="inline-flex items-center gap-1.5 text-xs text-amber-400/90 hover:text-amber-300 transition-colors bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/80"
                      title="Leggi ad alta voce il messaggio della commissione"
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                          <span>Interrompi lettura</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>Ascolta voce</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        );
      })}

      {/* Loading state for Commission thought process */}
      {isLoading && (
        <div className="flex items-start gap-3 max-w-2xl mr-auto">
          <div className="w-10 h-10 rounded-xl bg-amber-600/30 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0 animate-pulse">
            <Users className="w-5 h-5" />
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl rounded-tl-sm shadow-md flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></span>
            </div>
            <span className="text-xs font-medium text-slate-400">
              La Commissione si confronta e formula la domanda...
            </span>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};
