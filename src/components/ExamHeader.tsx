import React, { useState, useEffect } from 'react';
import { ExamPhase } from '../types';
import { RefreshCw, Award, Info, GraduationCap, ShieldCheck, Clock, Play, Pause, RotateCcw, Settings, Eye, EyeOff } from 'lucide-react';

interface ExamHeaderProps {
  studentName: string;
  currentPhase: ExamPhase;
  onFinishAndFeedback: () => void;
  onNewExam: () => void;
  onOpenDocInfo: () => void;
  isLoading: boolean;
}

export const ExamHeader: React.FC<ExamHeaderProps> = ({
  studentName,
  currentPhase,
  onFinishAndFeedback,
  onNewExam,
  onOpenDocInfo,
  isLoading,
}) => {
  const canFinish = currentPhase >= 3;

  // Stopwatch state
  const [seconds, setSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [showTimer, setShowTimer] = useState<boolean>(() => {
    const saved = localStorage.getItem('exam_show_timer');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [showSettingsPopover, setShowSettingsPopover] = useState<boolean>(false);

  // Timer interval effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  // Save showTimer preference
  const toggleShowTimer = (val: boolean) => {
    setShowTimer(val);
    localStorage.setItem('exam_show_timer', JSON.stringify(val));
  };

  // Format seconds to MM:SS or HH:MM:SS
  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');

    if (hrs > 0) {
      return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  return (
    <header id="exam-header" className="bg-slate-900 border-b border-slate-800 px-4 py-3 sticky top-0 z-30 shadow-md">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Title & Student Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 shadow-md shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Il Colloquio — <span className="text-amber-400">{studentName}</span>
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" />
                O.M. 54/2026
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Liceo Artistico "G. Sello" Udine • Classe 5ª S
            </p>
          </div>
        </div>

        {/* Action Buttons & Stopwatch */}
        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">

          {/* Stopwatch Timer Display */}
          {showTimer && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-amber-300 shadow-inner">
              <span className="relative flex h-2 w-2">
                {isRunning && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isRunning ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              </span>
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold text-sm tracking-wider">{formatTime(seconds)}</span>
              
              {/* Quick pause/play button */}
              <button
                type="button"
                onClick={() => setIsRunning(!isRunning)}
                className="ml-1 p-0.5 text-slate-400 hover:text-white transition-colors"
                title={isRunning ? "Pausa cronometro" : "Avvia cronometro"}
              >
                {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-emerald-400" />}
              </button>
            </div>
          )}

          {/* Settings / Timer Option Button */}
          <div className="relative">
            <button
              id="timer-settings-btn"
              type="button"
              onClick={() => setShowSettingsPopover(!showSettingsPopover)}
              className={`p-2 rounded-lg border text-xs font-medium flex items-center justify-center transition-colors ${
                showSettingsPopover
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title="Impostazioni Cronometro"
            >
              <Settings className="w-4 h-4 text-slate-300" />
            </button>

            {/* Dropdown Menu */}
            {showSettingsPopover && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-3 z-50 text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                    Cronometro Colloquio
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSettingsPopover(false)}
                    className="text-slate-400 hover:text-white text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>

                {/* Show/Hide Timer Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Mostra cronometro:</span>
                  <button
                    type="button"
                    onClick={() => toggleShowTimer(!showTimer)}
                    className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 transition-colors ${
                      showTimer
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-700 text-slate-400 border border-slate-600'
                    }`}
                  >
                    {showTimer ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{showTimer ? 'ON' : 'OFF'}</span>
                  </button>
                </div>

                {/* Pause/Resume & Reset Controls */}
                {showTimer && (
                  <div className="space-y-2 pt-1 border-t border-slate-700/60">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Stato:</span>
                      <span className={isRunning ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                        {isRunning ? 'In corso...' : 'In pausa'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsRunning(!isRunning)}
                        className="flex-1 py-1.5 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium flex items-center justify-center gap-1 transition-colors"
                      >
                        {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                        <span>{isRunning ? 'Pausa' : 'Riprendi'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSeconds(0)}
                        className="py-1.5 px-2.5 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white font-medium flex items-center justify-center gap-1 transition-colors"
                        title="Azzera cronometro"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Azzera</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Document Context Info Button */}
          <button
            id="open-doc-info-btn"
            type="button"
            onClick={onOpenDocInfo}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Visualizza contesto del Documento del 15 Maggio"
          >
            <Info className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Doc. 15 Maggio</span>
          </button>

          {/* Finish & Get Feedback Button (Available from Phase 3) */}
          {canFinish && (
            <button
              id="finish-and-feedback-btn"
              type="button"
              onClick={onFinishAndFeedback}
              disabled={isLoading}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-900/30 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Award className="w-4 h-4 text-emerald-200" />
              <span>Termina e ricevi feedback</span>
            </button>
          )}

          {/* New Exam Button */}
          <button
            id="new-exam-btn"
            type="button"
            onClick={onNewExam}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>Nuovo colloquio</span>
          </button>
        </div>

      </div>
    </header>
  );
};
