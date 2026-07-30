from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import TenantMixin, TimestampMixin, UUIDPKMixin


class Role(UUIDPKMixin, TimestampMixin, TenantMixin, Base):
    """
    RBAC role (Phase 1). Every permission check funnels through
    app.security.authorize.authorize(), which today only evaluates RBAC
    but is designed so ABAC conditions can be added inside it later
    without changing any call site.
    """

    __tablename__ = "roles"

    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(String(500), nullable=True)
