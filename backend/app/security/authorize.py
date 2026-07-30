"""
Centralized authorization gate.

Locked decision (SA-ARCH-001): no route or service ever checks permissions
directly. Every protected action calls authorize(user, action, resource).

Phase 1: RBAC only — does the user's role have this permission code.
Stage 2+: this function grows to evaluate ABAC conditions (department,
ownership, classification, time, IP, ...) using the *same* signature, so
no call site ever needs to change.
"""
from dataclasses import dataclass
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.permission import Permission, RolePermission
from app.models.user import User


class NotAuthorizedError(Exception):
    pass


@dataclass
class AuthzContext:
    user: User
    action: str
    resource: Any | None = None


async def authorize(session: AsyncSession, user: User, action: str, resource: Any | None = None) -> None:
    """Raises NotAuthorizedError if `user` may not perform `action` on `resource`."""
    if user.is_superuser:
        return

    if user.role_id is None:
        raise NotAuthorizedError(f"User {user.id} has no role assigned")

    stmt = (
        select(Permission.code)
        .join(RolePermission, RolePermission.permission_id == Permission.id)
        .where(RolePermission.role_id == user.role_id, Permission.code == action)
    )
    result = await session.execute(stmt)
    if result.scalar_one_or_none() is None:
        raise NotAuthorizedError(f"Role {user.role_id} lacks permission '{action}'")

    # --- Stage 2+ ABAC hook point ---
    # Once resource-level rules exist (ownership, department, classification,
    # time window, IP allowlist, ...), evaluate them here using `resource`.
    # The function signature above never needs to change.
