---
name: garmin
description: Read-only access to the user's own Garmin Connect data (steps, sleep, heart rate, stress, Body Battery, HRV, training readiness and status, VO2max, SpO2, respiration, activities with laps, HR zones and weather, personal records, race predictions, trends) plus analysis playbooks for weekly reports, recovery checks and run comparisons. Use whenever the user asks about their Garmin data, watch, workouts, runs, rides, sleep, recovery, readiness or health/fitness trends, including first-time Garmin setup.
---

# Garmin Connect (read-only)

> **Unofficial tool.** This skill is independent and is not made, endorsed or supported by Garmin. It reads the user's own Garmin Connect account through the unofficial open-source `python-garminconnect` library. Garmin, Garmin Connect and Body Battery are trademarks of Garmin Ltd. or its subsidiaries. If the user asks whether it is official, say clearly that it is not.

Run the launcher `garmin.sh` located in this skill's base directory, always with its **absolute path** (below: `GARMIN`). If the skill was loaded without a folder (e.g. from a marketplace), first write every bundled file unchanged into one folder, keeping relative paths (`garmin.sh`, `pyproject.toml`, `src/...`), e.g. `~/.garmin-mcp/app`; then use `sh <folder>/garmin.sh` as `GARMIN`. It prints compact JSON on stdout; on failure it prints one message on stderr and exits non-zero. No command can modify Garmin data. Reply in the user's language; keep technical details out of the answer unless asked.

## Commands

| Command | Purpose |
|---|---|
| `GARMIN status` | Local token present? No network; does not prove the session works |
| `GARMIN daily YYYY-MM-DD [metric]` | `metric`: `summary` (default), `sleep`, `heart_rate`, `stress`, `body_battery`, `hrv`, `training_readiness`, `training_status`, `vo2max`, `respiration`, `spo2`, `intensity_minutes`, `fitness_age`, `hydration` |
| `GARMIN activities [--start N] [--limit 1-100]` | Recent activities, newest first (default 20) |
| `GARMIN activity ID [--splits]` | Activity detail; `--splits` adds laps, HR zones and weather (`null` when not available) |
| `GARMIN trends START END` | Daily series + statistics, 1–31 days inclusive, explicit units |
| `GARMIN profile` | Personal records and race time predictions (`null` when not available) |

Advanced metrics depend on the watch model: if a metric is empty or "Nessun dato", say the watch probably doesn't record it and continue with what exists.

## First use / setup (follow in order, stop at the first failure)

1. Run `GARMIN status`. The very first run may take ~30 s: it installs Python and dependencies automatically. Use a Bash timeout of at least 180000 ms.
2. Exit code 2 / `SETUP_REQUIRED`: `uv` is missing. Tell the user it is needed once, show the install command from the message, and ask permission before running it. Then retry step 1.
3. `"token_file_present": false`: the user must log in **themselves** in a terminal (Claude cannot type passwords). Give them exactly this command with the real absolute path, in its own code block:
   `GARMIN login` (e.g. `sh "/abs/path/garmin.sh" login`)
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

## Analysis playbooks

Field names below are typical Garmin keys; if one is missing, list the JSON keys once and adapt. Always show the period, the numbers used and which days are missing. Keep answers short: a headline, a compact table, 2–4 actionable observations.

- **Weekly / monthly report** ("how was my week?"): `trends` for the period and the previous equal period → compare means/totals (steps, distance, resting HR, stress) as Δ and %. Add sleep for each day (`dailySleepDTO.sleepTimeSeconds`, `dailySleepDTO.sleepScores.overall.value`) only if asked about sleep or the period is ≤ 7 days. Add activity count and total time from `activities`.
- **Recovery / "should I train hard today?"**: today's `training_readiness` (`score`, `level`, contributing factors), `hrv` (`hrvSummary.lastNightAvg`, `hrvSummary.status`), last night's `sleep`, `body_battery`, resting HR vs its 7-day mean from `trends`. Give a clear verdict (go / easy / rest) with the 2–3 data points behind it; it is not medical advice.
- **Sleep review**: per night duration, score, deep/REM/light/awake (`deepSleepSeconds`, `remSleepSeconds`, `lightSleepSeconds`, `awakeSleepSeconds`), bedtime consistency. Flag nights < 6 h and the best/worst night.
- **Run / ride comparison**: `activities` filtered by `activityType.typeKey` (e.g. `running`, `cycling`) → table with date, distance km, duration, pace min/km (or speed km/h), avg HR, elevation gain. Highlight trend in pace at similar HR (efficiency). For one session in depth: `activity ID --splits` (laps, time in HR zones, weather).
- **Fitness progress**: `vo2max` (`generic.vo2MaxPreciseValue` for running, `cycling` block for bike) on a few dates across the period, `training_status`, `profile` for race predictions and personal records (convert seconds to h:mm:ss).
- **Stress & energy**: `stress` (average, max, rest vs high stress durations) with `body_battery` charged/drained; relate to sleep and activities on the same days.

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
