import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import TimestampMixin, UUIDPKMixin


class Account(UUIDPKMixin, TimestampMixin, Base):
    """Durable customer identity. Platform-level — not a TenantMixin/RLS archive row."""

    __tablename__ = "accounts"

    email: Mapped[str] = mapped_column(String(320), nullable=False, unique=True, index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    email_verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    personal_organization_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="RESTRICT"),
        nullable=False,
        unique=True,
    )

    __table_args__ = (
        UniqueConstraint(
            "id",
            "personal_organization_id",
            name="uq_accounts_id_personal_organization_id",
        ),
    )
