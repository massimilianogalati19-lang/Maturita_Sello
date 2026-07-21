import React from 'react';
import { DOCUMENTO_15_MAGGIO_TEXT, DEFAULT_CLASS_INFO } from '../data/documento15maggioContext';
import { X, BookOpen, GraduationCap, School, FileCheck, Layers } from 'lucide-react';

interface DocumentInfoModalProps {
  onClose: () => void;
  extractedSubjects: string[];
}

export const DocumentInfoModal: React.FC<DocumentInfoModalProps> = ({ onClose, extractedSubjects }) => {
  return (
    <div id="doc-info-modal-backdrop" className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div id="doc-info-modal-content" className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full my-8 p-6 shadow-2xl space-y-6 text-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Documento del 15 Maggio — {DEFAULT_CLASS_INFO.school}
              </h2>
              <p className="text-xs text-slate-400">
                {DEFAULT_CLASS_INFO.className} • {DEFAULT_CLASS_INFO.specialization} ({DEFAULT_CLASS_INFO.year})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Subjects Banner */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-2">
            <FileCheck className="w-4 h-4" />
            <span>Materie Estratte per il Colloquio Corrente:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {extractedSubjects.map((sub, idx) => (
              <div key={idx} className="bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700 text-xs sm:text-sm text-slate-200 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="truncate">{sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Full Document Summary Content */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Contesto & Sintesi Programmi Svolti Caricati dalla Classe:</span>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs sm:text-sm text-slate-300 font-mono leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
            {DOCUMENTO_15_MAGGIO_TEXT}
          </div>
        </div>

        {/* Close button */}
        <div className="text-right pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-colors"
          >
            Chiudi e torna al colloquio
          </button>
        </div>

      </div>
    </div>
  );
};
