"""
Unit tests for the centralized authorize() gate -- mocks the DB session so
no live database is required. Integration coverage (real roles/permissions
round-tripped through Postgres) lives in test_auth_api.py.
"""
import uuid
from unittest.mock import AsyncMock, MagicMock

import pytest

from app.models.user import User
from app.security.authorize import NotAuthorizedError, authorize


def make_user(*, is_superuser=False, role_id=None) -> User:
    return User(
        id=uuid.uuid4(),
        organization_id=uuid.uuid4(),
        email="user@example.com",
        hashed_password="x",
        full_name="Test User",
        is_active=True,
        is_superuser=is_superuser,
        role_id=role_id,
    )


def make_session(scalar_return):
    session = MagicMock()
    result = MagicMock()
    result.scalar_one_or_none.return_value = scalar_return
    session.execute = AsyncMock(return_value=result)
    return session


@pytest.mark.asyncio
async def test_superuser_bypasses_permission_check():
    user = make_user(is_superuser=True)
    session = make_session(None)  # would fail the RBAC lookup if it were reached

    await authorize(session, user, "document.delete")

    session.execute.assert_not_called()


@pytest.mark.asyncio
async def test_user_without_role_is_denied():
    user = make_user(role_id=None)
    session = make_session(None)

    with pytest.raises(NotAuthorizedError, match="no role assigned"):
        await authorize(session, user, "document.read")


@pytest.mark.asyncio
async def test_user_with_role_lacking_permission_is_denied():
    user = make_user(role_id=uuid.uuid4())
    session = make_session(None)  # permission lookup returns nothing

    with pytest.raises(NotAuthorizedError, match="lacks permission"):
        await authorize(session, user, "document.delete")


@pytest.mark.asyncio
async def test_user_with_role_granting_permission_is_allowed():
    user = make_user(role_id=uuid.uuid4())
    session = make_session("document.read")  # permission found

    await authorize(session, user, "document.read")  # should not raise
