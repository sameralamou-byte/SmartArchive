import os
import urllib.parse

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine

from app.main import app

# Integration tests (real Postgres: auth flow, RLS isolation) only run when
# a reachable test database is configured. They are skipped -- not failed --
# otherwise, so `pytest` still passes in a laptop/CI environment that hasn't
# started the Docker Compose stack.
#
# IMPORTANT (SA-Z7F): this env var alone is NOT enough to run the
# @requires_test_db suite safely. `integration_engine` (below) connects
# using this URL, but the live FastAPI `app` used by the `client` fixture
# still resolves its own database via app.core.database.get_db() ->
# app.core.config.settings.database_url, built from the separate
# POSTGRES_USER/PASSWORD/DB/HOST/PORT settings fields (normally sourced
# from .env). If those two disagree, `client`-based tests silently write
# through the app into whatever settings.database_url points at -- which,
# left at its normal .env value, is the real local dev database -- while
# this file's own direct verification queries read a different, disposable
# database. SA-Z7E diagnosed exactly this: 22 failures, zero of them a
# real test or production defect, all caused by that split. The
# _fail_closed_on_mismatched_test_database fixture below refuses to run
# ANY test in that state rather than let it happen silently again -- see
# its own docstring for the exact invocation this requires.
#
# Point TEST_DATABASE_URL at a disposable database, never at one with real
# data (replace PASSWORD with your actual one), AND export the matching
# POSTGRES_* overrides so the app agrees:
#   export TEST_DATABASE_URL=postgresql+asyncpg://smartarchive:PASSWORD@localhost:5433/smartarchive_test
#   export POSTGRES_USER=smartarchive POSTGRES_PASSWORD=PASSWORD \
#          POSTGRES_DB=smartarchive_test POSTGRES_HOST=localhost POSTGRES_PORT=5433
TEST_DATABASE_URL = os.environ.get("TEST_DATABASE_URL")


def _integration_db_available() -> bool:
    return TEST_DATABASE_URL is not None


requires_test_db = pytest.mark.skipif(
    not _integration_db_available(),
    reason="TEST_DATABASE_URL not set -- skipping integration test (see conftest.py)",
)


def _db_identity(url: str) -> tuple[str, int, str]:
    """(host, port, dbname) from a SQLAlchemy-style connection URL,
    ignoring scheme/driver (`+asyncpg`) and credentials -- the parts that
    actually determine which physical database a connection lands on.
    Pure and side-effect-free so it can be unit-tested directly (see
    test_conftest_db_safeguard.py) without ever needing pytest.exit() to
    actually fire mid-suite."""
    parsed = urllib.parse.urlsplit(url)
    return (parsed.hostname or "", parsed.port or 5432, parsed.path.lstrip("/"))


def _databases_match(app_database_url: str, test_database_url: str) -> bool:
    """True iff the live app's own settings.database_url and
    TEST_DATABASE_URL resolve to the same (host, port, dbname) -- i.e.
    `client`-based tests and this file's own `integration_engine`-based
    tests would read/write the same database. Deliberately ignores
    username/password: a dedicated, less-privileged test role pointed at
    the SAME database is a legitimate setup this guard must not reject."""
    return _db_identity(app_database_url) == _db_identity(test_database_url)


@pytest.fixture(scope="session", autouse=True)
def _fail_closed_on_mismatched_test_database() -> None:
    """SA-Z7F Part B -- runs once per test session, before any test body,
    and ONLY when TEST_DATABASE_URL is set (a plain non-DB `pytest` run is
    completely unaffected: this fixture returns immediately). If the live
    app's settings.database_url does not match TEST_DATABASE_URL, this
    fails the entire session closed via pytest.exit() -- not a per-test
    skip, not a warning -- rather than let even one `client`-based
    integration test silently write into a different (and, left at
    ordinary .env defaults, real) database than the one being verified
    against. See conftest.py's own module docstring above for the exact
    invocation this requires, and SA-Z7E's triage report for the failure
    mode this closes."""
    if TEST_DATABASE_URL is None:
        return
    from app.core.config import settings

    if not _databases_match(settings.database_url, TEST_DATABASE_URL):
        app_host, app_port, app_db = _db_identity(settings.database_url)
        test_host, test_port, test_db = _db_identity(TEST_DATABASE_URL)
        pytest.exit(
            "SA-Z7F fail-closed: TEST_DATABASE_URL targets "
            f"{test_host}:{test_port}/{test_db}, but the FastAPI app's own "
            f"settings.database_url (POSTGRES_HOST/PORT/DB/USER/PASSWORD) resolves to "
            f"{app_host}:{app_port}/{app_db}. Client-based integration tests would "
            "silently write into a different database than the one being verified/reset "
            "against -- refusing to run any test rather than repeat SA-Z7E's finding. "
            "Export POSTGRES_USER/POSTGRES_PASSWORD/POSTGRES_DB/POSTGRES_HOST/POSTGRES_PORT "
            "to match TEST_DATABASE_URL -- see this file's own module docstring for the "
            "exact invocation.",
            returncode=1,
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
