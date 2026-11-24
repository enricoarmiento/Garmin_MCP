'use strict';

const AGENSI_COMMAND = 'claude mcp add --transport http agensi https://mcp.agensi.io/mcp/auth';

// Bilingual translations dictionary (Italian & English)
const TRANSLATIONS = {
  "it": {
    "eyebrow": "Skill per Claude Code · Garmin Connect",
    "heroTitle": "I tuoi dati Garmin. Analizzati da Claude.",
    "heroSubtitle1": "Chiedi come hai dormito, se oggi puoi allenarti forte o come stanno andando le tue corse. Claude legge i tuoi dati Garmin e ti risponde con numeri e consigli chiari.",
    "heroSubtitle2": "Tutto in uno: nessun server MCP da installare a parte, nessuna chiave API. Sola lettura: il tuo account Garmin non viene mai modificato.",
    "btnBuy": "Acquista su Agensi",
    "btnDocs": "Come funziona",
    "btnTools": "Cosa puoi chiedere",
    "btnFaq": "Domande frequenti",
    "heroPrice": "3 $ una tantum · Rimborso garantito da Agensi se la skill non fa ciò che promette",
    "heroDisclaimer": "Strumento indipendente, non ufficiale: non è prodotto, approvato né supportato da Garmin. Usa una libreria open source non ufficiale per leggere i dati del tuo account Garmin Connect.",
    "terminalLabel": "COLLEGA AGENSI A CLAUDE CODE",
    "copy": "Copia",
    "copied": "Copiato!",
    "termNote": "Poi in Claude Code scrivi /mcp per accedere ad Agensi e chiedi: «Carica la skill Garmin Connect Reader & Coach e configura Garmin».",
    "trustText": "Account personale · Sola lettura",
    "belowTerminal": "La skill gira sul tuo computer. La password Garmin la scrivi solo tu nel terminale: Claude non la vede mai.",
    "dataStripLabel": "DATI LETTI",
    "metricSleep": "Sonno e fasi",
    "metricReadiness": "HRV e Training Readiness",
    "metricVo2": "VO2max e stato di allenamento",
    "metricActivities": "Attività, giri e zone cardio",
    "metricBattery": "Body Battery e stress",
    "metricRecords": "Record e previsioni gara",
    "previewBadge": "Analisi pronte all'uso",
    "toolsSectionTitle": "Fai domande. Ricevi risposte con i tuoi numeri.",
    "toolsSectionDesc": "Sei analisi guidate incluse nella skill. Claude indica sempre il periodo, i dati usati e i giorni mancanti.",
    "tool1Name": "Report settimanale o mensile",
    "tool1Desc": "Passi, distanza, frequenza a riposo e stress confrontati con il periodo precedente.",
    "tool1Ask": "«Com'è andata la mia settimana?»",
    "tool2Name": "Recupero del giorno",
    "tool2Desc": "Verdetto chiaro (allenati, vai piano, riposa) basato su Training Readiness, HRV, sonno e frequenza a riposo.",
    "tool2Ask": "«Posso fare ripetute oggi?»",
    "tool3Name": "Analisi del sonno",
    "tool3Desc": "Durata, punteggio, fasi profondo/REM/leggero, regolarità; notte migliore e peggiore.",
    "tool3Ask": "«Come ho dormito questa settimana?»",
    "tool4Name": "Confronto corse e uscite",
    "tool4Desc": "Tabella con passo, battito, dislivello ed efficienza; per una sessione: giri, zone cardio e meteo.",
    "tool4Ask": "«Confronta le mie ultime 10 corse»",
    "tool5Name": "Progressi di forma",
    "tool5Desc": "VO2max nel tempo, stato di allenamento, record personali e previsioni dei tempi di gara.",
    "tool5Ask": "«Il mio VO2max sta migliorando?»",
    "tool6Name": "Stress ed energia",
    "tool6Desc": "Stress medio e picchi con Body Battery, messi in relazione a sonno e allenamenti.",
    "tool6Ask": "«Perché sono così stanco ultimamente?»",
    "guideEyebrow": "COME FUNZIONA",
    "guideTitle": "Tre passaggi, una volta sola.",
    "step1Title": "Acquista e collega",
    "step1Desc": "Acquista la skill su Agensi, collega Agensi a Claude Code con il comando qui sopra e chiedi a Claude di caricarla.",
    "step2Title": "Accedi a Garmin dal tuo terminale",
    "step2Desc": "Claude prepara tutto e ti dà un comando: lo esegui tu, inserisci email, password ed eventuale codice MFA. Python si installa da solo.",
    "step3Title": "Chiedi quello che vuoi",
    "step3Desc": "Da quel momento basta parlare con Claude: sonno, recupero, allenamenti e trend, nella tua lingua.",
    "examplePromptText": "“Posso fare ripetute oggi? E confronta il mio sonno con la settimana scorsa.”",
    "examplePromptAction": "Copia esempio",
    "faqTitle": "Domande frequenti",
    "faq1Q": "Cosa mi serve?",
    "faq1A": "Un account Garmin Connect con l'orologio sincronizzato, Claude Code su macOS o Linux e una connessione internet. Serve anche uv, il gestore Python: se manca, Claude ti chiede il permesso e lo installa. Python e le librerie si installano da soli.",
    "faq2Q": "Funziona nella chat di claude.ai o su Windows?",
    "faq2A": "La skill ha bisogno di un terminale sul tuo computer, quindi è pensata per Claude Code (app desktop o terminale), non per la chat web. Windows non è ancora stato testato.",
    "faq3Q": "La mia password è al sicuro?",
    "faq3A": "La password la scrivi solo tu, nel tuo terminale, e non viene salvata. Claude non la vede mai. Sul computer restano solo i token di sessione Garmin, nella cartella privata ~/.garmin-mcp: per scollegarti basta eliminarla.",
    "faq4Q": "Può modificare o cancellare i miei dati su Garmin?",
    "faq4A": "No. La skill è in sola lettura: non carica, modifica o cancella attività e metriche. Le posizioni GPS non vengono mostrate se non le chiedi.",
    "faq5Q": "Dove finiscono i miei dati sanitari?",
    "faq5A": "I dati vanno da Garmin al tuo computer e arrivano a Claude solo quando fai una domanda. Il loro trattamento dipende dalle impostazioni del tuo account Claude. La skill non invia dati altrove.",
    "faq6Q": "Cosa succede se un dato manca o Garmin non risponde?",
    "faq6A": "Claude lo dice chiaramente: un dato mancante non viene mai trattato come zero. Alcune metriche (Training Readiness, HRV, VO2max) dipendono dal modello di orologio. Se Garmin limita le richieste, Claude si ferma e ti dice quanto aspettare.",
    "faq7Q": "È un prodotto ufficiale Garmin? Dà consigli medici?",
    "faq7A": "No a entrambe. È un progetto indipendente basato sulla libreria non ufficiale python-garminconnect: un cambiamento lato Garmin può bloccare temporaneamente l'accesso fino a un aggiornamento. Le analisi sono descrittive e non sostituiscono un medico.",
    "footerText": "Garmin Connect Reader & Coach · Progetto indipendente e non ufficiale, non affiliato, approvato o sponsorizzato da Garmin. Garmin, Garmin Connect e Body Battery sono marchi di Garmin Ltd. o delle sue consociate.",
    "footerAgensi": "Pagina su Agensi ↗",
    "footerLibrary": "Libreria Garmin Connect ↗",
    "footerClaude": "Claude Code ↗",
    "modalKicker": "Installazione",
    "modalTitle": "Istruzioni complete",
    "modalStep1": "Acquista la skill su Agensi (link in alto).",
    "modalStep2": "Nel terminale, collega Agensi a Claude Code:",
    "modalStep3": "Apri Claude Code, scrivi /mcp, scegli agensi e accedi con il tuo account.",
    "modalStep4": "Chiedi: «Carica la skill Garmin Connect Reader & Coach e configura Garmin». Claude prepara tutto e ti dà il comando di login: eseguilo in un terminale separato.",
    "close": "Chiudi",
    "navigationLabel": "Navigazione principale",
    "navTools": "Cosa chiedere",
    "navGuide": "Come funziona",
    "navFaq": "FAQ",
    "languageLabel": "Lingua",
    "installationLabel": "Installazione",
    "copyCommand": "Copia comando",
    "copyExample": "Copia esempio",
    "metricsLabel": "Dati Garmin disponibili",
    "closeDialog": "Chiudi istruzioni",
    "copyFailed": "Copia non riuscita. Seleziona e copia il testo manualmente.",
    "pageTitle": "Garmin Connect Reader & Coach — I tuoi dati Garmin, analizzati da Claude",
    "pageDescription": "Skill per Claude Code: legge in sola lettura sonno, HRV, Training Readiness, VO2max e attività dal tuo account Garmin Connect e li trasforma in report e consigli."
  },
  "en": {
    "eyebrow": "Claude Code skill · Garmin Connect",
    "heroTitle": "Your Garmin data. Analysed by Claude.",
    "heroSubtitle1": "Ask how you slept, whether you can train hard today or how your runs are going. Claude reads your Garmin data and answers with clear numbers and advice.",
    "heroSubtitle2": "All-in-one: no separate MCP server to install, no API key. Read-only: your Garmin account is never modified.",
    "btnBuy": "Buy on Agensi",
    "btnDocs": "How it works",
    "btnTools": "What you can ask",
    "btnFaq": "FAQ",
    "heroPrice": "$3 one-time · Agensi refunds you if the skill doesn't do what it promises",
    "heroDisclaimer": "Independent, unofficial tool: not made, endorsed or supported by Garmin. It uses an unofficial open-source library to read data from your Garmin Connect account.",
    "terminalLabel": "CONNECT AGENSI TO CLAUDE CODE",
    "copy": "Copy",
    "copied": "Copied!",
    "termNote": "Then in Claude Code type /mcp to sign in to Agensi and ask: “Load the Garmin Connect Reader & Coach skill and set up Garmin”.",
    "trustText": "Personal account · Read-only",
    "belowTerminal": "The skill runs on your computer. You type your Garmin password only in your own terminal: Claude never sees it.",
    "dataStripLabel": "DATA IT READS",
    "metricSleep": "Sleep & stages",
    "metricReadiness": "HRV & Training Readiness",
    "metricVo2": "VO2max & training status",
    "metricActivities": "Activities, laps & HR zones",
    "metricBattery": "Body Battery & stress",
    "metricRecords": "Records & race predictions",
    "previewBadge": "Ready-made analyses",
    "toolsSectionTitle": "Ask questions. Get answers with your numbers.",
    "toolsSectionDesc": "Six guided analyses included in the skill. Claude always states the period, the data used and any missing days.",
    "tool1Name": "Weekly or monthly report",
    "tool1Desc": "Steps, distance, resting heart rate and stress compared with the previous period.",
    "tool1Ask": "“How was my week?”",
    "tool2Name": "Daily recovery",
    "tool2Desc": "A clear verdict (train, go easy, rest) based on Training Readiness, HRV, sleep and resting heart rate.",
    "tool2Ask": "“Can I do intervals today?”",
    "tool3Name": "Sleep review",
    "tool3Desc": "Duration, score, deep/REM/light stages, consistency; best and worst night.",
    "tool3Ask": "“How did I sleep this week?”",
    "tool4Name": "Run & ride comparison",
    "tool4Desc": "Table with pace, heart rate, elevation and efficiency; for one session: laps, HR zones and weather.",
    "tool4Ask": "“Compare my last 10 runs”",
    "tool5Name": "Fitness progress",
    "tool5Desc": "VO2max over time, training status, personal records and race time predictions.",
    "tool5Ask": "“Is my VO2max improving?”",
    "tool6Name": "Stress & energy",
    "tool6Desc": "Average and peak stress with Body Battery, related to sleep and workouts.",
    "tool6Ask": "“Why am I so tired lately?”",
    "guideEyebrow": "HOW IT WORKS",
    "guideTitle": "Three steps, only once.",
    "step1Title": "Buy and connect",
    "step1Desc": "Buy the skill on Agensi, connect Agensi to Claude Code with the command above and ask Claude to load it.",
    "step2Title": "Sign in to Garmin from your terminal",
    "step2Desc": "Claude prepares everything and gives you one command: you run it and enter your email, password and MFA code if asked. Python installs itself.",
    "step3Title": "Ask anything",
    "step3Desc": "From then on, just talk to Claude: sleep, recovery, training and trends, in your language.",
    "examplePromptText": "“Can I do intervals today? And compare my sleep with last week.”",
    "examplePromptAction": "Copy example",
    "faqTitle": "Frequently Asked Questions",
    "faq1Q": "What do I need?",
    "faq1A": "A Garmin Connect account with a synced watch, Claude Code on macOS or Linux and an internet connection. You also need uv, the Python manager: if it's missing, Claude asks permission and installs it. Python and libraries install themselves.",
    "faq2Q": "Does it work in claude.ai chat or on Windows?",
    "faq2A": "The skill needs a terminal on your computer, so it is built for Claude Code (desktop app or terminal), not web chat. Windows has not been tested yet.",
    "faq3Q": "Is my password safe?",
    "faq3A": "You type your password only in your own terminal and it is not stored. Claude never sees it. Only Garmin session tokens stay on your computer, in the private ~/.garmin-mcp folder: delete it to sign out.",
    "faq4Q": "Can it modify or delete my data on Garmin?",
    "faq4A": "No. The skill is read-only: it never uploads, edits or deletes activities or metrics. GPS locations are not shown unless you ask.",
    "faq5Q": "Where does my health data go?",
    "faq5A": "Data travels from Garmin to your computer and reaches Claude only when you ask a question. How it is handled depends on your Claude account settings. The skill sends data nowhere else.",
    "faq6Q": "What if data is missing or Garmin doesn't respond?",
    "faq6A": "Claude says so clearly: missing data is never treated as zero. Some metrics (Training Readiness, HRV, VO2max) depend on your watch model. If Garmin rate-limits requests, Claude stops and tells you how long to wait.",
    "faq7Q": "Is it an official Garmin product? Does it give medical advice?",
    "faq7A": "No to both. It is an independent project built on the unofficial python-garminconnect library: a change on Garmin's side can temporarily block access until an update. Analyses are descriptive and do not replace a doctor.",
    "footerText": "Garmin Connect Reader & Coach · Independent, unofficial project, not affiliated with, endorsed or sponsored by Garmin. Garmin, Garmin Connect and Body Battery are trademarks of Garmin Ltd. or its subsidiaries.",
    "footerAgensi": "Agensi page ↗",
    "footerLibrary": "Garmin Connect library ↗",
    "footerClaude": "Claude Code ↗",
    "modalKicker": "Installation",
    "modalTitle": "Full instructions",
    "modalStep1": "Buy the skill on Agensi (link above).",
    "modalStep2": "In your terminal, connect Agensi to Claude Code:",
    "modalStep3": "Open Claude Code, type /mcp, choose agensi and sign in with your account.",
    "modalStep4": "Ask: “Load the Garmin Connect Reader & Coach skill and set up Garmin”. Claude prepares everything and gives you the login command: run it in a separate terminal.",
    "close": "Close",
    "navigationLabel": "Main navigation",
    "navTools": "What to ask",
    "navGuide": "How it works",
    "navFaq": "FAQ",
    "languageLabel": "Language",
    "installationLabel": "Installation",
    "copyCommand": "Copy command",
    "copyExample": "Copy example",
    "metricsLabel": "Available Garmin data",
    "closeDialog": "Close instructions",
    "copyFailed": "Copy failed. Please select and copy the text manually.",
    "pageTitle": "Garmin Connect Reader & Coach — Your Garmin data, analysed by Claude",
    "pageDescription": "Claude Code skill: reads sleep, HRV, Training Readiness, VO2max and activities from your Garmin Connect account, read-only, and turns them into reports and advice."
  }
};

