"""Shared FastAPI dependencies: current session, current user, tenant context."""
import uuid

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.exceptions import EmailNotVerifiedError
from app.core.tenancy import set_tenant_context
from app.models.account import Account
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.security.jwt import TokenType, decode_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    session: AsyncSession = Depends(get_db),
) -> User:
    try:
        payload = decode_token(token)
    except ValueError as exc:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or expired token") from exc

    if payload.get("type") != TokenType.access.value:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Not an access token")

    user_id = uuid.UUID(payload["sub"])
    organization_id = payload["org_id"]

    # Set the Postgres session var read by every RLS policy for this request.
    # Isolation remains org_id (ADR-002). account_id is identity context only.
    await set_tenant_context(session, organization_id)

    user = await UserRepository(session).get_by_id(user_id)
    if user is None or not user.is_active:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "User not found or inactive")

    token_account_id = payload.get("account_id")
    if token_account_id is not None and str(user.account_id) != str(token_account_id):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or expired token")

    account = await session.get(Account, user.account_id)
    if account is None or account.email_verified_at is None:
        raise EmailNotVerifiedError("Confirm your email before continuing.")
    return user
