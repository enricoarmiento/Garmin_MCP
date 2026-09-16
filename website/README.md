# Garmin MCP connection website

Static, public installation page. `dist/` is authored source and the deployable output; no bundler required.

- Client choice: Claude Desktop or Codex.
- Platforms: macOS and Windows, plus Linux for Codex.
- Installation is an explicit command the visitor runs locally. The website does not launch native processes or claim a live connection.
- Installers provision uv/Python, download the included wheel, verify SHA-256, authenticate directly with Garmin, then configure the selected client.
- The packaged `connect` command preserves other client settings and writes a private backup before changing an existing configuration.
- No user token, credentials or health data is included in downloads or sent to the website.
- Runtime files: HTML, CSS, JS, SVG, source ZIP, Python wheel, Bash and PowerShell installers.

Serve `dist/` with any static HTTP server for local preview. Publishing uses the Sites project recorded in `.openai/hosting.json`.

Release updates: build the parent Python project, copy its wheel into `dist/downloads/`, update the filename and SHA-256 in both installers, and regenerate the source ZIP from an explicit source-file allowlist. Never archive the workspace, virtual environment or token directory.

Validation performed: Python service and configuration tests, stdio MCP integration, Bash/JS syntax, local asset integrity, desktop/mobile layouts and client/OS selection. Windows installer requires end-to-end validation on a Windows machine; credentials and MFA are entered by each visitor.
