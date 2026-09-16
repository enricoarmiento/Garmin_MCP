'use strict';

// Base download URL for installers
const BASE_URL = 'https://garmin-mcp-connect.enricoarmiento.chatgpt.site';

// Bilingual translations dictionary (Italian & English)
const TRANSLATIONS = {
  it: {
    previewBadge: "Preview",
    eyebrow: "Garmin MCP developer preview",
    heroTitle: "I tuoi dati, in conversazione",
    heroSubtitle1: "Garmin MCP è disponibile in anteprima per Google Antigravity, DeepSeek Harness, Claude e Codex — codice sorgente locale incluso.",
    heroSubtitle2: "Ogni metrica è uno strumento interrogabile con privacy locale: attività, fasi del sonno, battito cardiaco, stress, body battery e trend a 30 giorni direttamente nel tuo assistente AI preferito.",
    btnGithub: "Vedi su GitHub",
    btnDocs: "Guida setup",
    btnTools: "Strumenti MCP",
    btnDownload: "Scarica sorgenti",
    tabQuickstart: "Avvio rapido",
    tabSource: "Sorgente",
    tabClaude: "Claude Desktop",
    tabCodex: "Codex",
    copy: "Copia",
    copied: "Copiato!",
    termNoteMac: "Incolla nel Terminale. Il comando prepara il collegamento.",
    termNoteWin: "Incolla in PowerShell. Il comando prepara il collegamento.",
    termNoteLinux: "Incolla nel Terminale Linux. Il comando prepara il collegamento.",
    termNoteAntigravity: "Configura Garmin MCP in Google Antigravity IDE (~/.gemini/antigravity-ide/mcp_config.json).",
    termNoteDeepseek: "Configura Garmin MCP per DeepSeek Harness (~/.dsh/mcp_config.json o dsh CLI).",
    termNoteClaude: "Configurazione automatica del server locale stdio per Claude Desktop.",
    termNoteCodex: "Configurazione del server stdio per Codex (~/.codex/config.toml).",
    termNoteSource: "Clona il repository GitHub, sincronizza le dipendenze con uv ed effettua il login locale.",
    trustText: "Account personale · Accesso sola lettura · Dati locali",
    belowTerminal: "Installazione locale in sola lettura. Nessun server intermedio né tracciamento.",
    dataStripLabel: "IL TUO GARMIN, IN CONVERSAZIONE",
    metricActivities: "Attività e giri",
    metricSleep: "Fasi del sonno",
    metricHeart: "Battito cardiaco",
    metricStress: "Stress & HRV",
    metricBattery: "Body Battery",
    metricTrends: "Trend fino a 31gg",
    toolsSectionTitle: "Strumenti MCP disponibili",
    toolsSectionDesc: "Cinque strumenti nativi pronti all'uso per il protocollo Model Context Protocol.",
    tool1Desc: "Verifica locale della validità dei token di sessione senza chiamate di rete.",
    tool2Desc: "Recupera riepilogo giornaliero, sonno dettagliato, battito, stress e body battery.",
    tool3Desc: "Elenco delle attività recenti con paginazione, tipo sport e metriche aggregate.",
    tool4Desc: "Dettaglio completo della singola sessione con giri, split e frequenze cardiache.",
    tool5Desc: "Analisi di serie storiche e andamenti da 1 a 31 giorni con calcolo medie.",
    guideEyebrow: "Pochi passi, sul tuo computer",
    guideTitle: "Dai numeri alle risposte.",
    step1Num: "01",
    step1Title: "Scegli il tuo assistente",
    step1Desc: "Google Antigravity, DeepSeek Harness, Claude Desktop o Codex. Seleziona il client e il tuo sistema operativo.",
    step2Num: "02",
    step2Title: "Accedi a Garmin in locale",
    step2Desc: "Esegui il login nel tuo terminale. I token rimangono crittografati sul tuo computer (0600).",
    step3Num: "03",
    step3Title: "Inizia a conversare",
    step3Desc: "Riavvia il client AI e chiedi di analizzare i tuoi dati biometrici e le attività sportive.",
    examplePromptText: "“Usa Garmin per analizzare il mio sonno e il trend di stress degli ultimi 7 giorni.”",
    examplePromptAction: "Copia richiesta ↗",
    faqTitle: "Domande frequenti",
    faq1Q: "Posso collegarlo direttamente dal browser?",
    faq1A: "No. Il server MCP è un processo locale avviato via stdio. Il browser serve solo per consultare la documentazione o scaricare l'installer: l'esecuzione avviene unicamente sulla tua macchina.",
    faq2Q: "Dove vengono salvate le credenziali e i miei dati sanitari?",
    faq2A: "Le tue credenziali non vengono mai inviate a server terzi. Il login avviene direttamente tra il tuo terminale e Garmin Connect. I token sono salvati nella cartella locale ~/.garmin-mcp protetta con permessi restrittivi (0700/0600).",
    faq3Q: "Quali client sono supportati?",
    faq3A: "Supporta ufficialmente Google Antigravity IDE, DeepSeek Harness, Claude Desktop (macOS e Windows) e Codex / qualsiasi altro client compatibile con le specifiche Model Context Protocol (stdio).",
    faq4Q: "Il server può modificare o cancellare i miei dati su Garmin?",
    faq4A: "Assolutamente no. Il server è strettamente in sola lettura (read-only): non contiene alcuna API per inviare, modificare o cancellare attività o metriche su Garmin Connect.",
    footerText: "Garmin MCP · Progetto Open Source indipendente",
    footerSource: "Sorgente ZIP",
    footerRepo: "GitHub Repo",
    footerLibrary: "Libreria Garmin Connect ↗",
    modalTitle: "Istruzioni di installazione",
    modalStep1: "Esegui il comando di avvio rapido nel tuo terminale locale:",
    modalStep2: "Effettua il login a Garmin Connect inserendo credenziali e codice MFA se richiesto.",
    modalStep3: "Riavvia Google Antigravity, DeepSeek Harness, Claude o Codex per caricare i nuovi strumenti.",
    close: "Chiudi"
  },
  en: {
    previewBadge: "Preview",
    eyebrow: "Garmin MCP developer preview",
    heroTitle: "Everything is a tool",
    heroSubtitle1: "Garmin MCP is now in developer preview for Google Antigravity, DeepSeek Harness, Claude, and Codex — source code included.",
    heroSubtitle2: "Every capability is a plugin that can be swapped or queried: daily summaries, sleep stages, heart rate, stress, body battery, activities, and 30-day trends.",
    btnGithub: "View on GitHub",
    btnDocs: "Developer docs",
    btnTools: "MCP Tools",
    btnDownload: "Download package",
    tabQuickstart: "Quick start",
    tabSource: "Source",
    tabClaude: "Claude Desktop",
    tabCodex: "Codex",
    copy: "Copy",
    copied: "Copied!",
    termNoteMac: "Paste into Terminal. The command prepares the connection.",
    termNoteWin: "Paste into PowerShell. The command prepares the connection.",
    termNoteLinux: "Paste into Linux Terminal. The command prepares the connection.",
    termNoteAntigravity: "Configures Garmin MCP in Google Antigravity IDE (~/.gemini/antigravity-ide/mcp_config.json).",
    termNoteDeepseek: "Configures Garmin MCP for DeepSeek Harness (~/.dsh/mcp_config.json or dsh CLI).",
    termNoteClaude: "Automatic stdio configuration for Claude Desktop on your computer.",
    termNoteCodex: "Configure local stdio server for Codex (~/.codex/config.toml).",
    termNoteSource: "Clone the GitHub repository, synchronize dependencies with uv, and authenticate locally.",
    trustText: "Personal account · Read-only access · Strictly local",
    belowTerminal: "Local read-only installation. No intermediate servers or telemetry.",
    dataStripLabel: "YOUR GARMIN, IN CONVERSATION",
    metricActivities: "Activities & Laps",
    metricSleep: "Sleep Stages",
    metricHeart: "Heart Rate",
    metricStress: "Stress & HRV",
    metricBattery: "Body Battery",
    metricTrends: "Trends up to 31d",
    toolsSectionTitle: "Available MCP Tools",
    toolsSectionDesc: "Five native read-only tools adhering to the Model Context Protocol standard.",
    tool1Desc: "Check presence and local validity of session tokens without any network roundtrip.",
    tool2Desc: "Fetch daily health summaries, granular sleep phases, resting HR, stress, and body battery.",
    tool3Desc: "List recent workouts with pagination, sport types, distance, and duration metrics.",
    tool4Desc: "Deep-dive into a specific activity with split times, elevation, and lap-by-lap heart rate.",
    tool5Desc: "Extract historical time series from 1 to 31 days with automatic average calculations.",
    guideEyebrow: "Few steps on your machine",
    guideTitle: "From raw metrics to answers.",
    step1Num: "01",
    step1Title: "Choose your assistant",
    step1Desc: "Google Antigravity, DeepSeek Harness, Claude Desktop, or Codex. Select your client and operating system.",
    step2Num: "02",
    step2Title: "Local Garmin login",
    step2Desc: "Authenticate via your local terminal. Access tokens remain encrypted on your device (0600).",
    step3Num: "03",
    step3Title: "Start chatting",
    step3Desc: "Relaunch your AI client and ask questions about your health, activities, and recovery trends.",
    examplePromptText: "“Use Garmin to analyze my sleep stages and stress trends over the last 7 days.”",
    examplePromptAction: "Copy prompt ↗",
    faqTitle: "Frequently Asked Questions",
    faq1Q: "Can I connect directly from the web browser?",
    faq1A: "No. The MCP server runs locally as a native stdio child process. This web page provides documentation and installation commands: execution happens solely on your personal computer.",
    faq2Q: "Where are my credentials and biometric data stored?",
    faq2A: "Your credentials are never sent to third-party servers. Login takes place directly between your terminal and Garmin Connect. Access tokens are stored in ~/.garmin-mcp with strict permissions (0700/0600).",
    faq3Q: "Which AI clients are supported?",
    faq3A: "Officially supports Google Antigravity IDE, DeepSeek Harness, Claude Desktop (macOS & Windows), and Codex or any client compatible with the Model Context Protocol stdio specification.",
    faq4Q: "Can this server modify or delete my data on Garmin Connect?",
    faq4A: "Never. The server is strictly read-only: it provides zero APIs or capabilities to write, upload, modify, or erase data on Garmin Connect.",
    footerText: "Garmin MCP · Independent Open Source Project",
    footerSource: "Source ZIP",
    footerRepo: "GitHub Repo",
    footerLibrary: "Garmin Connect Library ↗",
    modalTitle: "Installation Instructions",
    modalStep1: "Run the quickstart command inside your local terminal:",
    modalStep2: "Log in to Garmin Connect entering your email, password, and MFA code if prompted.",
    modalStep3: "Relaunch Google Antigravity, DeepSeek Harness, Claude, or Codex to register the new MCP server tools.",
    close: "Close"
  }
};

