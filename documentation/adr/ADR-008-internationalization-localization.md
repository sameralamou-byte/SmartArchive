# ADR-008 — Internationalization & Localization Strategy

| Field | Value |
|---|---|
| Status | **Approved** (2026-07-30, after one focused implementation-consequences review; see [SA-ARCH-999](../SA-ARCH-999_Architecture_Governance.md) §5) |
| Date | 2026-07-30 |
| Related | [SA-ARCH-000](../SA-ARCH-000_Master_Architecture.md) §9, [SA-AUDIT-002](../SA-AUDIT-002_Enterprise_Architecture_Audit.md) §16, [SA-ROADMAP-001](../SA-ROADMAP-001_Architecture_Roadmap.md) Wave 0 (`B-I18N`), ADR-007 (Platform Contracts — AI Provider, OCR) |

## Context

SA-AUDIT-002 §16 found no internationalization strategy anywhere in the codebase, despite `SA-ARCH-006` — one of the platform's own governing documents — being written in Arabic, and Principle #4 naming translation ("Translate this letter") as a core voice/AI use case, not an edge case. SA-ARCH-000 §9 flagged that this needs to inform the AI Gateway's prompt-template design and the frontend's design-token system before either solidifies further.

## Decision

**Localization is broader than language, and this decision covers all of it** — not just translated strings, but date formats, number formats, currency, timezone, address formats, and sorting/collation. All of these follow the same locale-negotiation cascade below; none get a separate mechanism.

- **Locale negotiation cascade**: per-`User` preferred locale → per-`Organization` (Tenant) default locale → platform default (English). This mirrors the precedence pattern already established for `deployment_mode` cascading from `Organization`.
- **RTL support**: a layout-direction property added to the shared frontend design-token system (extending the `brand` color-token work noted in SA-AUDIT-002 §5). Components adopt logical CSS properties (`start`/`end`, not `left`/`right`) starting with the next UI milestone — this is a frontend convention decision, not a new library choice.
- **Translated-UI ownership**: a standard message-catalog pattern (specific library selection is an implementation detail, not an architectural decision, and is deferred to Stage 2 implementation).
- **AI-assisted translation**: modeled as a new `AIJobType.translation` value (extending the existing enum in `backend/app/models/ai_job.py`) and an operation on the **AI Provider Contract** (ADR-007) — translation is a capability the AI Gateway orchestrates like classification or summarization, not a separate subsystem.
- **Multilingual document processing**: the **OCR Contract** (ADR-007) carries a detected-language field on its result. A document's stored/detected language may differ from a user's UI language; Search (via the Search Contract) must be able to query across both rather than assuming they match.

## Alternatives Considered

- **Defer i18n entirely until a non-English market is confirmed.** Rejected: SA-ARCH-006 is already Arabic — "non-English" is not a hypothetical future market, it already describes this platform's own governing documentation today.
- **Treat data residency and locale as the same decision.** Rejected: residency (where data physically lives) is the Compliance Framework's concern (`B5`, SA-ROADMAP-001 Wave 2), not i18n's. A Tenant's locale and its data-residency requirement are independent dimensions and should not be conflated into one setting.
- **Design a bespoke translation pipeline outside the AI Gateway.** Rejected — repeats the exact "point-to-point integration instead of one governed AI surface" mistake SA-AUDIT-002 §2 warned about; translation is AI Gateway traffic like any other job type.

## Consequences

- Frontend work starting with the next UI milestone must use logical CSS properties, not `left`/`right` — a review-checklist item, not (yet) statically enforced.
- The AI Gateway's prompt-template system (ADR-006/007 territory) must carry a locale parameter from its first implementation, not bolt one on later.
- The OCR Contract and AI Provider Contract (ADR-007) both gain a locale/language dimension that must be part of their first implementation, not a v2 addition.
