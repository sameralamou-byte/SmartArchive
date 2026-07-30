import enum
import uuid

from sqlalchemy import Enum, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import TimestampMixin, UUIDPKMixin


class DeploymentMode(str, enum.Enum):
    """Per SA-ARCH-006: integrated (default), standalone (fallback), or hybrid."""

    integrated = "integrated"
    standalone = "standalone"
    hybrid = "hybrid"


class Organization(UUIDPKMixin, TimestampMixin, Base):
    __tablename__ = "organizations"

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    deployment_mode: Mapped[DeploymentMode] = mapped_column(
        Enum(DeploymentMode, name="deployment_mode"),
        nullable=False,
        default=DeploymentMode.standalone,
    )
    is_active: Mapped[bool] = mapped_column(default=True)