// Application State
let currentLang = localStorage.getItem('garmin_mcp_lang') || 'it';
let activeTab = 'quickstart';
let targetClient = 'antigravity';
let currentOs = 'mac';

// Detect initial OS
const ua = navigator.userAgent;
if (/Windows/i.test(ua)) {
  currentOs = 'windows';
} else if (/Linux/i.test(ua) && !/Android/i.test(ua)) {
  currentOs = 'linux';
} else {
  currentOs = 'mac';
}

// Elements helper
const el = id => document.getElementById(id);
let toastTimeout;

// Toast notification helper
function showToast(message) {
  const toast = el('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('visible');
  }, 3200);
}

// Safe Clipboard Copy Helper
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
  showToast(ok ? successMsg : 'Copy failed. Please copy manually.');
  return ok;
}

// Generate command based on active tab, selected client, and OS
function getActiveCommand() {
  switch (activeTab) {
    case 'quickstart':
      if (currentOs === 'windows') {
        return `& ([scriptblock]::Create((irm '${BASE_URL}/downloads/install.ps1'))) -Client ${targetClient}`;
      }
      return `curl -fsSL ${BASE_URL}/downloads/install.sh | bash -s -- ${targetClient}`;

    case 'antigravity':
      return `uv run garmin-mcp login && uv run garmin-mcp connect antigravity`;

    case 'deepseek':
      return `npx @deepseek-ai/dsh mcp add garmin "garmin-mcp serve" || (uv run garmin-mcp login && uv run garmin-mcp connect deepseek)`;

    case 'claude':
      return `uv run garmin-mcp login && uv run garmin-mcp connect claude`;

    case 'codex':
      return `uv run garmin-mcp login && uv run garmin-mcp connect codex`;

    case 'source':
      return `git clone https://github.com/enricoarmiento/Garmin_MCP.git && cd Garmin_MCP && uv sync && uv run garmin-mcp login`;

    default:
      return `curl -fsSL ${BASE_URL}/downloads/install.sh | bash`;
  }
}

