import React from 'react';
import { PHASES_LIST } from '../data/documento15maggioContext';
import { ExamPhase } from '../types';
import { BookOpen, User, Briefcase, Landmark, FileText, CheckCircle2 } from 'lucide-react';

interface PhaseProgressProps {
  currentPhase: ExamPhase;
  onSelectPhase?: (phase: ExamPhase) => void;
}

const PHASE_ICONS: Record<number, React.ReactNode> = {
  1: <User className="w-4 h-4" />,
  2: <BookOpen className="w-4 h-4" />,
  3: <Briefcase className="w-4 h-4" />,
  4: <Landmark className="w-4 h-4" />,
  5: <FileText className="w-4 h-4" />,
};

export const PhaseProgress: React.FC<PhaseProgressProps> = ({ currentPhase }) => {
  const currentPhaseData = PHASES_LIST.find((p) => p.id === currentPhase) || PHASES_LIST[0];

  return (
    <div id="phase-progress-bar" className="bg-slate-900/90 border-b border-slate-800 p-3 sm:p-4">
      {/* Active Phase Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs sm:text-sm tracking-wide uppercase">
            {PHASE_ICONS[currentPhase]}
            <span>[FASE {currentPhase} di 5 — {currentPhaseData.title.split('—')[1]?.trim() || currentPhaseData.title}]</span>
          </span>
          <span className="text-xs text-slate-400 hidden md:inline-block font-mono">
            ⏱ {currentPhaseData.estimatedTime}
          </span>
        </div>
        <p className="text-xs text-slate-300 line-clamp-1 italic">
          {currentPhaseData.subtitle}
        </p>
      </div>

      {/* Stepper bar across 5 phases */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {PHASES_LIST.map((phase) => {
          const isCurrent = phase.id === currentPhase;
          const isPassed = phase.id < currentPhase;

          return (
            <div
              key={phase.id}
              className={`relative rounded-lg p-2 transition-all flex flex-col items-center text-center ${
                isCurrent
                  ? 'bg-amber-500/15 border-2 border-amber-500 text-amber-300 shadow-md shadow-amber-500/10'
                  : isPassed
                  ? 'bg-slate-800/80 border border-emerald-500/40 text-emerald-400'
                  : 'bg-slate-900/50 border border-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold uppercase">
                {isPassed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <span className="w-3.5 h-3.5 flex items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold">
                    {phase.id}
                  </span>
                )}
                <span className="hidden sm:inline truncate">{phase.shortTitle.split('—')[1]?.trim()}</span>
              </div>

              {/* Mobile text label */}
              <span className="text-[9px] sm:hidden mt-0.5 truncate font-medium">
                F{phase.id}: {phase.shortTitle.split('—')[1]?.trim()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
