# ADR-001 — Fully async backend architecture

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-07-30 |
| Related | SA-ARCH-001 |

## Context
SmartArchive's own stated principles include async programming, high
performance, and scalability. Stage 2+ will add OCR, AI inference calls,
and ERP/CRM connectors — all I/O-bound workloads that block a thread for
non-trivial durations if done synchronously.

## Decision
The entire backend stack is asynchronous end to end: FastAPI async routes,
SQLAlchemy 2.0's async ORM, the `asyncpg` driver, and async repositories and
services. No synchronous database call exists anywhere in the codebase.

## Alternatives considered
- **Sync SQLAlchemy + Gunicorn worker processes.** Simpler to write and
  debug, well-understood. Rejected because scaling under concurrent I/O
  (many simultaneous OCR/AI/connector calls) would require many more
  worker processes for the same throughput, and migrating a sync codebase
  to async later touches every repository and route.
- **Sync core with async only for Stage 2 AI calls (mixed model).**
  Rejected: mixing sync and async in one codebase invites accidental
  blocking calls inside the event loop, which is worse than committing to
  one model from the start.

## Consequences
- Every new repository/service must use `AsyncSession` and `await` — this
  is enforced by convention and code review, not by tooling, in Phase 1.
- Third-party libraries without async support (e.g. some SDKs) need an
  `asyncio.to_thread()` wrapper; the MinIO client (`storage_service.py`)
  is currently used this way implicitly since MinIO's Python SDK is sync —
  noted as a Stage 2 follow-up to wrap in a thread pool if it becomes a
  bottleneck under load.
