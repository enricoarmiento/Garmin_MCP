import json
import subprocess
import sys


def run(*args, tmp_path):
    return subprocess.run([sys.executable, "-m", "garmin_mcp.cli", *args], capture_output=True, text=True,
                          env={"GARMIN_TOKEN_DIR": str(tmp_path), "PATH": ""})


def test_status_prints_json(tmp_path):
    out = run("status", tmp_path=tmp_path)
    assert out.returncode == 0 and json.loads(out.stdout)["token_file_present"] is False


def test_invalid_input_exits_with_message(tmp_path):
    out = run("daily", "2099-01-01", tmp_path=tmp_path)
    assert out.returncode == 1 and "futura" in out.stderr and out.stdout == ""
