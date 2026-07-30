"""
File upload validation — Milestone 1.5 hardening.

Three layers, all enforced before a byte reaches MinIO:
1. Size limit
2. MIME allowlist, verified against the actual file signature (not just the
   client-supplied Content-Type, which is trivially spoofable)
3. Antivirus scan hook (stubbed in Phase 1.5 — wire to ClamAV or a cloud AV
   API in Stage 2; the call site and failure handling are already in place)
"""
from dataclasses import dataclass

MAX_UPLOAD_SIZE_BYTES = 50 * 1024 * 1024  # 50 MB

# Signature (magic number) -> mime type. Extend as new formats are supported.
_SIGNATURES: list[tuple[bytes, str]] = [
    (b"%PDF-", "application/pdf"),
    (b"\x89PNG\r\n\x1a\n", "image/png"),
    (b"\xff\xd8\xff", "image/jpeg"),
    (b"PK\x03\x04", "application/zip"),  # also covers .docx/.xlsx/.pptx (OOXML)
]

ALLOWED_MIME_TYPES = {
    "application/pdf",
    "image/png",
    "image/jpeg",
    "application/zip",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
}


class UploadValidationError(Exception):
    pass


@dataclass
class ValidationResult:
    detected_mime_type: str


def detect_mime_type(head: bytes) -> str | None:
    for signature, mime_type in _SIGNATURES:
        if head.startswith(signature):
            return mime_type
    return None


def validate_upload(data: bytes, declared_content_type: str) -> ValidationResult:
    if len(data) == 0:
        raise UploadValidationError("Empty file")
    if len(data) > MAX_UPLOAD_SIZE_BYTES:
        raise UploadValidationError(
            f"File exceeds the {MAX_UPLOAD_SIZE_BYTES // (1024 * 1024)} MB limit"
        )

    detected = detect_mime_type(data[:16])
    if detected is None:
        raise UploadValidationError("Unrecognized or unsupported file type")

    # OOXML formats (docx/xlsx/pptx) share the ZIP signature; trust the
    # client-declared type only when it's in the allowlist AND the magic
    # number confirms "this is at least a ZIP container".
    effective_mime = declared_content_type if detected == "application/zip" else detected
    if effective_mime not in ALLOWED_MIME_TYPES:
        raise UploadValidationError(f"MIME type '{effective_mime}' is not permitted")

    return ValidationResult(detected_mime_type=effective_mime)


def antivirus_scan_hook(data: bytes) -> bool:
    """
    Stub for Stage 2. Always returns True (clean) in Phase 1.5.
    Wire to ClamAV (clamd daemon) or a cloud AV API here; the call site in
    app/routers/v1/files.py already treats a False return as a rejected upload.
    """
    return True
