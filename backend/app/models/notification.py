import enum
import uuid

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import TenantMixin, TimestampMixin, UUIDPKMixin


class NotificationChannel(str, enum.Enum):
    in_app = "in_app"
    email = "email"
    push = "push"


class Notification(UUIDPKMixin, TimestampMixin, TenantMixin, Base):
    """
    Backing table for the Universal Reminders & Scheduling Engine (Layer 1D,
    see SA-ARCH-006). Delivery logic and ACE routing are Stage 2 — this is
    the schema only.
    """

    __tablename__ = "notifications"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    channel: Mapped[NotificationChannel] = mapped_column(
        Enum(NotificationChannel, name="notification_channel"),
        nullable=False,
        default=NotificationChannel.in_app,
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    body: Mapped[str | None] = mapped_column(Text, nullable=True)
    scheduled_for: Mapped[DateTime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
