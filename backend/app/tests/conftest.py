import os

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine

from app.main import app

# Integration tests (real Postgres: auth flow, RLS isolation) only run when
# a reachable test database is configured. They are skipped -- not failed --
# otherwise, so `pytest` still passes in a laptop/CI environment that hasn't
# started the Docker Compose stack. Point this at a disposable database,
# never at a database with real data:
#   export TEST_DATABASE_URL=postgresql+asyncpg://smartarchive:smartarchive_dev_password@localhost:5432/smartarchive_test
TEST_DATABASE_URL = os.environ.get("TEST_DATABASE_URL")


def _integration_db_available() -> bool:
    return TEST_DATABASE_URL is not None


requires_test_db = pytest.mark.skipif(
    not _integration_db_available(),
    reason="TEST_DATABASE_URL not set -- skipping integration test (see conftest.py)",
)


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
