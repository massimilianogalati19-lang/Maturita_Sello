export type ExamPhase = 1 | 2 | 3 | 4 | 5 | 6;

export interface PhaseInfo {
  id: ExamPhase;
  title: string;
  shortTitle: string;
  subtitle: string;
  estimatedTime: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  sender: 'commission' | 'student' | 'system';
  speakerName?: string; // e.g. "Presidente di Commissione", "Prof. Galati (Italiano)", "Prof. Londero (Grafica/Audiovisivo)"
  text: string;
  phase: ExamPhase;
  timestamp: number;
}

export interface ExamConfig {
  studentName: string;
  extractedSubjects: string[];
  classInfo: {
    school: string;
    className: string;
    specialization: string;
    year: string;
  };
}

export interface FinalFeedback {
  strengths: string[];
  areasToImprove: string[];
  phaseAdvice: {
    phase1: string;
    phase2: string;
    phase3: string;
    phase4: string;
    phase5: string;
  };
  overallComments: string;
}
