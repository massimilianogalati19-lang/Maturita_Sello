import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { DOCUMENTO_15_MAGGIO_TEXT } from './src/data/documento15maggioContext';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini API lazily on requests
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY non è configurata nelle variabili d\'ambiente.');
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // API endpoint for exam simulation chat
  app.post('/api/chat', async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(400).json({
          error: 'Chiave API non configurata! Configura la variabile d\'ambiente GEMINI_API_KEY.',
        });
      }

      const {
        studentName,
        extractedSubjects,
        currentPhase,
        messages,
        requestFinalFeedback,
      } = req.body;

      if (!studentName) {
        return res.status(400).json({ error: 'Nome studente mancante' });
      }

      const ai = getGeminiClient();

      const subjectsFormatted = Array.isArray(extractedSubjects) && extractedSubjects.length > 0
        ? extractedSubjects.map((s: string) => `- ${s}`).join('\n')
        : '- Lingua e letteratura italiana (Prof. Galati Massimiliano)\n- Discipline e Lab. Audiovisivo-Multimediale\n- Discipline e Lab. Grafica\n- Storia dell\'Arte';

      const systemInstruction = `
Sei una commissione d'esame dell'esame di maturità 2025/2026 per la classe 5ª S del Liceo Artistico "G. Sello" di Udine, composta da un Presidente di Commissione esterno e due commissari interni.
Conduci il colloquio orale dello studente "${studentName}" seguendo rigorosamente la struttura prevista dall'Ordinanza Ministeriale n. 54 del 26 marzo 2026.

CONOSCI GIÀ:
- Il programma svolto dalla classe (dal Documento del 15 maggio allegato di seguito)
- Le materie estratte per il colloquio dello studente:
${subjectsFormatted}

CONTESTO COMPLETO DEL DOCUMENTO DEL 15 MAGGIO:
${DOCUMENTO_15_MAGGIO_TEXT}

REGOLE ESSENZIALI DEL COLLOQUIO:
1. Segui le 5 fasi nell'ordine corretto:
   - FASE 1 — Apertura (circa 5 minuti): Presentazione/riflessione del candidato sul proprio percorso scolastico, professionale (corso serale), motivazioni e Curriculum dello studente. Domanda della commissione sulla maturità raggiunta.
   - FASE 2 — Quattro discipline (circa 20 minuti): Domande specifiche sulle 4 materie estratte sopra, basandosi sui contenuti reali del Documento del 15 maggio. Stimola collegamenti interdisciplinari e capacità critica.
   - FASE 3 — PCTO (circa 5 minuti): Esperienze di formazione/lavoro e 33h di orientamento (P.F.I.) per adulti. Collegamento con le discipline d'indirizzo.
   - FASE 4 — Educazione Civica (circa 5 minuti): Verifica competenze ed. civica dal programma svolto (Costituzione, tutela Beni Culturali, energie rinnovabili/nucleare, cittadinanza digitale, progetto "Fotografiamo i nostri diritti" o "Let's debate").
   - FASE 5 — Prove scritte (circa 5 minuti): Discussione e riflessione sugli elaborati delle prove scritte (Prima prova d'Italiano, es. Pirandello, Svevo, saggio o saggio breve; Seconda prova pratica d'indirizzo: mostre di grafica o video su Futurismo).

2. FORMATO DELL'INDICATORE DI FASE:
All'inizio di OGNI risposta o domanda della commissione, DEVI inserire una riga con l'indicatore della fase corrente usando la sintassi esatta:
[FASE X di 5 — TITOLO FASE]
Esempi:
[FASE 1 di 5 — APERTURA]
[FASE 2 di 5 — DISCIPLINE | Materia: Italiano]
[FASE 3 di 5 — PCTO]
[FASE 4 di 5 — EDUCAZIONE CIVICA]
[FASE 5 di 5 — PROVE SCRITTE]

3. REGOLE DI INTERAZIONE:
- Fai UNA SOLA DOMANDA ALLA VOLTA. Mai elenchi di domande!
- Personalizza gli interventi specificando chi parla nella commissione quando rilevante (es. "Il Presidente:", "Prof. Galati (Italiano):", "Prof. Londero (Grafica/Audiovisivo):", "Prof. De Pascal (Storia dell'Arte):", "Prof.ssa Stabile (Filosofia/Storia):").
- Per la FASE 2, fai domande pertinenti e calibrate esclusivamente sui programmi del Documento del 15 maggio per le 4 materie estratte.
- Tono: Formale, istituzionale, ma accogliente e professionale. Un vero colloquio di Stato.
- Dai un breve riscontro positivo o un commento di sintesi sulla risposta dello studente prima di formulare la domanda successiva o proporre la transizione alla fase seguente.

4. SE RICHIESTO IL FEEDBACK FINALE (oppure al termine della Fase 5 o quando lo studente clicca "Termina e ricevi feedback"):
Devi fornire una risposta speciale di sintesi finale strutturata chiaramente per sezioni (NON DARE MAI UN VOTO NUMERICO):
- [VALUTAZIONE FINALE E FEEDBACK QUALITATIVO]
- Punti di forza emersi nel colloquio
- Aree da rafforzare
- Consigli per ciascuna delle 5 fasi (Fase 1, Fase 2, Fase 3, Fase 4, Fase 5)
`;

      const contents = messages.map((m: any) => ({
        role: m.sender === 'student' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));

      let promptText = '';
      if (requestFinalFeedback) {
        promptText = `[SISTEMA]: Lo studente ${studentName} ha richiesto di terminare il colloquio e ricevere il feedback finale della commissione. 
Sulla base di tutti gli interventi svolti finora, riunisciti in Camera di Consiglio e fornisci il resoconto valutativo finale qualitativo dettagliato secondo la struttura richiesta:
1. Punti di forza emersi nel colloquio
2. Aree da rafforzare
3. Un consiglio specifico per ciascuna delle 5 fasi dell'orale (Fase 1, Fase 2, Fase 3, Fase 4, Fase 5).
Ricorda: NON attribuire MAI un voto numerico. Tono formale ed incoraggiante.`;
      } else if (contents.length === 0) {
        promptText = `Accogli lo studente ${studentName} con la commissione d'esame. Apri ufficialmente il colloquio della Maturità 2026 e avvia la FASE 1 di 5 (Apertura) invitando lo studente a fare una breve riflessione sul proprio percorso scolastico e personale.
Ricorda di iniziare il messaggio con l'indicatore di fase: [FASE 1 di 5 — APERTURA].`;
      } else {
        // Continue conversation
        const lastMsg = contents[contents.length - 1];
        if (lastMsg.role === 'user') {
          promptText = lastMsg.parts[0].text;
          // remove last message from history array so we pass it in contents parameter
          contents.pop();
        }
      }

      const formattedContents = [
        ...contents,
        {
          role: 'user',
          parts: [{ text: promptText }],
        },
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || 'La commissione sta valutando...';

      return res.json({ text: replyText });
    } catch (err: any) {
      console.error('Errore durante la chiamata a Gemini:', err);
      return res.status(500).json({
        error: err.message || 'Si è verificato un errore nella simulazione della commissione.',
      });
    }
  });

  // Health check route
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'Il Colloquio — Maturità 2026' });
  });

  // Serve static files in production / Vite middleware in dev
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
