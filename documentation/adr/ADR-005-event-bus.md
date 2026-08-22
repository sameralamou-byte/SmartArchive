# ADR-005 — In-process domain event bus

| Field | Value |
|---|---|
| Status | Locked (relabeled from "Accepted" per SA-ARCH-999 §2) |
| Date | 2026-07-30 |
| Related | SA-ARCH-001 |

## Context
Stage 2+ features (OCR, AI classification, notifications, audit logging,
workflow automation) all need to react to the same core events (e.g.
"document uploaded") without the document upload endpoint knowing about
every downstream consumer.

## Decision
Business actions publish named events (`app/events/bus.py`,
`app/events/document_events.py`) to an in-process, in-memory event bus.
Subscribers register handlers for event names; publishers never call
subscriber code directly.

## Alternatives considered
- **Direct service-to-service calls** (upload handler calls OCR service
  calls notification service). Rejected: creates a tightly coupled call
  chain where adding one more downstream feature means editing the
  original upload handler again.
- **A real message broker (Redis Streams / RabbitMQ / Kafka) from day
  one.** The right long-term answer once handlers exist and need
  durability, retries, or cross-process delivery — but Phase 1 has zero
  subscribers (OCR/AI/notifications are all Stage 2), so standing up a
  broker now has no payoff yet. Deferred, not rejected.

## Consequences
- The current bus is intentionally not durable: if the process restarts
  between publish and handling, the event is lost. This is acceptable
  today because nothing subscribes yet.
- The publish/subscribe interface (`Event`, `EventBus.publish`,
  `EventBus.subscribe`) is written so swapping the in-process
  implementation for a Redis-Streams-backed one later doesn't require
  changing any publisher or subscriber code — only `bus.py`'s internals.
