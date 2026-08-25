"""PaddleOCR adapter. Lazy-imports paddle so unit tests do not load the engine."""

from collections.abc import Sequence
from io import BytesIO

import numpy as np
from PIL import Image

from app.ocr.languages import OCR_PRODUCT_LANGUAGES, paddle_lang_codes
from app.ocr.pdf_pages import render_pdf_pages_to_png
from app.ocr.types import (
    CorruptedOCRInputError,
    EmptyOCRResultError,
    OCREngineError,
    OCREngineResult,
    OCRPageResult,
    UnsupportedOCRInputError,
)

_SUPPORTED_MIME = {"application/pdf", "image/png", "image/jpeg"}


def _engine_version() -> str | None:
    try:
        import paddleocr

        return getattr(paddleocr, "__version__", None)
    except Exception:
        return None


def _mean(values: list[float]) -> float | None:
    if not values:
        return None
    return sum(values) / len(values)


def _parse_paddle_output(raw: object) -> tuple[str, float | None]:
    """Extract text and engine-provided confidence only. No invented scores."""
    texts: list[str] = []
    scores: list[float] = []

    if raw is None:
        return "", None

    if isinstance(raw, dict):
        rec_texts = raw.get("rec_texts") or raw.get("rec_text")
        rec_scores = raw.get("rec_scores") or raw.get("rec_score")
        if rec_texts is not None:
            if isinstance(rec_texts, str):
                texts.append(rec_texts)
            else:
                texts.extend(str(item) for item in rec_texts if item)
        if rec_scores is not None:
            if isinstance(rec_scores, (int, float)):
                scores.append(float(rec_scores))
            else:
                scores.extend(float(item) for item in rec_scores if item is not None)
        return "\n".join(texts).strip(), _mean(scores)

    json_payload = getattr(raw, "json", None)
    if callable(json_payload):
        try:
            return _parse_paddle_output(json_payload())
        except Exception:
            pass
    elif isinstance(json_payload, dict):
        return _parse_paddle_output(json_payload)

    rec_texts = getattr(raw, "rec_texts", None)
    rec_scores = getattr(raw, "rec_scores", None)
    if rec_texts is not None:
        return _parse_paddle_output({"rec_texts": rec_texts, "rec_scores": rec_scores})

    # PaddleOCR 2.x: list of [box, (text, score)]
    if isinstance(raw, list) and raw and isinstance(raw[0], list):
        for item in raw:
            if not item:
                continue
            if isinstance(item, list) and len(item) >= 2 and isinstance(item[1], (list, tuple)):
                text = item[1][0]
                texts.append(str(text))
                if len(item[1]) > 1 and item[1][1] is not None:
                    scores.append(float(item[1][1]))
        return "\n".join(texts).strip(), _mean(scores)

    if isinstance(raw, list):
        combined_text: list[str] = []
        combined_scores: list[float] = []
        for item in raw:
            text, score = _parse_paddle_output(item)
            if text:
                combined_text.append(text)
            if score is not None:
                combined_scores.append(score)
        return "\n".join(combined_text).strip(), _mean(combined_scores)

    return "", None


class PaddleOCREngine:
    name = "paddleocr"

    def __init__(self, product_languages: Sequence[str] = OCR_PRODUCT_LANGUAGES) -> None:
        self._product_languages = tuple(product_languages)
        self._paddle_langs = paddle_lang_codes(self._product_languages)
        self._engines: dict[str, object] = {}

    @property
    def version(self) -> str | None:
        return _engine_version()

    def _get_engine(self, paddle_lang: str) -> object:
        if paddle_lang not in self._engines:
            from paddleocr import PaddleOCR

            # 3.x kwargs; unused kwargs are ignored on older constructors via try/except.
            try:
                self._engines[paddle_lang] = PaddleOCR(
                    lang=paddle_lang,
                    use_doc_orientation_classify=False,
                    use_doc_unwarping=False,
                    use_textline_orientation=False,
                    enable_mkldnn=False,
                )
            except TypeError:
                self._engines[paddle_lang] = PaddleOCR(lang=paddle_lang, use_angle_cls=True)
        return self._engines[paddle_lang]

    def _run_one_image(
        self, image_bytes: bytes, paddle_lang: str
    ) -> tuple[str, float | None]:
        engine = self._get_engine(paddle_lang)
        predict = getattr(engine, "predict", None)

        try:
            image = Image.open(BytesIO(image_bytes)).convert("RGB")
            image_array = np.asarray(image)

            if callable(predict):
                raw = predict(image_array)
            else:
                raw = engine.ocr(image_array, cls=True)

        except TypeError:
            raw = engine.ocr(image_array)
        except Exception as exc:
            raise OCREngineError("OCR engine failed") from exc

        return _parse_paddle_output(raw)

    def _best_for_image(self, image_bytes: bytes) -> tuple[str, float | None, str]:
        best_text = ""
        best_score: float | None = None
        best_lang = self._paddle_langs[0]
        last_error: Exception | None = None
        for paddle_lang in self._paddle_langs:
            try:
                text, score = self._run_one_image(image_bytes, paddle_lang)
            except OCREngineError as exc:
                last_error = exc
                continue
            if not text:
                continue
            if best_score is None or (score is not None and score > (best_score or -1.0)):
                best_text, best_score, best_lang = text, score, paddle_lang
            elif best_score is None and score is None and len(text) > len(best_text):
                best_text, best_lang = text, paddle_lang
        if not best_text and last_error is not None and best_score is None:
            raise OCREngineError("OCR engine failed") from last_error
        return best_text, best_score, best_lang

    def _image_pages(self, data: bytes, mime_type: str) -> list[bytes]:
        if mime_type == "application/pdf":
            return render_pdf_pages_to_png(data)
        if mime_type in {"image/png", "image/jpeg"}:
            try:
                from PIL import Image

                image = Image.open(BytesIO(data))
                image.load()
            except Exception as exc:
                raise CorruptedOCRInputError("Image could not be opened") from exc
            return [data]
        raise UnsupportedOCRInputError(f"MIME type '{mime_type}' is not supported for OCR")

    def recognize(self, data: bytes, mime_type: str) -> OCREngineResult:
        if mime_type not in _SUPPORTED_MIME:
            raise UnsupportedOCRInputError(f"MIME type '{mime_type}' is not supported for OCR")
        if not data:
            raise CorruptedOCRInputError("Empty file")

        try:
            page_images = self._image_pages(data, mime_type)
        except (UnsupportedOCRInputError, CorruptedOCRInputError):
            raise
        except Exception as exc:
            raise CorruptedOCRInputError("Document could not be prepared for OCR") from exc

        pages: list[OCRPageResult] = []
        langs_used: list[str] = []
        for index, page_bytes in enumerate(page_images, start=1):
            text, score, paddle_lang = self._best_for_image(page_bytes)
            langs_used.append(paddle_lang)
            pages.append(OCRPageResult(page_number=index, text=text, confidence=score))

        result = OCREngineResult(
            pages=tuple(pages),
            engine_name=self.name,
            engine_version=self.version,
            detected_language=None,
            paddle_lang_used=langs_used[0] if langs_used else None,
        )
        if not result.combined_text.strip():
            raise EmptyOCRResultError("empty OCR result")
        return result
