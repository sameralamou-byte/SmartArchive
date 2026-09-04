"""
SA-Z7F Part B -- regression coverage for the fail-closed test-database
safeguard in conftest.py (`_db_identity` / `_databases_match` /
`_fail_closed_on_mismatched_test_database`).

The autouse session fixture itself calls `pytest.exit()` on a mismatch,
which would abort the entire test session if exercised end to end -- far
too destructive to actually trigger from within a test. Instead, this
file tests the two pure functions the fixture's decision is built on
directly, with no database and no pytest.exit() ever invoked. This is the
same "extract the decision into a pure function, test that" approach
already established by app.ai.kill_switches (SA-Z7D) for an analogous
problem (a fail-closed decision that must never itself require a live
side effect to verify).

No test in this file requires TEST_DATABASE_URL -- it always runs.
"""

from __future__ import annotations

from app.tests.conftest import _databases_match, _db_identity


def test_identity_ignores_driver_scheme_and_credentials() -> None:
    a = "postgresql+asyncpg://smartarchive:secret1@localhost:5433/smartarchive_test"
    b = "postgresql://different_user:secret2@localhost:5433/smartarchive_test"
    assert _db_identity(a) == _db_identity(b) == ("localhost", 5433, "smartarchive_test")


def test_matching_host_port_db_is_a_match() -> None:
    app_url = "postgresql+asyncpg://smartarchive:x@localhost:5433/smartarchive_test"
    test_url = "postgresql+asyncpg://smartarchive:x@localhost:5433/smartarchive_test"
    assert _databases_match(app_url, test_url) is True


def test_different_dbname_is_not_a_match() -> None:
    """The exact SA-Z7E scenario: TEST_DATABASE_URL targets the disposable
    database, but settings.database_url (left at its ordinary .env value)
    still resolves to the real dev database on the same host/port."""
    app_url = "postgresql+asyncpg://smartarchive:x@localhost:5433/smartarchive"
    test_url = "postgresql+asyncpg://smartarchive:x@localhost:5433/smartarchive_test"
    assert _databases_match(app_url, test_url) is False


def test_different_host_is_not_a_match() -> None:
    app_url = "postgresql+asyncpg://smartarchive:x@postgres:5432/smartarchive_test"
    test_url = "postgresql+asyncpg://smartarchive:x@localhost:5433/smartarchive_test"
    assert _databases_match(app_url, test_url) is False


def test_different_port_is_not_a_match() -> None:
    app_url = "postgresql+asyncpg://smartarchive:x@localhost:5432/smartarchive_test"
    test_url = "postgresql+asyncpg://smartarchive:x@localhost:5433/smartarchive_test"
    assert _databases_match(app_url, test_url) is False


def test_dedicated_less_privileged_test_role_is_still_a_match() -> None:
    """A legitimate setup this guard must NOT reject: a different DB user
    (e.g. a dedicated, less-privileged role) pointed at the exact same
    host/port/database."""
    app_url = "postgresql+asyncpg://readonly_role:x@localhost:5433/smartarchive_test"
    test_url = "postgresql+asyncpg://smartarchive:y@localhost:5433/smartarchive_test"
    assert _databases_match(app_url, test_url) is True
