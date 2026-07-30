"""
Example domain events for the document lifecycle.

No subscribers are wired up yet in Phase 1 (OCR/AI/Notification services
don't exist until Stage 2). This file exists so the event names are
defined in one place from day one.
"""
DOCUMENT_UPLOADED = "document.uploaded"
DOCUMENT_DELETED = "document.deleted"
DOCUMENT_VERSION_CREATED = "document.version_created"
