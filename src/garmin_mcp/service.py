"""Bounded Garmin reads with private session storage and short-lived caching."""

from copy import deepcopy
from datetime import date, timedelta
import os
from pathlib import Path
import re
from threading import RLock
from time import monotonic
from typing import Any

from garminconnect import (
    Garmin,
    GarminConnectAuthenticationError,
    GarminConnectConnectionError,
    GarminConnectTooManyRequestsError,
)


class GarminError(RuntimeError):
    """Safe error text suitable for an MCP response."""


def token_path() -> Path:
    return Path(os.environ.get("GARMIN_TOKEN_DIR", "~/.garmin-mcp")).expanduser()


def validate_day(value: str) -> str:
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", value):
        raise ValueError("Usa una data nel formato YYYY-MM-DD.")
    day = date.fromisoformat(value)
    if day > date.today():
        raise ValueError("La data non può essere futura.")
    return day.isoformat()


METRICS = {
    "summary": "get_user_summary",
    "sleep": "get_sleep_data",
    "heart_rate": "get_heart_rates",
    "stress": "get_stress_data",
    "body_battery": "get_body_battery",
    "hrv": "get_hrv_data",
}
ALLOWED = set(METRICS.values()) | {"get_activities", "get_activity", "get_activity_splits"}


class GarminService:
    def __init__(self, factory=Garmin, ttl: float = 60):
        self.factory = factory
        self.ttl = ttl
        self._client = None
        self._cache: dict[tuple, tuple[float, Any]] = {}
        self._lock = RLock()

    def read(self, method: str, *args: Any) -> Any:
        if method not in ALLOWED:
            raise ValueError("Metodo Garmin non consentito.")
        with self._lock:
            key = (method, *args)
            now = monotonic()
            self._cache = {k: v for k, v in self._cache.items() if v[0] > now}
            if key in self._cache:
                return deepcopy(self._cache[key][1])
            try:
                if self._client is None:
                    # Never prompt on stdin: it carries the MCP protocol.
                    client = self.factory()
                    client.login(str(token_path()))
                    self._client = client
                result = getattr(self._client, method)(*args)
            except GarminConnectTooManyRequestsError:
                raise GarminError("Limite Garmin raggiunto. Attendi prima di riprovare.") from None
            except (GarminConnectAuthenticationError, FileNotFoundError):
                self._client = None
                self._cache.clear()
                raise GarminError("Sessione assente o scaduta. Esegui garmin-mcp login nel terminale.") from None
            except GarminConnectConnectionError:
                raise GarminError("Garmin non raggiungibile. Riprova più tardi.") from None
            except Exception:
                # Upstream errors can contain account data, URLs or tokens.
                raise GarminError("Lettura Garmin fallita. Verifica disponibilità del dato e servizio.") from None
            if len(self._cache) >= 128:
                self._cache.pop(next(iter(self._cache)))
            self._cache[key] = (monotonic() + self.ttl, deepcopy(result))
            return result

    def daily(self, day: str, metric: str) -> dict:
        day = validate_day(day)
        if metric not in METRICS:
            raise ValueError("Metrica non supportata.")
        return {"date": day, "metric": metric, "source": "Garmin Connect", "data": self.read(METRICS[metric], day)}

    def trends(self, start_date: str, end_date: str) -> dict:
        start = date.fromisoformat(validate_day(start_date))
        end = date.fromisoformat(validate_day(end_date))
        count = (end - start).days + 1
        if not 1 <= count <= 31:
            raise ValueError("Intervallo richiesto: da 1 a 31 giorni inclusi.")
        fields = {
            "steps": ("totalSteps", 1, "steps"),
            "distance_km": ("totalDistanceMeters", 1000, "km"),
            "calories_kcal": ("totalKilocalories", 1, "kcal"),
            "resting_heart_rate_bpm": ("restingHeartRate", 1, "bpm"),
            "average_stress": ("averageStressLevel", 1, "Garmin score"),
        }
        rows = []
        for offset in range(count):
            day = (start + timedelta(days=offset)).isoformat()
            raw = self.read("get_user_summary", day) or {}
            row = {"date": day}
            for name, (field, divisor, _) in fields.items():
                value = raw.get(field)
                valid = isinstance(value, (int, float)) and not isinstance(value, bool) and value >= 0
                if name == "resting_heart_rate_bpm" and value == 0:
                    valid = False
                row[name] = value / divisor if valid else None
            rows.append(row)
        stats = {}
        for name, (_, _, unit) in fields.items():
            values = [row[name] for row in rows if row[name] is not None]
            stats[name] = {
                "unit": unit,
                "days_with_data": len(values),
                "mean": round(sum(values) / len(values), 2) if values else None,
                "min": min(values) if values else None,
                "max": max(values) if values else None,
            }
            if name in {"steps", "distance_km", "calories_kcal"}:
                stats[name]["total"] = round(sum(values), 2) if values else None
        return {"start_date": start_date, "end_date": end_date, "days": count,
                "source": "Garmin Connect", "daily": rows, "statistics": stats,
                "note": "Dati mancanti esclusi dalle statistiche; nessuna interpretazione clinica. Oggi può essere incompleto."}
