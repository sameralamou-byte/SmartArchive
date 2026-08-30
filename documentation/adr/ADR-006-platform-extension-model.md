# ADR-006 — Platform Extension Model

| Field | Value |
|---|---|
| Version | 1.1 |
| Status | **Approved** (2026-07-30, after one focused implementation-consequences review; see [SA-ARCH-999](../SA-ARCH-999_Architecture_Governance.md) §5) |
| Date | 2026-07-30 |
| Related | [SA-ARCH-000](../SA-ARCH-000_Master_Architecture.md) §7, [SA-ARCH-011](../SA-ARCH-011_Capability_Map.md), [SA-ARCH-012](../SA-ARCH-012_Domain_Model.md), [SA-AUDIT-002](../SA-AUDIT-002_Enterprise_Architecture_Audit.md) §17, [SA-ROADMAP-001](../SA-ROADMAP-001_Architecture_Roadmap.md) Wave 0 (`B-EXT`), [ADR-011](ADR-011-device-and-intake-governance.md) (**Approved** — adds the Intake Extension Category) |
| Resolves | The open question SA-ARCH-000 §7 explicitly deferred: how industry editions extend the shared engine, and where the Core-vs-Extension boundary sits |

## Context

SA-AUDIT-002 §17 identified that neither the extension mechanism nor the core-vs-edition boundary was decided, and warned that leaving it undecided risks "gradual core erosion" — industry-specific logic creeping into shared modules one individually-reasonable change at a time. The question was originally scoped narrowly, as "how do Legal/Healthcare/Education/Government editions extend the platform." On review, that scope is too narrow: the exact same question applies to swapping an AI model provider, an OCR engine, a storage backend, or an ERP connector — SmartArchive already answers a version of this question for storage (ADR-003 scoped `storage_service.py` to S3-only operations specifically so providers are swappable) and events (ADR-005's swappable bus). This ADR generalizes that existing pattern into one decision instead of leaving each future "swap X" question to be solved independently.

## Decision

**Decision rule, not a fixed list:** A capability's *orchestration, policy, security, and data model* live in the Core Engine. A *specific third-party implementation of one part of that capability* — a model provider, a connector to one external system, an OCR engine, a storage backend, an identity provider, a voice engine, a notification channel — is an **Extension**, reachable only through that capability's Platform Contract (ADR-007). Industry Editions are a special case of Extension: a bundle of capability-level customizations and configuration (e.g., Legal-specific Classification rules, Healthcare-specific Connectors), never a fork of Core Engine code.

This rule is deliberately a *rule*, not an enumerated list, so it scales to extension types nobody has thought of yet without requiring a new architectural decision each time — matching the same reasoning ADR-003 already used for storage providers specifically, generalized to every capability.

### Core Engine (per [SA-ARCH-011](../SA-ARCH-011_Capability_Map.md) — orchestration/policy layer, never edition-specific)

Identity, Authentication (session/token issuance, the `authorize()` gate), Authorization, Storage (orchestration: versioning, presigned access), OCR (orchestration: job queueing/status), Search (orchestration/ranking), AI (the AI Gateway itself), Voice (session orchestration), Workflow, Notifications (orchestration + the ACE layer per SA-ARCH-000 §5), the Connector Engine (the framework, not any single connector), Reporting, Audit, Monitoring, Administration, Localization (negotiation/translation orchestration — see ADR-008), Compliance (the policy engine), Automation, Knowledge Graph.

### Extensions (pluggable via Platform Contracts — ADR-007)

AI Providers (OpenAI, Azure OpenAI, Anthropic, local models), OCR Providers (Tesseract, cloud vision APIs), Storage Providers (MinIO, AWS S3, Azure Blob, GCS — already de facto extension-shaped per ADR-003), ERP/CRM/Cloud Connectors (SAP, Odoo, Dynamics, Salesforce, SharePoint, Google Workspace), Voice Providers (Whisper, Azure Speech, Google STT/TTS), Notification Channels (email, SMS, push, Slack), Authentication Identity Providers (SSO/SAML/OAuth sources beyond core username/password), **Registered Intake Sources** (Device, Network-Share Agent, Email-Document Gateway, Unattended Terminal-Service, Other — added on synchronization with [ADR-011](ADR-011-device-and-intake-governance.md), Approved), and **Industry Edition Packages** (Legal, Healthcare, Education, Government — bundles of capability-level extensions plus configuration, not separate codebases).

### Extension Categories (governance taxonomy)

Added on review so "what kind of Extension is this" has a fixed, governed answer rather than being re-derived per submission. Every Extension declares exactly one category in its manifest (ADR-007's Extension Envelope); a new category requires an ADR amendment, not an ad hoc addition.

| Category | Examples | Platform Contract (ADR-007) |
|---|---|---|
| Provider | OpenAI, Azure AI, Ollama | AI Provider Contract |
| Connector | SAP, Odoo, SharePoint | Connector Contract |
| Storage | MinIO, S3, Azure Blob | Storage Contract |
| Authentication | Keycloak, Azure AD | Authentication Contract |
| Notification | Email, SMS, WhatsApp | Notification Contract |
| Voice | Whisper, Azure Speech | Voice Contract |
| Workflow | Approval engines, automation rule sets | Workflow Contract |
| Industry Package | Healthcare, Legal, Education, Government | Multiple — an Industry Package is a bundle spanning several contracts plus configuration, not a single-contract implementation |
| **Intake** *(added on synchronization with [ADR-011](ADR-011-device-and-intake-governance.md), Approved)* | **Registered Intake Source**: Device, Network-Share Agent, Email-Document Gateway, Unattended Terminal-Service, Other | Intake Contract |

Per ADR-006's existing decision rule, applied identically to this new category: intake **orchestration/authorization/lifecycle** is Core; a specific registered intake source's implementation is the Extension, reachable only through the Intake Contract (ADR-007). No implementation technology, protocol, or credential mechanism is specified here — that remains ADR-011's own technology-neutral scope and future implementation-level detail.

**Noted for future evolution, not acted on now** (per reviewer feedback at approval): if the category list grows substantially, consider assigning stable category identifiers (e.g. `EXT-STORAGE`, `EXT-AI`, `EXT-CONNECTOR`) to help documentation and tooling reference categories unambiguously. Not necessary at the current scale of 8 categories — revisit if/when this list roughly doubles.

## Alternatives Considered

- **Scope this narrowly to industry editions only**, treating AI/OCR/storage/connector provider-swapping as unrelated, separately-solved concerns. Rejected: this produces N different "how do we swap an implementation" patterns instead of one, repeating — N times over — the exact mistake SA-AUDIT-002 §2 warned about for the AI Gateway specifically (point-to-point integrations instead of one governed surface).
- **Industry editions as forks or separate deployments** of the core. Rejected outright — violates Principle #1 directly, and already ruled out in [SA-ARCH-013](../SA-ARCH-013_Product_Vision_and_Evolution.md) §4 ("not a per-industry fork").
- **A full generic plugin runtime (sandboxing, marketplace) as part of this decision.** Rejected/deferred — that's `B9-runtime` (SA-ROADMAP-001 Wave 3), intentionally sequenced after concrete extension types exist to generalize from, for the same reason ADR-004 deferred ABAC.

## Consequences

- Every future "which provider/connector/engine do we support" question is now an instance of one pattern, not a new design question — implementers ask "is this Core orchestration or an Extension?" using the rule above, not a list that needs maintaining.
- The Core Engine list above is the enforcement mechanism for [SA-ARCH-999](../SA-ARCH-999_Architecture_Governance.md) §4's dependency rule: Core modules never import from or special-case an Extension; the reverse is expected.
- **Done as part of this ADR's Approval** (per SA-ARCH-999's process): [SA-ARCH-011](../SA-ARCH-011_Capability_Map.md) v1.1 now notes, per capability row, whether it's wholly Core, wholly Extension, or split (Core orchestration + swappable Extension implementation).
- This ADR does not itself specify the extension interface shape — that's ADR-007, which also contains the **Platform Dependency Diagram** (added on review) showing the full Applications → API → Core Engine → Contracts → Extensions → Providers flow this ADR and ADR-007 jointly establish.

## Revision History

| Rev | Change |
|---|---|
| 1.0 | Initial Approval (2026-07-30), after one focused implementation-consequences review — added Extension Categories (8 categories) and the "noted for future evolution" note on category identifiers. |
| 1.1 | Synchronization update following the Founder-approved [ADR-011](ADR-011-device-and-intake-governance.md) (Device & Intake Governance) — per [SA-ARCH-999](../SA-ARCH-999_Architecture_Governance.md)'s process, this records ADR-011's already-made decision, it does not introduce a new one. Added a 9th Extension Category, **Intake** (Registered Intake Source: Device / Network-Share Agent / Email-Document Gateway / Unattended Terminal-Service / Other), with its Platform Contract named as the Intake Contract (formalized in ADR-007). Added Registered Intake Sources to the Extensions list. No change to the Core-vs-Extension decision rule itself, the Core Engine list, or any other category. |
