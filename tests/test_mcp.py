import os
import sys

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client


async def test_real_stdio_roundtrip_without_credentials(tmp_path):
    params = StdioServerParameters(
        command=sys.executable,
        args=["-m", "garmin_mcp.cli", "serve"],
        env={**os.environ, "GARMIN_TOKEN_DIR": str(tmp_path / "absent")},
    )
    async with stdio_client(params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            tools = (await session.list_tools()).tools
            assert {t.name for t in tools} == {
                "garmin_status", "garmin_daily", "garmin_activities", "garmin_activity", "garmin_trends"
            }
            assert all(t.annotations.readOnlyHint for t in tools)
            result = await session.call_tool("garmin_status", {})
            assert not result.isError
            assert result.structuredContent["token_file_present"] is False
            invalid = await session.call_tool("garmin_daily", {"day": "bad"})
            assert invalid.isError
            missing = await session.call_tool("garmin_daily", {"day": "2025-01-01"})
            assert missing.isError
            assert "garmin-mcp login" in missing.content[0].text
