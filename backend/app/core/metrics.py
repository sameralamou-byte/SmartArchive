"""
Prometheus metrics — Milestone 1.5 observability.

Exposed at /metrics (root, not under /api/v1 — this is an infra endpoint,
not a product API). Scraped by the `prometheus` service in docker-compose.yml;
visualized in the pre-provisioned Grafana dashboard.
"""
import time
from collections.abc import Awaitable, Callable

from fastapi import Request, Response
from prometheus_client import CONTENT_TYPE_LATEST, Counter, Histogram, generate_latest

REQUEST_COUNT = Counter(
    "smartarchive_http_requests_total",
    "Total HTTP requests",
    ["method", "path", "status_code"],
)
REQUEST_LATENCY = Histogram(
    "smartarchive_http_request_duration_seconds",
    "HTTP request latency",
    ["method", "path"],
)


async def metrics_middleware(
    request: Request, call_next: Callable[[Request], Awaitable[Response]]
) -> Response:
    start = time.perf_counter()
    response = await call_next(request)
    duration = time.perf_counter() - start

    # Use the matched route template (e.g. "/api/v1/users/{id}"), not the
    # raw path, so metrics don't explode into one series per UUID.
    path = request.scope.get("route").path if request.scope.get("route") else request.url.path

    REQUEST_COUNT.labels(request.method, path, response.status_code).inc()
    REQUEST_LATENCY.labels(request.method, path).observe(duration)
    return response


def metrics_endpoint() -> Response:
    return Response(content=generate_latest(), media_type=CONTENT_TYPE_LATEST)
