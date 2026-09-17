'use strict';

// Use the deployed site; local previews use the public source downloads.
const BASE_URL = window.location.protocol === 'https:'
  ? window.location.origin
  : 'https://raw.githubusercontent.com/enricoarmiento/Garmin_MCP/main/website/dist';

// Bilingual translations dictionary (Italian & English)
const TRANSLATIONS = {
  "it": {
    "previewBadge": "Strumenti in sola lettura",
    "eyebrow": "Garmin Connect / MCP",
    "heroTitle": "I tuoi dati Garmin. Nel tuo assistente.",
    "heroSubtitle1": "Collega attività, sonno e recupero a Google Antigravity, DeepSeek Harness, Claude o Codex.",
    "heroSubtitle2": "Un server MCP sul tuo computer, cinque strumenti in sola lettura. Codice aperto, nessuna modifica al tuo account Garmin.",
    "btnGithub": "Vedi su GitHub",
    "btnDocs": "Installazione",
    "btnTools": "Strumenti MCP",
    "btnDownload": "Scarica sorgenti",
    "tabQuickstart": "Avvio rapido",
    "tabSource": "Da sorgenti",
    "copy": "Copia",
    "copied": "Copiato!",
    "termNoteMac": "Incolla nel Terminale. Il comando prepara il collegamento.",
    "termNoteWin": "Incolla in PowerShell. Il comando prepara il collegamento.",
    "termNoteLinux": "Incolla nel Terminale Linux. Il comando prepara il collegamento.",
    "termNoteAntigravity": "Configura Garmin MCP in Google Antigravity IDE (~/.gemini/antigravity-ide/mcp_config.json).",
    "termNoteDeepseek": "Configura Garmin MCP per DeepSeek Harness (~/.dsh/mcp_config.json o dsh CLI).",
    "termNoteClaude": "Configurazione automatica del server locale stdio per Claude Desktop.",
    "termNoteCodex": "Configurazione del server stdio per Codex (~/.codex/config.toml).",
    "termNoteSource": "Clona il repository GitHub, sincronizza le dipendenze con uv ed effettua il login locale.",
    "trustText": "Account personale · Sola lettura",
    "belowTerminal": "Il server gira sul tuo computer. I dati richiesti vengono condivisi con l’assistente che scegli.",
    "dataStripLabel": "DATI DISPONIBILI",
    "metricActivities": "Attività e giri",
    "metricSleep": "Fasi del sonno",
    "metricHeart": "Battito cardiaco",
    "metricStress": "Stress e HRV",
    "metricBattery": "Body Battery",
    "metricTrends": "Trend fino a 31 giorni",
    "toolsSectionTitle": "Cinque strumenti. I dati che servono.",
    "toolsSectionDesc": "Dal riepilogo della giornata ai dettagli di una singola attività.",
    "tool1Desc": "Controlla la presenza dei token di accesso sul computer, senza chiamate di rete.",
    "tool2Desc": "Consulta il riepilogo giornaliero: sonno, frequenza cardiaca, stress e Body Battery.",
    "tool3Desc": "Elenca le attività recenti con sport, distanza e durata.",
    "tool4Desc": "Esplora una singola attività, con dettagli, giri e tempi parziali.",
    "tool5Desc": "Confronta dati e medie su un intervallo da 1 a 31 giorni.",
    "guideEyebrow": "CONFIGURAZIONE",
    "guideTitle": "Dal tuo Garmin al tuo assistente.",
    "step1Num": "01",
    "step1Title": "Scegli il tuo assistente",
    "step1Desc": "Seleziona assistente e sistema operativo, poi copia il comando di avvio rapido.",
    "step2Num": "02",
    "step2Title": "Accedi a Garmin in locale",
    "step2Desc": "Esegui il comando nel terminale e accedi a Garmin Connect. I token di accesso vengono salvati sul tuo computer.",
    "step3Num": "03",
    "step3Title": "Inizia a conversare",
    "step3Desc": "Riavvia l’assistente e chiedi un riepilogo del sonno, delle attività o del recupero.",
    "examplePromptText": "“Come sono cambiati sonno e stress negli ultimi 7 giorni?”",
    "examplePromptAction": "Copia esempio",
    "faqTitle": "Domande frequenti",
    "faq1Q": "Posso collegarlo direttamente dal browser?",
    "faq1A": "No. Questa pagina fornisce i comandi e la guida. Il server MCP viene installato e avviato sul tuo computer dal tuo assistente.",
    "faq2Q": "Dove vengono salvate le credenziali e i miei dati sanitari?",
    "faq2A": "Accedi direttamente a Garmin Connect dal terminale. I token vengono salvati nella cartella ~/.garmin-mcp sul tuo computer. Quando usi uno strumento, i dati richiesti vengono passati al client AI: il loro trattamento dipende dall’assistente e dalle sue impostazioni.",
    "faq3Q": "Quali client sono supportati?",
    "faq3A": "La configurazione guidata supporta Google Antigravity, DeepSeek Harness, Claude Desktop e Codex. Claude Desktop è disponibile su macOS e Windows. Puoi configurare manualmente anche altri client MCP compatibili con stdio.",
    "faq4Q": "Il server può modificare o cancellare i miei dati su Garmin?",
    "faq4A": "No. I cinque strumenti sono in sola lettura: non caricano, modificano o cancellano attività e metriche su Garmin Connect.",
    "footerText": "garmin_mcp · Progetto indipendente, non affiliato a Garmin.",
    "footerSource": "Sorgente ZIP",
    "footerRepo": "GitHub",
    "footerLibrary": "Libreria Garmin Connect ↗",
    "modalTitle": "Istruzioni di installazione",
    "modalStep1": "Esegui questo comando nel terminale del tuo computer:",
    "modalStep2": "Effettua il login a Garmin Connect inserendo credenziali e codice MFA se richiesto.",
    "modalStep3": "Riavvia Google Antigravity, DeepSeek Harness, Claude o Codex per caricare i nuovi strumenti.",
    "close": "Chiudi",
    "footerSpecs": "Specifiche MCP ↗",
    "navigationLabel": "Navigazione principale",
    "navTools": "Strumenti",
    "navGuide": "Installazione",
    "navFaq": "FAQ",
    "languageLabel": "Lingua",
    "installationLabel": "Modalità di installazione",
    "assistantLabel": "Assistente",
    "osLabel": "Sistema operativo",
    "copyCommand": "Copia comando",
    "copyExample": "Copia esempio",
    "metricsLabel": "Dati Garmin disponibili",
    "closeDialog": "Chiudi istruzioni",
    "terminalLabel": "INSTALLAZIONE LOCALE",
    "noParams": "Nessun parametro",
    "copyFailed": "Copia non riuscita. Seleziona e copia il testo manualmente.",
    "pageTitle": "garmin_mcp — I tuoi dati Garmin, nel tuo assistente",
    "pageDescription": "Collega attività, sonno e recupero Garmin al tuo assistente AI con un server MCP locale in sola lettura."
  },
  "en": {
    "previewBadge": "Read-only tools",
    "eyebrow": "Garmin Connect / MCP",
    "heroTitle": "Your Garmin data. In your assistant.",
    "heroSubtitle1": "Connect activities, sleep and recovery to Google Antigravity, DeepSeek Harness, Claude or Codex.",
    "heroSubtitle2": "An MCP server on your computer, five read-only tools. Open source, with no changes to your Garmin account.",
    "btnGithub": "View on GitHub",
    "btnDocs": "Installation",
    "btnTools": "MCP Tools",
    "btnDownload": "Download source",
    "tabQuickstart": "Quick start",
    "tabSource": "From source",
    "copy": "Copy",
    "copied": "Copied!",
    "termNoteMac": "Paste into Terminal. The command prepares the connection.",
    "termNoteWin": "Paste into PowerShell. The command prepares the connection.",
    "termNoteLinux": "Paste into Linux Terminal. The command prepares the connection.",
    "termNoteAntigravity": "Configures Garmin MCP in Google Antigravity IDE (~/.gemini/antigravity-ide/mcp_config.json).",
    "termNoteDeepseek": "Configures Garmin MCP for DeepSeek Harness (~/.dsh/mcp_config.json or dsh CLI).",
    "termNoteClaude": "Automatic stdio configuration for Claude Desktop on your computer.",
    "termNoteCodex": "Configure local stdio server for Codex (~/.codex/config.toml).",
    "termNoteSource": "Clone the GitHub repository, synchronize dependencies with uv, and authenticate locally.",
    "trustText": "Personal account · Read-only",
    "belowTerminal": "The server runs on your computer. Requested data is shared with the assistant you choose.",
    "dataStripLabel": "AVAILABLE DATA",
    "metricActivities": "Activities & Laps",
    "metricSleep": "Sleep Stages",
    "metricHeart": "Heart Rate",
    "metricStress": "Stress & HRV",
    "metricBattery": "Body Battery",
    "metricTrends": "Trends up to 31 days",
    "toolsSectionTitle": "Five tools. The data you need.",
    "toolsSectionDesc": "From a daily summary to the details of a single activity.",
    "tool1Desc": "Check for access tokens on your computer, without making a network request.",
    "tool2Desc": "Read your daily summary: sleep, heart rate, stress and Body Battery.",
    "tool3Desc": "List recent activities with sport, distance and duration.",
    "tool4Desc": "Explore a single activity, including details, laps and splits.",
    "tool5Desc": "Compare data and averages over a period of 1 to 31 days.",
    "guideEyebrow": "SETUP",
    "guideTitle": "From your Garmin to your assistant.",
    "step1Num": "01",
    "step1Title": "Choose your assistant",
    "step1Desc": "Select your assistant and operating system, then copy the quick start command.",
    "step2Num": "02",
    "step2Title": "Local Garmin login",
    "step2Desc": "Run the command in your terminal and sign in to Garmin Connect. Access tokens are saved on your computer.",
    "step3Num": "03",
    "step3Title": "Start chatting",
    "step3Desc": "Restart your assistant and ask for a summary of your sleep, activities or recovery.",
    "examplePromptText": "“How have my sleep and stress changed over the last 7 days?”",
    "examplePromptAction": "Copy example",
    "faqTitle": "Frequently Asked Questions",
    "faq1Q": "Can I connect directly from the web browser?",
    "faq1A": "No. This page provides commands and instructions. The MCP server is installed on your computer and started by your assistant.",
    "faq2Q": "Where are my credentials and biometric data stored?",
    "faq2A": "You sign in directly to Garmin Connect from your terminal. Tokens are saved in ~/.garmin-mcp on your computer. When you use a tool, the requested data is passed to your AI client: how it is handled depends on the assistant and its settings.",
    "faq3Q": "Which AI clients are supported?",
    "faq3A": "Guided setup supports Google Antigravity, DeepSeek Harness, Claude Desktop and Codex. Claude Desktop is available on macOS and Windows. Other MCP clients that support stdio can be configured manually.",
    "faq4Q": "Can this server modify or delete my data on Garmin Connect?",
    "faq4A": "No. All five tools are read-only: they do not upload, modify or delete activities or metrics on Garmin Connect.",
    "footerText": "garmin_mcp · Independent project, not affiliated with Garmin.",
    "footerSource": "Source ZIP",
    "footerRepo": "GitHub",
    "footerLibrary": "Garmin Connect Library ↗",
    "modalTitle": "Installation Instructions",
    "modalStep1": "Run this command in your computer’s terminal:",
    "modalStep2": "Log in to Garmin Connect entering your email, password, and MFA code if prompted.",
    "modalStep3": "Relaunch Google Antigravity, DeepSeek Harness, Claude, or Codex to register the new MCP server tools.",
    "close": "Close",
    "footerSpecs": "MCP specification ↗",
    "navigationLabel": "Main navigation",
    "navTools": "Tools",
    "navGuide": "Installation",
    "navFaq": "FAQ",
    "languageLabel": "Language",
    "installationLabel": "Installation mode",
    "assistantLabel": "Assistant",
    "osLabel": "Operating system",
    "copyCommand": "Copy command",
    "copyExample": "Copy example",
    "metricsLabel": "Available Garmin data",
    "closeDialog": "Close instructions",
    "terminalLabel": "LOCAL INSTALLATION",
    "noParams": "No parameters",
    "copyFailed": "Copy failed. Please select and copy the text manually.",
    "pageTitle": "garmin_mcp — Your Garmin data, in your assistant",
    "pageDescription": "Connect Garmin activities, sleep and recovery to your AI assistant with a local, read-only MCP server."
  }
};

