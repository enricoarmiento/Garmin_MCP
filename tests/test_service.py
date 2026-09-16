from unittest.mock import Mock

import pytest
from garminconnect import GarminConnectAuthenticationError, GarminConnectTooManyRequestsError

from garmin_mcp.service import GarminError, GarminService, validate_day
from garmin_mcp import server


@pytest.fixture
def setup_service():
    client = Mock()
    factory = Mock(return_value=client)
    return GarminService(factory=factory), client, factory


def test_cache_and_session_reuse(setup_service):
    service, client, factory = setup_service
    client.get_user_summary.return_value = {"totalSteps": 123}
    first = service.daily("2025-01-01", "summary")
    first["data"]["totalSteps"] = 999
    assert service.daily("2025-01-01", "summary")["data"]["totalSteps"] == 123
    factory.assert_called_once_with()
    client.login.assert_called_once()
    client.get_user_summary.assert_called_once_with("2025-01-01")


def test_expired_cache(setup_service):
    service, client, _ = setup_service
    service.ttl = 0
    client.get_user_summary.return_value = {}
    service.daily("2025-01-01", "summary")
    service.daily("2025-01-01", "summary")
    assert client.get_user_summary.call_count == 2


@pytest.mark.parametrize("value", ["2025-1-1", "2025-02-30", "2999-01-01", "20250101", "foo"])
def test_invalid_date(value):
    with pytest.raises(ValueError):
        validate_day(value)


def test_no_writes(setup_service):
    service, _, factory = setup_service
    with pytest.raises(ValueError):
        service.read("delete_activity", "1")
    factory.assert_not_called()


@pytest.mark.parametrize("error", [GarminConnectAuthenticationError("secret"), GarminConnectTooManyRequestsError("secret"), RuntimeError("secret")])
def test_errors_are_redacted(setup_service, error):
    service, client, _ = setup_service
    client.login.side_effect = error
    with pytest.raises(GarminError) as exc:
        service.daily("2025-01-01", "summary")
    assert "secret" not in str(exc.value)
    assert not service._cache


def test_auth_failure_discards_session(setup_service):
    service, client, _ = setup_service
    client.get_user_summary.side_effect = GarminConnectAuthenticationError("secret")
    with pytest.raises(GarminError):
        service.daily("2025-01-01", "summary")
    assert service._client is None


def test_null_aware_statistics(setup_service):
    service, client, _ = setup_service
    client.get_user_summary.side_effect = [
        {"totalSteps": 0, "totalDistanceMeters": 1500, "restingHeartRate": 60, "averageStressLevel": -1},
        {"totalSteps": 200, "restingHeartRate": 0, "averageStressLevel": 40},
        {},
    ]
    result = service.trends("2025-01-01", "2025-01-03")
    stats = result["statistics"]
    assert stats["steps"]["mean"] == 100
    assert stats["steps"]["days_with_data"] == 2
    assert stats["distance_km"]["total"] == 1.5
    assert stats["resting_heart_rate_bpm"]["days_with_data"] == 1
    assert stats["average_stress"]["mean"] == 40
    assert stats["calories_kcal"]["total"] is None


@pytest.mark.parametrize("start,end", [("2025-01-01", "2025-02-01"), ("2025-01-02", "2025-01-01")])
def test_trends_bound_before_network(setup_service, start, end):
    service, _, factory = setup_service
    with pytest.raises(ValueError):
        service.trends(start, end)
    factory.assert_not_called()


def test_activity_pagination_and_splits(monkeypatch, setup_service):
    service, client, _ = setup_service
    monkeypatch.setattr(server, "service", service)
    client.get_activities.return_value = []
    client.get_activity.return_value = {"activityId": 123}
    client.get_activity_splits.return_value = {"lapDTOs": []}
    assert server.garmin_activities(20, 10)["data"] == []
    client.get_activities.assert_called_once_with(20, 10)
    assert server.garmin_activity("123", True)["splits"] == {"lapDTOs": []}
    for start, limit in [(-1, 20), (0, 0), (0, 101)]:
        with pytest.raises(ValueError):
            server.garmin_activities(start, limit)
    with pytest.raises(ValueError):
        server.garmin_activity("../secret")
