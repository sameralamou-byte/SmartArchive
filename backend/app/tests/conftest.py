import os

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine

from app.main import app

# Integration tests (real Postgres: auth flow, RLS isolation) only run when
# a reachable test database is configured. They are skipped -- not failed --
# otherwise, so `pytest` still passes in a laptop/CI environment that hasn't
# started the Docker Compose stack. Point this at a disposable database,
# never at a database with real data (replace PASSWORD with your actual one):
#   export TEST_DATABASE_URL=postgresql+asyncpg://smartarchive:PASSWORD@localhost:5432/smartarchive_test
TEST_DATABASE_URL = os.environ.get("TEST_DATABASE_URL")


def _integration_db_available() -> bool:
    return TEST_DATABASE_URL is not None


requires_test_db = pytest.mark.skipif(
    not _integration_db_available(),
    reason="TEST_DATABASE_URL not set -- skipping integration test (see conftest.py)",
)


@pytest.fixture(autouse=True)
def memory_email_delivery(monkeypatch):
    from app.core.config import settings
    from app.mailer.sender import reset_memory_sender

    monkeypatch.setattr(settings, "email_delivery_mode", "memory")
    reset_memory_sender()


@pytest.fixture(autouse=True)
def reset_rate_limit_keys():
    """Isolate tests from the production Redis rate limiter without changing its limits.

    Auth tests share one client IP under ASGITransport. Clearing ratelimit:* before
    each test prevents cross-test 429s while leaving production 5/60s register policy intact.
    Only runs when Redis is part of the test environment (CI / TEST_DATABASE_URL).
    """
    if not os.environ.get("REDIS_HOST") and not TEST_DATABASE_URL:
        return
    try:
        import redis

        from app.core.config import settings

        client = redis.Redis.from_url(settings.redis_url, socket_connect_timeout=0.5)
        keys = client.keys("ratelimit:*")
        if keys:
            client.delete(*keys)
        client.close()
    except Exception:
        pass


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.fixture
async def integration_engine():
    """Only used by tests marked with @requires_test_db."""
    engine = create_async_engine(TEST_DATABASE_URL, pool_pre_ping=True)
    yield engine
    await engine.dispose()