function preferredLanguage() {
  try {
    const saved = localStorage.getItem('garmin_mcp_lang');
    if (saved === 'it' || saved === 'en') return saved;
  } catch { /* Storage may be unavailable in private browsing. */ }
  return (navigator.language || 'it').toLowerCase().startsWith('it') ? 'it' : 'en';
}
let currentLang = preferredLanguage();

const el = id => document.getElementById(id);
let toastTimeout;

function showToast(message) {
  const toast = el('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('visible'), 3200);
}

async function copyToClipboard(text, successMsg) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      showToast(successMsg);
      return true;
    }
  } catch (err) {
    console.warn('Clipboard API fallback', err);
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '0';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand('copy');
  textarea.remove();
  showToast(ok ? successMsg : TRANSLATIONS[currentLang].copyFailed);
  return ok;
}

function renderUI() {
  const t = TRANSLATIONS[currentLang];
  document.documentElement.lang = currentLang;
  document.title = t.pageTitle;
  document.querySelector('meta[name="description"]').content = t.pageDescription;
  document.querySelector('meta[property="og:title"]').content = t.pageTitle;
  document.querySelector('meta[property="og:description"]').content = t.pageDescription;
  document.querySelectorAll('[data-i18n-aria]').forEach(elem => {
    elem.setAttribute('aria-label', t[elem.dataset.i18nAria]);
  });
  document.querySelectorAll('[data-i18n]').forEach(elem => {
    const key = elem.getAttribute('data-i18n');
    if (t[key] !== undefined) elem.textContent = t[key];
  });
  document.querySelectorAll('[data-lang]').forEach(btn => {
    const active = btn.dataset.lang === currentLang;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
}

function setLanguage(lang) {
  if (lang !== 'it' && lang !== 'en') return;
  currentLang = lang;
  try { localStorage.setItem('garmin_mcp_lang', lang); } catch { /* Keep language usable without storage. */ }
  renderUI();
}

function initEventListeners() {
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });

  const copyBtn = el('btn-copy');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const t = TRANSLATIONS[currentLang];
      const copied = await copyToClipboard(AGENSI_COMMAND, t.copied);
      const copyText = el('copy-text');
      if (copyText && copied) {
        copyText.textContent = t.copied;
        setTimeout(() => { copyText.textContent = TRANSLATIONS[currentLang].copy; }, 1800);
      }
    });
  }

  const copyPromptBtn = el('btn-copy-prompt');
  if (copyPromptBtn) {
    const copyPrompt = () => {
      const promptText = el('example-prompt-text').textContent.replace(/[“”"]/g, '').trim();
      copyToClipboard(promptText, TRANSLATIONS[currentLang].copied);
    };
    copyPromptBtn.addEventListener('click', copyPrompt);
    copyPromptBtn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); copyPrompt(); }
    });
  }

  const setupDialog = el('setup-dialog');
  if (setupDialog) {
    const closeModal = () => setupDialog.close();
    el('btn-modal-open')?.addEventListener('click', () => setupDialog.showModal());
    el('modal-close')?.addEventListener('click', closeModal);
    el('modal-dismiss')?.addEventListener('click', closeModal);
    setupDialog.addEventListener('click', e => {
      if (e.target !== setupDialog) return;
      const b = setupDialog.getBoundingClientRect();
      if (e.clientX < b.left || e.clientX > b.right || e.clientY < b.top || e.clientY > b.bottom) closeModal();
    });
    el('modal-copy-btn')?.addEventListener('click', () => {
      copyToClipboard(AGENSI_COMMAND, TRANSLATIONS[currentLang].copied);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initEventListeners();
  renderUI();
});
