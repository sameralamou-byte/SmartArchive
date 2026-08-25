from app.ocr.languages import OCR_PRODUCT_LANGUAGES
from app.ocr.paddle_engine import PaddleOCREngine


def default_ocr_engine() -> PaddleOCREngine:
    return PaddleOCREngine(product_languages=OCR_PRODUCT_LANGUAGES)
