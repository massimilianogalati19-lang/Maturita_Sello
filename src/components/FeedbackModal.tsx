import React from 'react';
import { Award, CheckCircle, AlertTriangle, Lightbulb, RefreshCw, X, ShieldCheck, Download, Printer } from 'lucide-react';

interface FeedbackModalProps {
  studentName: string;
  feedbackText: string;
  onClose: () => void;
  onNewExam: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  studentName,
  feedbackText,
  onClose,
  onNewExam,
}) => {

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="feedback-modal-backdrop" className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div id="feedback-modal-content" className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-3xl w-full my-8 p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-slate-950 shadow-lg">
              <Award className="w-7 h-7 text-emerald-100" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Valutazione Qualitativa Finale (O.M. 54/2026)
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Resoconto del Colloquio — <span className="text-amber-400">{studentName}</span>
              </h2>
            </div>
          </div>
          <button
            id="close-feedback-modal-btn"
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice badge (Strictly zero numeric grade) */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs sm:text-sm text-amber-200 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            In linea con l'O.M. n. 54/2026, la presente scheda è un'analisi qualitativa delle competenze espressive, critiche ed interdisciplinari. Non viene attribuito un punteggio numerico.
          </span>
        </div>

        {/* Formatted Feedback Content */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-sans text-slate-200 shadow-inner">
          {feedbackText}
        </div>

        {/* Actions Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Stampa / Salva PDF</span>
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs sm:text-sm border border-slate-700 transition-colors"
            >
              Torna alla Chat
            </button>
            <button
              type="button"
              onClick={onNewExam}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4 text-slate-950" />
              <span>Nuovo colloquio</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
