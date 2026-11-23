# Garmin skill for Claude Code

Lets Claude read **your own** Garmin Connect data (steps, sleep, heart rate, stress, Body Battery, HRV, activities, trends) and analyse it. Read-only: it cannot change anything on your Garmin account.

## Install (2 minutes)

1. Unzip `garmin-skill.zip` into `~/.claude/skills/` so you have `~/.claude/skills/garmin/SKILL.md`.
2. Open Claude Code and ask: **"Set up Garmin and show my steps from yesterday."**
3. Claude guides you through the rest. You will run one command in a terminal to log in with your Garmin email, password and, if enabled, MFA code. Your password is never stored or seen by Claude; only Garmin session tokens are saved in `~/.garmin-mcp` (private permissions).

Requirements: macOS or Linux, internet connection, Claude Code. [uv](https://docs.astral.sh/uv/) is required (Claude offers to install it if missing); Python is installed automatically.

## Privacy

- Data goes directly from Garmin to your computer, then to Claude only when you ask a question.
- Treat `~/.garmin-mcp` like a password. Delete that folder to log out.
- Activities may include GPS locations; Claude is instructed not to show them unless you ask.

## Limits

Uses an unofficial Garmin library. Garmin changes, login blocks or rate limits can temporarily stop access; wait and retry. Your watch must be synced with Garmin Connect. No medical advice.

---

# Skill Garmin per Claude Code (IT)

Claude legge in sola lettura i **tuoi** dati Garmin Connect e li analizza.

1. Estrai `garmin-skill.zip` in `~/.claude/skills/` (deve esistere `~/.claude/skills/garmin/SKILL.md`).
2. Apri Claude Code e chiedi: **«Configura Garmin e mostrami i passi di ieri.»**
3. Claude ti guida: eseguirai un comando nel terminale per il login (email, password, eventuale codice MFA). La password non viene salvata né vista da Claude; per uscire elimina la cartella `~/.garmin-mcp`.
