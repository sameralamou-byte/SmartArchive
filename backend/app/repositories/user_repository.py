import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User


class UserRepository:
    """Repository pattern: services never write raw SQLAlchemy queries directly."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_email(self, email: str, organization_id: uuid.UUID) -> User | None:
        stmt = select(User).where(User.email == email, User.organization_id == organization_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_account_and_organization(
        self, account_id: uuid.UUID, organization_id: uuid.UUID
    ) -> User | None:
        stmt = select(User).where(
            User.account_id == account_id, User.organization_id == organization_id
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_id(self, user_id: uuid.UUID) -> User | None:
        stmt = select(User).where(User.id == user_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def create(self, user: User) -> User:
        self.session.add(user)
        await self.session.flush()
        return user
