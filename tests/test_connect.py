import json
import tomllib

import pytest

from garmin_mcp.connect import register


def test_claude_preserves_other_servers_and_backs_up(tmp_path):
    path = tmp_path / "claude.json"
    original = '{"theme":"dark","mcpServers":{"other":{"command":"keep"}}}'
    path.write_text(original)
    register("claude", path)
    result = json.loads(path.read_text())
    assert result["theme"] == "dark"
    assert result["mcpServers"]["other"]["command"] == "keep"
    assert result["mcpServers"]["garmin"]["args"][-1] == "serve"
    assert next(tmp_path.glob("*.garmin-backup-*")).read_text() == original
    register("claude", path)
    assert len(list(tmp_path.glob("*.garmin-backup-*"))) == 1


def test_codex_preserves_comments_and_other_servers(tmp_path):
    path = tmp_path / "config.toml"
    path.write_text('# keep comment\nmodel = "keep"\n[mcp_servers.other]\ncommand = "other"\n')
    register("codex", path)
    assert "# keep comment" in path.read_text()
    result = tomllib.loads(path.read_text())
    assert result["model"] == "keep"
    assert result["mcp_servers"]["other"]["command"] == "other"
    assert result["mcp_servers"]["garmin"]["enabled"] is True


@pytest.mark.parametrize("client,suffix", [("claude", "json"), ("codex", "toml")])
def test_invalid_config_is_never_overwritten(tmp_path, client, suffix):
    path = tmp_path / f"config.{suffix}"
    path.write_text("broken[[{")
    with pytest.raises(Exception):
        register(client, path)
    assert path.read_text() == "broken[[{"


def test_new_config_and_no_personal_paths_in_distribution(tmp_path):
    path = tmp_path / "new" / "config.toml"
    register("codex", path)
    assert "garmin" in tomllib.loads(path.read_text())["mcp_servers"]
