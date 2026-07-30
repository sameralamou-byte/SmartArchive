"""
Request ID / correlation ID propagation — Milestone 1.5 observability.

If the caller (e.g. an upstream gateway, or a frontend request) supplies
X-Correlation-ID, it is preserved end to end so a single user action can be
traced across services. Otherwise a new request ID is minted. Both are
attached to every log line for this request (see app/core/logging.py) and
echoed back in the response headers.
"""
import uuid
from contextvars import ContextVar

request_id_ctx: ContextVar[str] = ContextVar("request_id", default="")
correlation_id_ctx: ContextVar[str] = ContextVar("correlation_id", default="")

REQUEST_ID_HEADER = "X-Request-ID"
CORRELATION_ID_HEADER = "X-Correlation-ID"


def new_request_id() -> str:
    return str(uuid.uuid4())
