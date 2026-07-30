"""Unit tests — no infrastructure required."""
import pytest

from app.core.upload_validation import (
    MAX_UPLOAD_SIZE_BYTES,
    UploadValidationError,
    validate_upload,
)


def test_rejects_empty_file():
    with pytest.raises(UploadValidationError, match="Empty file"):
        validate_upload(b"", "application/pdf")


def test_rejects_oversized_file():
    data = b"%PDF-" + b"0" * (MAX_UPLOAD_SIZE_BYTES + 1)
    with pytest.raises(UploadValidationError, match="exceeds"):
        validate_upload(data, "application/pdf")


def test_rejects_unrecognized_signature():
    with pytest.raises(UploadValidationError, match="Unrecognized"):
        validate_upload(b"not a real file format", "application/pdf")


def test_accepts_valid_pdf_signature():
    result = validate_upload(b"%PDF-1.7 rest of file", "application/pdf")
    assert result.detected_mime_type == "application/pdf"


def test_accepts_valid_png_signature():
    data = b"\x89PNG\r\n\x1a\n" + b"rest of file"
    result = validate_upload(data, "image/png")
    assert result.detected_mime_type == "image/png"


def test_rejects_mismatched_declared_type_for_ooxml_not_in_allowlist():
    """ZIP-signature file whose declared content-type isn't allowlisted must fail."""
    data = b"PK\x03\x04" + b"rest of file"
    with pytest.raises(UploadValidationError, match="not permitted"):
        validate_upload(data, "application/x-suspicious")


def test_accepts_docx_via_zip_signature_and_declared_type():
    data = b"PK\x03\x04" + b"rest of file"
    result = validate_upload(
        data, "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
    assert "wordprocessingml" in result.detected_mime_type
