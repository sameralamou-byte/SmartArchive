"""Render PDF pages to PNG bytes. Not an OCR engine."""

from io import BytesIO

from app.ocr.types import CorruptedOCRInputError

_PNG = "PNG"


def render_pdf_pages_to_png(data: bytes, *, scale: float = 2.0) -> list[bytes]:
    try:
        import pypdfium2 as pdfium
    except ImportError as exc:
        raise CorruptedOCRInputError("PDF renderer is not installed") from exc

    try:
        document = pdfium.PdfDocument(data)
    except Exception as exc:
        raise CorruptedOCRInputError("PDF could not be opened") from exc

    try:
        if len(document) == 0:
            raise CorruptedOCRInputError("PDF has no pages")
        pages: list[bytes] = []
        for index in range(len(document)):
            page = document[index]
            try:
                bitmap = page.render(scale=scale)
                image = bitmap.to_pil()
                buffer = BytesIO()
                image.save(buffer, format=_PNG)
                pages.append(buffer.getvalue())
            finally:
                page.close()
        return pages
    except CorruptedOCRInputError:
        raise
    except Exception as exc:
        raise CorruptedOCRInputError("PDF page could not be rendered") from exc
    finally:
        document.close()
