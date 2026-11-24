# Garmin Connect Reader & Coach — website

Static, bilingual (IT/EN) sales page for the paid Claude Code skill sold on Agensi:
https://agensi.io/skills/garmin-connect-reader-coach

`dist/` is authored source and the deployable output; no bundler required (HTML, CSS, JS, SVG).

- Primary call to action: buy on Agensi. The site does not distribute the skill, installers or source code.
- Install flow shown on the page: connect Agensi to Claude Code (`claude mcp add --transport http agensi https://mcp.agensi.io/mcp/auth`), sign in via `/mcp`, ask Claude to load the skill; Claude then guides the one-time Garmin login in the user's own terminal.
- Claims on the page must stay in sync with `skills/garmin/SKILL.md` and the Agensi listing (metrics, price, requirements, limits).
- No credentials, tokens or health data are collected or sent to the website.

Preview: serve `dist/` with any static HTTP server. Deploy with Vercel from the repository root using `vercel.json`: framework Other, no install or build command, output directory `website/dist`.
