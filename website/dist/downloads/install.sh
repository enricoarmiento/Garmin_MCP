#!/usr/bin/env bash
# Garmin MCP installer. Installs uv/Python if needed, then authenticates locally.
set -euo pipefail
CLIENT="${1:-}"
case "$CLIENT" in claude|codex) ;; *) echo 'Uso: install.sh claude|codex' >&2; exit 1;; esac
if [ "$(uname -s)" = Linux ] && [ "$CLIENT" = claude ]; then
  echo 'Questo installer supporta Claude Desktop su macOS e Windows. Su Linux scegli Codex.' >&2; exit 1
fi
if [ ! -r /dev/tty ]; then echo 'Apri un terminale interattivo per il login Garmin.' >&2; exit 1; fi
BASE_URL='https://garmin-mcp-connect.enricoarmiento.chatgpt.site'
WHEEL='garmin_readonly_mcp-0.1.0-py3-none-any.whl'
SHA256='6afcc9a4e5ad4e062e5567d504420d57db71cecefd7707a8a1b7f7ba3243effd'
echo 'Garmin MCP — installazione locale per '"$CLIENT"
echo 'Il login avviene con Garmin. Le credenziali non vengono inviate al sito.'
if command -v uv >/dev/null 2>&1; then UV_EXE="$(command -v uv)";
elif [ -x "$HOME/.local/bin/uv" ]; then UV_EXE="$HOME/.local/bin/uv";
else
  echo 'Installazione di uv dal sito ufficiale Astral…'
  curl --proto '=https' --tlsv1.2 -LsSf https://astral.sh/uv/install.sh | sh
  UV_EXE="$HOME/.local/bin/uv"
fi
if [ ! -x "$UV_EXE" ]; then echo 'uv non trovato. Installa uv da https://docs.astral.sh/uv/ e riprova.' >&2; exit 1; fi
TASK_TMP="$(mktemp -d)"
trap 'rm -rf "$TASK_TMP"' EXIT
curl --proto '=https' --tlsv1.2 -fLsS "$BASE_URL/downloads/$WHEEL" -o "$TASK_TMP/$WHEEL"
if command -v shasum >/dev/null 2>&1; then ACTUAL="$(shasum -a 256 "$TASK_TMP/$WHEEL" | awk '{print $1}')";
elif command -v sha256sum >/dev/null 2>&1; then ACTUAL="$(sha256sum "$TASK_TMP/$WHEEL" | awk '{print $1}')";
else echo 'Serve shasum oppure sha256sum per verificare il pacchetto.' >&2; exit 1; fi
if [ "$ACTUAL" != "$SHA256" ]; then echo 'Verifica pacchetto fallita. Nessuna installazione eseguita.' >&2; exit 1; fi
"$UV_EXE" tool install --force --python 3.12 "$TASK_TMP/$WHEEL"
TOOL_BIN="$("$UV_EXE" tool dir --bin)"
"$TOOL_BIN/garmin-mcp" login </dev/tty
"$TOOL_BIN/garmin-mcp" connect "$CLIENT"
echo 'Configurazione completata. Riavvia il client e chiedi di usare Garmin.'
