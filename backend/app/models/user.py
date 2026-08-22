import uuid

from sqlalchemy import Boolean, ForeignKey, ForeignKeyConstraint, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import TenantMixin, TimestampMixin, UUIDPKMixin


class User(UUIDPKMixin, TimestampMixin, TenantMixin, Base):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(320), nullable=False, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False)
    role_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("roles.id", ondelete="SET NULL"), nullable=True
    )
    account_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("accounts.id", ondelete="RESTRICT"), nullable=False, index=True
    )

    __table_args__ = (
        UniqueConstraint("account_id", name="uq_users_account_id"),
        ForeignKeyConstraint(
            ["account_id", "organization_id"],
            ["accounts.id", "accounts.personal_organization_id"],
            name="fk_users_account_personal_tenant",
        ),
        {"comment": "Unique email is enforced per-organization, not globally."},
    )
