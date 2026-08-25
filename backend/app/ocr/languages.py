"""Explicit SmartArchive OCR language configuration.

These codes are product languages, not Paddle model names. Mapping to an
engine-specific model lives in the Paddle adapter so the pipeline can swap
engines without changing callers.
"""

from collections.abc import Sequence

# Product requirement (SA Stage 2 OCR MVP). Do not silently drop a language.
OCR_PRODUCT_LANGUAGES: tuple[str, ...] = ("ar", "en", "de", "es", "fr", "ru", "uk")

# PaddleOCR `lang` values that cover the product set (PP-OCR multilingual packs).
# Several product languages share one pack; that is an engine constraint, not
# a claim that quality is equal across those languages.
PADDLE_LANG_BY_PRODUCT: dict[str, str] = {
    "ar": "arabic",
    "en": "en",
    "de": "german",
    "es": "latin",
    "fr": "french",
    "ru": "cyrillic",
    "uk": "cyrillic",
}


def normalize_product_languages(requested: Sequence[str] | None) -> tuple[str, ...]:
    if not requested:
        return OCR_PRODUCT_LANGUAGES
    unknown = [code for code in requested if code not in OCR_PRODUCT_LANGUAGES]
    if unknown:
        raise ValueError(f"Unsupported OCR product language(s): {unknown}")
    return tuple(dict.fromkeys(requested))


def paddle_lang_codes(requested: Sequence[str] | None = None) -> tuple[str, ...]:
    """Unique Paddle `lang` values needed to cover the requested product languages."""
    products = normalize_product_languages(requested)
    return tuple(dict.fromkeys(PADDLE_LANG_BY_PRODUCT[code] for code in products))
