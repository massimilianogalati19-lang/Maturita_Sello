import React, { useState } from 'react';
import { DEFAULT_CLASS_INFO, DEFAULT_SUBJECTS, AVAILABLE_SUBJECTS_LIST } from '../data/documento15maggioContext';
import { GraduationCap, BookOpen, Sparkles, CheckCircle2, CheckSquare, Square, Shuffle } from 'lucide-react';

interface WelcomeFormProps {
  onStartExam: (studentName: string, selectedSubjects: string[]) => void;
}

export const WelcomeForm: React.FC<WelcomeFormProps> = ({ onStartExam }) => {
  const [studentName, setStudentName] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(DEFAULT_SUBJECTS);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      setErrorMsg('Per favore, inserisci il tuo nome e cognome per iniziare.');
      return;
    }
    if (selectedSubjects.length === 0) {
      setErrorMsg('Seleziona almeno una materia per il colloquio.');
      return;
    }
    setErrorMsg('');
    onStartExam(studentName.trim(), selectedSubjects);
  };

  const toggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
    } else {
      if (selectedSubjects.length >= 4) {
        // If already 4 selected, replace or limit? We can allow up to 4 or show tip
        setErrorMsg('Puoi selezionare fino a un massimo di 4 materie per il colloquio.');
        setTimeout(() => setErrorMsg(''), 3000);
        return;
      }
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  // Presets helper
  const handleSelectPreset = (presetType: 'standard' | 'audiovisivo' | 'grafica' | 'all') => {
    setErrorMsg('');
    if (presetType === 'standard') {
      setSelectedSubjects(DEFAULT_SUBJECTS);
    } else if (presetType === 'audiovisivo') {
      setSelectedSubjects([
        "Lingua e letteratura italiana",
        "Discipline e Lab. Audiovisivo-Multimediale",
        "Storia dell'Arte",
        "Filosofia e Storia",
      ]);
    } else if (presetType === 'grafica') {
      setSelectedSubjects([
        "Lingua e letteratura italiana",
        "Discipline e Lab. Grafica",
        "Storia dell'Arte",
        "Lingua e cultura inglese",
      ]);
    } else if (presetType === 'all') {
      setSelectedSubjects(AVAILABLE_SUBJECTS_LIST.slice(0, 4));
    }
  };

  const handleRandomSelect = () => {
    const shuffled = [...AVAILABLE_SUBJECTS_LIST].sort(() => 0.5 - Math.random());
    setSelectedSubjects(shuffled.slice(0, 4));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between p-4 sm:p-6 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto w-full my-auto py-6">
        
        {/* Header Badge */}
        <div className="flex justify-center mb-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-medium">
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>Esame di Stato 2025/2026 — {DEFAULT_CLASS_INFO.school}</span>
          </div>
        </div>

        {/* Main Title & Subtitle */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2">
            Il Colloquio — Maturità 2026
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 font-light max-w-xl mx-auto">
            Simulatore del colloquio orale
          </p>
          <div className="mt-1 text-xs sm:text-sm text-slate-400 font-medium">
            {DEFAULT_CLASS_INFO.className} • {DEFAULT_CLASS_INFO.specialization}
          </div>
        </div>

        {/* Card Form */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 sm:p-7 shadow-2xl backdrop-blur-sm space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Student Name Field */}
            <div>
              <label 
                htmlFor="student-name-input"
                className="block text-sm font-semibold text-slate-200 mb-2"
              >
                1. Il tuo nome e cognome
              </label>
              <input
                id="student-name-input"
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="es. Mario Rossi"
                className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-600/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-base"
                autoFocus
              />
            </div>

            {/* Subject Selection Section */}
            <div className="bg-slate-900/80 rounded-xl border border-slate-700/80 p-4 sm:p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2 text-sm sm:text-base font-semibold text-amber-400">
                    <BookOpen className="w-4 h-4" />
                    <span>2. Scegli le materie per questo colloquio</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Seleziona da 1 a 4 materie d'esame dal Documento del 15 Maggio di classe
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-xs text-slate-400 font-mono">
                    Selezionate: <strong className={selectedSubjects.length > 0 ? 'text-amber-400 font-bold' : 'text-slate-500'}>{selectedSubjects.length} / 4</strong>
                  </span>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="text-slate-500 font-medium mr-1">Combinazioni rapide:</span>
                <button
                  type="button"
                  onClick={() => handleSelectPreset('standard')}
                  className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                >
                  Standard (4 principali)
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectPreset('grafica')}
                  className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                >
                  Focus Grafica
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectPreset('audiovisivo')}
                  className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                >
                  Focus Audiovisivo
                </button>
                <button
                  type="button"
                  onClick={handleRandomSelect}
                  className="px-2 py-1 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors flex items-center gap-1"
                  title="Estrazione casuale 4 materie"
                >
                  <Shuffle className="w-3 h-3" />
                  <span>Estrazione casuale</span>
                </button>
              </div>

              {/* Subject Options Grid */}
              <div className="grid grid-cols-1 gap-2.5 pt-1">
                {AVAILABLE_SUBJECTS_LIST.map((subject) => {
                  const isSelected = selectedSubjects.includes(subject);
                  return (
                    <button
                      key={subject}
                      type="button"
                      onClick={() => toggleSubject(subject)}
                      className={`w-full text-left px-3.5 py-3 rounded-xl border text-xs sm:text-sm flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500/60 text-amber-200 font-medium shadow-sm'
                          : 'bg-slate-800/50 border-slate-700/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate pr-2">
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-amber-400 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-600 shrink-0" />
                        )}
                        <span className="truncate">{subject}</span>
                      </div>
                      {isSelected && (
                        <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 shrink-0">
                          Selezionata
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-lg text-red-300 text-sm flex items-center gap-2">
                <span>⚠️ {errorMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              id="start-exam-button"
              type="submit"
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-base sm:text-lg shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <Sparkles className="w-5 h-5 text-slate-950" />
              <span>Inizia il colloquio ({selectedSubjects.length} {selectedSubjects.length === 1 ? 'materia' : 'materie'})</span>
            </button>

          </form>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-5 text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
          <p id="regulatory-note">
            Questa simulazione segue la struttura del colloquio orale prevista dall'O.M. n. 54 del 26 marzo 2026.
          </p>
        </div>

      </div>

      {/* Credits */}
      <footer className="text-center text-xs text-slate-500 py-2 border-t border-slate-800/60">
        Liceo Artistico Statale "G. Sello" Udine • Classe 5ª S • Simulatore Esame Orale 2026
      </footer>
    </div>
  );
};

