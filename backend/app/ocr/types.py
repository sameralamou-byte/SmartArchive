"""Structured OCR engine output. Confidence is only stored when the engine provides it."""

from dataclasses import dataclass, field


@dataclass(frozen=True)
class OCRPageResult:
    page_number: int
    text: str
    confidence: float | None = None


@dataclass(frozen=True)
class OCREngineResult:
    pages: tuple[OCRPageResult, ...]
    engine_name: str
    engine_version: str | None = None
    detected_language: str | None = None
    paddle_lang_used: str | None = None

    @property
    def combined_text(self) -> str:
        return "\n\n".join(page.text for page in self.pages if page.text.strip())

    @property
    def mean_confidence(self) -> float | None:
        scores = [page.confidence for page in self.pages if page.confidence is not None]
        if not scores:
            return None
        return sum(scores) / len(scores)


class OCREngineError(Exception):
    """Engine or input failure. Message is safe to persist; do not attach secrets."""


class UnsupportedOCRInputError(OCREngineError):
    pass


class CorruptedOCRInputError(OCREngineError):
    pass


class EmptyOCRResultError(OCREngineError):
    pass
