"""MCP entry point: only explicit read operations are exposed."""

from typing import Any, Literal

from mcp.server.fastmcp import FastMCP
from mcp.types import ToolAnnotations

from garmin_mcp.service import GarminService, token_path

mcp = FastMCP("Garmin Read-only", instructions=(
    "Read Garmin Connect data. Dates are YYYY-MM-DD in the user's Garmin calendar. "
    "Raw data retains Garmin units (typically meters, seconds and bpm). "
    "Use garmin_trends for explicit normalized units. Missing data is not zero. "
    "Activity data can contain private GPS coordinates. Never request passwords or MFA via tools."
))
service = GarminService()
read_only = ToolAnnotations(readOnlyHint=True, destructiveHint=False, idempotentHint=True, openWorldHint=True)


@mcp.tool(annotations=read_only)
def garmin_status() -> dict[str, Any]:
    """Check local token presence without contacting Garmin; does not validate the session."""
    return {"token_file_present": (token_path() / "garmin_tokens.json").is_file(),
            "session_validated": False, "read_only": True,
            "login_command": "garmin-mcp login"}


@mcp.tool(annotations=read_only)
def garmin_daily(day: str, metric: Literal["summary", "sleep", "heart_rate", "stress", "body_battery", "hrv"] = "summary") -> dict[str, Any]:
    """Read one daily metric. Sleep uses the wake-up date. Returns raw Garmin JSON, possibly empty."""
    return service.daily(day, metric)


@mcp.tool(annotations=read_only)
def garmin_activities(start: int = 0, limit: int = 20) -> dict[str, Any]:
    """List activities, newest first. Paginate with start; maximum 100 per call. Raw units: meters/seconds."""
    if start < 0 or not 1 <= limit <= 100:
        raise ValueError("start deve essere >= 0; limit da 1 a 100.")
    return {"start": start, "limit": limit, "data": service.read("get_activities", start, limit)}


@mcp.tool(annotations=read_only)
def garmin_activity(activity_id: str, include_splits: bool = False) -> dict[str, Any]:
    """Read activity detail and optional lap splits. May include GPS/location data."""
    if not activity_id.isascii() or not activity_id.isdigit() or int(activity_id) <= 0:
        raise ValueError("activity_id deve essere un intero positivo.")
    result = {"activity_id": activity_id, "data": service.read("get_activity", activity_id)}
    if include_splits:
        result["splits"] = service.read("get_activity_splits", activity_id)
    return result


@mcp.tool(annotations=read_only)
def garmin_trends(start_date: str, end_date: str) -> dict[str, Any]:
    """Get daily values and descriptive statistics over 1–31 inclusive days. Explicit units, null-aware means."""
    return service.trends(start_date, end_date)


def run() -> None:
    mcp.run(transport="stdio")
