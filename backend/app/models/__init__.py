"""
Import every model so Alembic's autogenerate (and Base.metadata) sees the
full schema. Do not remove imports even if they look unused.
"""
from app.models.ai_job import AIJob  # noqa: F401
from app.models.audit_log import AuditLog  # noqa: F401
from app.models.category import Category  # noqa: F401
from app.models.document import Document  # noqa: F401
from app.models.document_version import DocumentVersion  # noqa: F401
from app.models.folder import Folder  # noqa: F401
from app.models.notification import Notification  # noqa: F401
from app.models.ocr_job import OCRJob  # noqa: F401
from app.models.organization import Organization  # noqa: F401
from app.models.permission import Permission, RolePermission  # noqa: F401
from app.models.role import Role  # noqa: F401
from app.models.tag import DocumentTag, Tag  # noqa: F401
from app.models.user import User  # noqa: F401
