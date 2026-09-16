'use strict';
const base = 'https://garmin-mcp-connect.enricoarmiento.chatgpt.site';
const $ = id => document.getElementById(id);
let client = 'claude';
const platform = navigator.userAgent;
$('os').value = /Windows/i.test(platform) ? 'windows' : /Linux/i.test(platform) && !/Android/i.test(platform) ? 'linux' : 'mac';
if ($('os').value === 'linux') client = 'codex';
let toastTimer;
function command() {
  if ($('os').value === 'windows') return `& ([scriptblock]::Create((irm '${base}/downloads/install.ps1'))) -Client ${client}`;
  return `curl -fsSL ${base}/downloads/install.sh | bash -s -- ${client}`;
}
function notify(text) {
  $('toast').textContent = text;
  $('toast').classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('toast').classList.remove('visible'), 4200);
}
async function copy(text, success) {
  try {
    await navigator.clipboard.writeText(text);
    notify(success);
    return true;
  } catch {
    const field = document.createElement('textarea');
    field.value = text;
    field.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
    ($('setup-dialog').open ? $('setup-dialog') : document.body).append(field);
    field.select();
    const ok = document.execCommand('copy');
    field.remove();
    notify(ok ? success : 'Copie automatiche bloccate. Seleziona il comando e copialo manualmente.');
    return ok;
  }
}
function render() {
  const name = client === 'claude' ? 'Claude' : 'Codex';
  const fullName = client === 'claude' ? 'Claude Desktop' : 'Codex';
  const linux = $('os').value === 'linux';
  document.querySelectorAll('[data-client]').forEach(tab => {
    const selected = tab.dataset.client === client;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  $('client-panel').setAttribute('aria-labelledby', `tab-${client}`);
  $('connect-label').textContent = `Collega ${name}`;
  $('connect-main').querySelector('.spark').textContent = client === 'claude' ? '✳' : '⌘';
  $('terminal-label').textContent = `Configurazione · ${fullName}`;
  $('command').textContent = command();
  $('command-note').textContent = $('os').value === 'windows' ? 'Incolla in PowerShell. Il comando prepara il collegamento.' : 'Incolla nel Terminale. Il comando prepara il collegamento.';
  $('dialog-title').textContent = `Collega ${name}`;
  $('dialog-intro').textContent = $('os').value === 'windows' ? 'Apri PowerShell su Windows, poi segui questi passaggi.' : `Apri Terminale ${linux ? 'su Linux' : 'sul Mac'}, poi segui questi passaggi.`;
  $('restart-step').textContent = `Chiudi e riapri ${fullName}.`;
  $('installer-link').href = `/downloads/install.${$('os').value === 'windows' ? 'ps1' : 'sh'}`;
}
function selectClient(next) {
  if (next === 'claude' && $('os').value === 'linux') {
    notify('Per Claude Desktop scegli macOS o Windows. Su Linux è disponibile Codex.');
    return;
  }
  client = next;
  render();
}
document.querySelectorAll('[data-client]').forEach(tab => {
  tab.addEventListener('click', () => selectClient(tab.dataset.client));
  tab.addEventListener('keydown', e => {
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
      e.preventDefault();
      selectClient(e.key === 'Home' ? 'claude' : e.key === 'End' ? 'codex' : client === 'claude' ? 'codex' : 'claude');
      $(`tab-${client}`).focus();
    }
  });
});
$('os').addEventListener('change', () => {
  if ($('os').value === 'linux') client = 'codex';
  render();
});
$('copy-command').addEventListener('click', () => copy(command(), 'Comando copiato. Incollalo nel terminale per continuare.'));
$('dialog-copy').addEventListener('click', () => copy(command(), 'Comando copiato. Ora eseguilo sul tuo computer.'));
function showSetup() { render(); $('setup-dialog').showModal(); document.body.classList.add('modal-open'); }
$('connect-main').addEventListener('click', showSetup);
$('show-steps').addEventListener('click', showSetup);
document.querySelector('.dialog-close').addEventListener('click', () => $('setup-dialog').close());
$('setup-dialog').addEventListener('close', () => document.body.classList.remove('modal-open'));
$('setup-dialog').addEventListener('click', e => { if (e.target === $('setup-dialog')) { const r = e.target.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) e.target.close(); } });
$('copy-prompt').addEventListener('click', () => copy('Usa Garmin per analizzare il mio sonno degli ultimi 7 giorni.', 'Richiesta copiata. Incollala nel tuo assistente dopo il collegamento.'));
render();
