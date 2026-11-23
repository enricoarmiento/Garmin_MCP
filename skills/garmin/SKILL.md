---
name: garmin
description: Read-only access to the user's own Garmin Connect data (steps, sleep, heart rate, stress, Body Battery, HRV, activities, laps, trends up to 31 days) for analysis. Use whenever the user asks about their Garmin data, watch, workouts, runs, rides, sleep, recovery or health/fitness trends, including first-time Garmin setup.
---

# Garmin Connect (read-only)

Run the launcher `garmin` located in this skill's base directory, always with its **absolute path** (below: `GARMIN`). It prints compact JSON on stdout; on failure it prints one message on stderr and exits non-zero. No command can modify Garmin data. Reply in the user's language; keep technical details out of the answer unless asked.

## Commands

| Command | Purpose |
|---|---|
| `GARMIN status` | Local token present? No network; does not prove the session works |
| `GARMIN daily YYYY-MM-DD [metric]` | `metric`: `summary` (default), `sleep`, `heart_rate`, `stress`, `body_battery`, `hrv` |
| `GARMIN activities [--start N] [--limit 1-100]` | Recent activities, newest first (default 20) |
| `GARMIN activity ID [--splits]` | Activity detail, optional laps |
| `GARMIN trends START END` | Daily series + statistics, 1–31 days inclusive, explicit units |

## First use / setup (follow in order, stop at the first failure)

1. Run `GARMIN status`. The very first run may take ~30 s: it installs Python and dependencies automatically. Use a Bash timeout of at least 180000 ms.
2. Exit code 2 / `SETUP_REQUIRED`: `uv` is missing. Tell the user it is needed once, show the install command from the message, and ask permission before running it. Then retry step 1.
3. `"token_file_present": false`: the user must log in **themselves** in a terminal (Claude cannot type passwords). Give them exactly this command with the real absolute path, in its own code block:
   `"GARMIN" login`
   Tell them: it asks for Garmin email, password (invisible while typing) and possibly an MFA code sent by Garmin; it is a one-time step; then come back to the chat. In Claude Code they can open a separate terminal window (not the `!` prefix, which is not interactive). Never ask for, accept or type passwords/MFA codes in chat or in commands. If the user pastes a password in chat, tell them not to and to change it if worried.
4. After login, verify with a light read: `GARMIN activities --limit 1`.

## Reading data

- Dates are `YYYY-MM-DD` in the Garmin calendar, never in the future. Resolve "today / yesterday / last week" from the current date. Sleep belongs to the **wake-up** date.
- Multi-day comparisons: use one `trends` call, not many `daily`. More than 31 days: split into blocks of ≤31 days and say so.
- Raw data keeps Garmin units: meters, seconds, bpm, timestamps in ms. Convert for the user (km, h:mm, min/km pace, local time).
- Missing ≠ zero. `null`, empty data or the "Nessun dato" error mean not available (watch not synced or metric not supported). Today may be incomplete: say so.
- `sleep`, `heart_rate`, `stress`, `body_battery`, `hrv` and `activity` outputs can be large. Save to a temp file and extract only what you need, e.g.:
  `GARMIN daily 2026-11-20 sleep > "$TMPDIR/garmin_sleep.json"` then inspect keys with `jq` or `python3` (whichever exists). Do not dump full payloads into the answer.
- Activity data can contain GPS coordinates/home location: never show them unless explicitly asked.
- No medical diagnosis. Describe data and trends; suggest a professional for health concerns.

## Errors (stderr) → what to do

| Message contains | Action |
|---|---|
| `SETUP_REQUIRED` | Setup step 2 |
| `LOGIN_REQUIRES_TERMINAL` | Setup step 3 (you tried to run login yourself) |
| `Sessione assente o scaduta` | Session missing/expired: setup step 3 |
| `Limite Garmin raggiunto` / `Troppi tentativi` | Garmin rate limit. Stop; do not retry. Tell the user to wait 15–30 minutes |
| `Garmin non raggiungibile` | Network/Garmin outage. Retry once later, then tell the user |
| `Nessun dato Garmin` | Data not available for that date/metric; say so plainly |
| `La data non può essere futura`, `Usa una data`, `Intervallo`, `limit` | Your input was wrong: fix it and rerun, don't bother the user |
| `Lettura Garmin fallita` | Retry once; if it persists, data unavailable or Garmin changed its service |