// Application State
function preferredLanguage() {
  try {
    const saved = localStorage.getItem('garmin_mcp_lang');
    if (saved === 'it' || saved === 'en') return saved;
  } catch { /* Storage may be unavailable in private browsing. */ }
  return (navigator.language || 'it').toLowerCase().startsWith('it') ? 'it' : 'en';
}
let currentLang = preferredLanguage();
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
  showToast(ok ? successMsg : TRANSLATIONS[currentLang].copyFailed);
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
  document.title = t.pageTitle;
  document.querySelector('meta[name="description"]').content = t.pageDescription;
  document.querySelector('meta[property="og:title"]').content = t.pageTitle;
  document.querySelector('meta[property="og:description"]').content = t.pageDescription;
  document.querySelectorAll('[data-i18n-aria]').forEach(elem => {
    elem.setAttribute('aria-label', t[elem.dataset.i18nAria]);
  });
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.setAttribute('aria-pressed', String(btn.dataset.lang === currentLang));
  });
  el('term-panel').setAttribute('aria-labelledby', 'tab-' + activeTab);

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
    btn.tabIndex = isSelected ? 0 : -1;
  });

  // Update Client pills
  document.querySelectorAll('.client-pill').forEach(btn => {
    const clientName = btn.getAttribute('data-client');
    btn.classList.toggle('active', clientName === targetClient);
    btn.setAttribute('aria-pressed', String(clientName === targetClient));
  });

  // Update OS pills
  document.querySelectorAll('.os-pill').forEach(btn => {
    const osName = btn.getAttribute('data-os');
    btn.classList.toggle('active', osName === currentOs);
    btn.setAttribute('aria-pressed', String(osName === currentOs));
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
  try { localStorage.setItem('garmin_mcp_lang', lang); } catch { /* Keep language usable without storage. */ }
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

  // Roving keyboard focus for the shared installation panel.
  const tabs = [...document.querySelectorAll('.tab-pill')];
  tabs.forEach((btn, index) => btn.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    setTab(tabs[next].dataset.tab);
    tabs[next].focus();
  }));

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
    copyBtn.addEventListener('click', async () => {
      const t = TRANSLATIONS[currentLang];
      const copied = await copyToClipboard(getActiveCommand(), t.copied);
      const copyText = el('copy-text');
      if (copyText && copied) {
        copyText.textContent = t.copied;
        setTimeout(() => { copyText.textContent = TRANSLATIONS[currentLang].copy; }, 1800);
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
        const bounds = setupDialog.getBoundingClientRect();
        if (e.clientX < bounds.left || e.clientX > bounds.right || e.clientY < bounds.top || e.clientY > bounds.bottom) closeModal();
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
