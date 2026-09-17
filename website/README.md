# Garmin MCP connection website

Static, public installation page. `dist/` is authored source and the deployable output; no bundler required.

- Client choice: Google Antigravity, DeepSeek Harness, Claude Desktop, or Codex.
- Platforms: macOS and Windows, plus Linux for Antigravity, DeepSeek, and Codex.
- Installation is an explicit command the visitor runs locally. The website does not launch native processes or claim a live connection.
- Installers provision uv/Python, download the included wheel, verify SHA-256, authenticate directly with Garmin, then configure the selected client.
- The packaged `connect` command preserves other client settings and writes a private backup before changing an existing configuration.
- No user token, credentials or health data is included in downloads or sent to the website.
- Runtime files: HTML, CSS, JS, SVG, source ZIP, Python wheel, Bash and PowerShell installers.

Serve `dist/` with any static HTTP server for local preview. Deploy with Vercel from the repository root using the root `vercel.json`: framework Other, no install or build command, output directory `website/dist`. The Python MCP server remains a local process; Vercel serves only the static website and downloads. The `.openai/hosting.json` file records the previous Sites publication.

Release updates: build the parent Python project, copy its wheel into `dist/downloads/`, update the filename and SHA-256 in both installers, and regenerate the source ZIP from an explicit source-file allowlist. Never archive the workspace, virtual environment or token directory.

Validation performed: Python service and configuration tests, stdio MCP integration, Bash/JS syntax, local asset integrity, desktop/mobile layouts and client/OS selection. Windows installer requires end-to-end validation on a Windows machine; credentials and MFA are entered by each visitor.

Installer commands use the current HTTPS site origin. Local previews fall back to the public GitHub source. Installers download the checksum-verified wheel from this GitHub repository, independently of the hosting provider.