// Get helper note for current state
function getActiveNote() {
  const t = TRANSLATIONS[currentLang];
  switch (activeTab) {
    case 'quickstart':
      if (targetClient === 'antigravity') return t.termNoteAntigravity;
      if (targetClient === 'deepseek') return t.termNoteDeepseek;
      if (targetClient === 'claude') return t.termNoteClaude;
      if (targetClient === 'codex') return t.termNoteCodex;
      if (currentOs === 'windows') return t.termNoteWin;
      return t.termNoteMac;
    case 'antigravity':
      return t.termNoteAntigravity;
    case 'deepseek':
      return t.termNoteDeepseek;
    case 'claude':
      return t.termNoteClaude;
    case 'codex':
      return t.termNoteCodex;
    case 'source':
      return t.termNoteSource;
    default:
      return t.termNoteMac;
  }
}

// Render UI strings & terminal
function renderUI() {
  const t = TRANSLATIONS[currentLang];
  document.documentElement.lang = currentLang;

  // Update all data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(elem => {
    const key = elem.getAttribute('data-i18n');
    if (t[key] !== undefined) {
      elem.textContent = t[key];
    }
  });

  // Update Language switch buttons
  const itBtn = el('btn-lang-it');
  const enBtn = el('btn-lang-en');
  if (itBtn && enBtn) {
    itBtn.classList.toggle('active', currentLang === 'it');
    enBtn.classList.toggle('active', currentLang === 'en');
  }

  // Update Terminal Tabs
  document.querySelectorAll('.tab-pill').forEach(btn => {
    const tabName = btn.getAttribute('data-tab');
    const isSelected = tabName === activeTab;
    btn.classList.toggle('active', isSelected);
    btn.setAttribute('aria-selected', String(isSelected));
  });

  // Update Client pills
  document.querySelectorAll('.client-pill').forEach(btn => {
    const clientName = btn.getAttribute('data-client');
    btn.classList.toggle('active', clientName === targetClient);
  });

  // Update OS pills
  document.querySelectorAll('.os-pill').forEach(btn => {
    const osName = btn.getAttribute('data-os');
    btn.classList.toggle('active', osName === currentOs);
  });

  // Show or hide Client & OS selector
  const clientPillsContainer = el('client-pills');
  const osPillsContainer = el('os-pills');
  const isQuickstart = activeTab === 'quickstart';

  if (clientPillsContainer) clientPillsContainer.style.display = isQuickstart ? 'inline-flex' : 'none';
  if (osPillsContainer) osPillsContainer.style.display = isQuickstart ? 'inline-flex' : 'none';

  // Update Terminal Command and Note
  const cmd = getActiveCommand();
  const termCmdElem = el('term-command');
  if (termCmdElem) termCmdElem.textContent = cmd;

  const termNoteElem = el('term-note');
  if (termNoteElem) termNoteElem.textContent = getActiveNote();

  // Update Modal Code
  const modalCode = el('modal-code');
  if (modalCode) modalCode.textContent = cmd;
}

