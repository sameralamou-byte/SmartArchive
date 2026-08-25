"""PDF page rendering — not OCR quality."""

import pytest

from app.ocr.pdf_pages import render_pdf_pages_to_png
from app.ocr.types import CorruptedOCRInputError

# One-page empty PDF (valid enough for pypdfium2 to report a page count).
MINIMAL_PDF = (
    b"%PDF-1.1\n"
    b"1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n"
    b"2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n"
    b"3 0 obj<</Type/Page/MediaBox[0 0 72 72]/Parent 2 0 R/Resources<<>>>>endobj\n"
    b"xref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n"
    b"0000000058 00000 n \n0000000115 00000 n \n"
    b"trailer<</Size 4/Root 1 0 R>>\nstartxref\n202\n%%EOF\n"
)


def test_pdf_page_boundaries_are_preserved():
    pages = render_pdf_pages_to_png(MINIMAL_PDF)
    assert len(pages) == 1
    assert pages[0].startswith(b"\x89PNG")


def test_corrupt_pdf_fails():
    with pytest.raises(CorruptedOCRInputError):
        render_pdf_pages_to_png(b"not a pdf")
