"""Register an installed server without replacing unrelated client settings."""

from datetime import datetime, timezone
import json
import os
from pathlib import Path
import sys
import tempfile

import tomlkit

from garmin_mcp.service import token_path


def config_path(client: str) -> Path:
    if client == "codex":
        return Path(os.environ.get("CODEX_HOME", str(Path.home() / ".codex"))) / "config.toml"
    if client == "antigravity":
        for p in [
            Path.home() / ".gemini/antigravity-ide/mcp_config.json",
            Path.home() / ".gemini/config/mcp_config.json",
            Path.home() / ".antigravity/mcp_config.json",
        ]:
            if p.exists():
                return p
        return Path.home() / ".gemini/antigravity-ide/mcp_config.json"
    if client in ("deepseek", "dsh"):
        for p in [
            Path.home() / ".dsh/mcp_config.json",
            Path.home() / ".dsh/config.json",
        ]:
            if p.exists():
                return p
        return Path.home() / ".dsh/mcp_config.json"
    if client == "claude":
        if sys.platform == "darwin":
            return Path.home() / "Library/Application Support/Claude/claude_desktop_config.json"
        if sys.platform == "win32":
            return Path(os.environ.get("APPDATA", str(Path.home() / "AppData/Roaming"))) / "Claude/claude_desktop_config.json"
        raise ValueError("Questo installer supporta Claude Desktop su macOS e Windows. Su Linux scegli Codex, Antigravity o DeepSeek.")
    raise ValueError(f"Client non supportato: {client}")


def register(client: str, path: Path | None = None) -> Path:
    path = path or config_path(client)
    if path.is_symlink():
        raise ValueError("Configurazione tramite collegamento simbolico: configura Garmin manualmente.")
    previous = path.read_text(encoding="utf-8") if path.exists() else ""
    entry = {"command": sys.executable, "args": ["-m", "garmin_mcp.cli", "serve"],
             "env": {"GARMIN_TOKEN_DIR": str(token_path().absolute())}}
    if client == "codex":
        document = tomlkit.parse(previous)
        if "mcp_servers" not in document:
            document["mcp_servers"] = tomlkit.table()
        document["mcp_servers"]["garmin"] = {**entry, "enabled": True, "tool_timeout_sec": 180}
        updated = tomlkit.dumps(document)
    elif client in ("claude", "antigravity", "deepseek", "dsh"):
        document = json.loads(previous) if previous else {}
        if not isinstance(document, dict) or not isinstance(document.get("mcpServers", {}), dict):
            raise ValueError(f"Configurazione {client} non valida: nessuna modifica effettuata.")
        document.setdefault("mcpServers", {})["garmin"] = entry
        updated = json.dumps(document, indent=2, ensure_ascii=False) + "\n"
    else:
        raise ValueError("Client non supportato.")
    path.parent.mkdir(parents=True, exist_ok=True)
    if previous and previous != updated:
        stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%f")
        backup = path.with_name(f"{path.name}.garmin-backup-{stamp}")
        fd = os.open(backup, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            f.write(previous)
    fd, name = tempfile.mkstemp(prefix=".garmin-", dir=path.parent)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            f.write(updated)
        os.replace(name, path)
    finally:
        if os.path.exists(name):
            os.unlink(name)
    return path