// Switch Language
function setLanguage(lang) {
  if (lang !== 'it' && lang !== 'en') return;
  currentLang = lang;
  localStorage.setItem('garmin_mcp_lang', lang);
  renderUI();
}

// Switch Active Tab
function setTab(tab) {
  activeTab = tab;
  renderUI();
}

// Switch Target Client (in Quick start)
function setClient(client) {
  targetClient = client;
  renderUI();
}

// Switch Active OS
function setOs(os) {
  currentOs = os;
  renderUI();
}

// Event Listeners Initialization
function initEventListeners() {
  // Language switcher
  const itBtn = el('btn-lang-it');
  const enBtn = el('btn-lang-en');
  if (itBtn) itBtn.addEventListener('click', () => setLanguage('it'));
  if (enBtn) enBtn.addEventListener('click', () => setLanguage('en'));

  // Terminal Tab buttons
  document.querySelectorAll('.tab-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      setTab(btn.getAttribute('data-tab'));
    });
  });

  // Client selector pills
  document.querySelectorAll('.client-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      setClient(btn.getAttribute('data-client'));
    });
  });

  // OS selector pills
  document.querySelectorAll('.os-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      setOs(btn.getAttribute('data-os'));
    });
  });

  // Copy Terminal Command
  const copyBtn = el('btn-copy');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const t = TRANSLATIONS[currentLang];
      copyToClipboard(getActiveCommand(), t.copied);
      const copyText = el('copy-text');
      if (copyText) {
        copyText.textContent = t.copied;
        setTimeout(() => { copyText.textContent = t.copy; }, 1800);
      }
    });
  }

  // Copy Example Prompt
  const copyPromptBtn = el('btn-copy-prompt');
  if (copyPromptBtn) {
    copyPromptBtn.addEventListener('click', () => {
      const promptText = el('example-prompt-text').textContent.replace(/[“”"]/g, '').trim();
      const t = TRANSLATIONS[currentLang];
      copyToClipboard(promptText, t.copied);
    });
  }

  // Modal Setup Dialog
  const setupDialog = el('setup-dialog');
  const modalOpenBtn = el('btn-modal-open');
  const modalCloseBtn = el('modal-close');
  const modalDismissBtn = el('modal-dismiss');
  const modalCopyBtn = el('modal-copy-btn');

  if (setupDialog) {
    if (modalOpenBtn) {
      modalOpenBtn.addEventListener('click', () => {
        setupDialog.showModal();
      });
    }

    const closeModal = () => setupDialog.close();
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalDismissBtn) modalDismissBtn.addEventListener('click', closeModal);

    setupDialog.addEventListener('click', e => {
      if (e.target === setupDialog) {
        closeModal();
      }
    });

    if (modalCopyBtn) {
      modalCopyBtn.addEventListener('click', () => {
        const t = TRANSLATIONS[currentLang];
        copyToClipboard(getActiveCommand(), t.copied);
      });
    }
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initEventListeners();
  renderUI();
});
