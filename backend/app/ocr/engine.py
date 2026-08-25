"""OCR engine protocol — swap PaddleOCR without rewriting the document pipeline."""

from typing import Protocol

from app.ocr.types import OCREngineResult


class OCREngine(Protocol):
    @property
    def name(self) -> str: ...

    @property
    def version(self) -> str | None: ...

    def recognize(self, data: bytes, mime_type: str) -> OCREngineResult:
        """Return page-aware OCR output. Must not invent confidence values."""
        ...
