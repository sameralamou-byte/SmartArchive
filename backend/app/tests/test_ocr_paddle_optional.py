"""Optional live PaddleOCR check. Skipped unless RUN_PADDLE_OCR=1."""

import os

import pytest

from app.ocr.paddle_engine import PaddleOCREngine
from app.ocr.types import EmptyOCRResultError, OCREngineError

TINY_PNG = (
    b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01"
    b"\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\xcf\xc0"
    b"\x00\x00\x00\x03\x00\x01\x00\x05\xfe\xd4\xef\x00\x00\x00\x00IEND\xaeB`\x82"
)

pytestmark = pytest.mark.skipif(
    os.environ.get("RUN_PADDLE_OCR") != "1",
    reason="RUN_PADDLE_OCR not set — skipping live PaddleOCR (downloads models)",
)


def test_paddle_engine_runs_on_png():
    engine = PaddleOCREngine(product_languages=("en",))
    try:
        result = engine.recognize(TINY_PNG, "image/png")
    except EmptyOCRResultError:
        return
    except OCREngineError:
        pytest.fail("PaddleOCR engine failed to run")
    assert result.engine_name == "paddleocr"
    assert result.pages
