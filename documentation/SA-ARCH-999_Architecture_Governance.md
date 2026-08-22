# SA-ARCH-999 — Architecture Governance

| Field | Value |
|---|---|
| Document ID | SA-ARCH-999 |
| Version | 1.0 |
| Owner | Architecture team — SmartArchive AI Platform |
| Status | **Locked** — constitutional document of Architecture Baseline v1.0 (promoted from Approved on second review, per §2 below) |
| Dependencies | [SA-ARCH-000](SA-ARCH-000_Master_Architecture.md) v1.0 |
| Purpose | The "constitution" — the rules by which every other architecture document, ADR, and module in SmartArchive is written, named, owned, and retired. This document governs *process*; [SA-ARCH-000](SA-ARCH-000_Master_Architecture.md) governs *content* (what the architecture actually is). |

## Architecture Baseline v1.0 — Frozen

| Field | Value |
|---|---|
| Baseline | Architecture Baseline v1.0 |
| Status | **APPROVED and LOCKED** |
| Date approved | 2026-07-30 |
| Date locked | 2026-07-30 (second review, same session) |
| Constitutional documents (Locked) | [SA-ARCH-000](SA-ARCH-000_Master_Architecture.md), [SA-ARCH-001](SA-ARCH-001.md), SA-ARCH-999 (this document), [SA-ARCH-011](SA-ARCH-011_Capability_Map.md), [SA-ARCH-012](SA-ARCH-012_Domain_Model.md), [SA-TRACE-001](SA-TRACE-001_Architecture_Traceability_Matrix.md), `ADR-001` through `ADR-005` |
| Approved (not yet Locked) | [SA-ARCH-013](SA-ARCH-013_Product_Vision_and_Evolution.md) (new — first review pending), [SA-AUDIT-002](SA-AUDIT-002_Enterprise_Architecture_Audit.md) Rev 1 and [SA-ROADMAP-001](SA-ROADMAP-001_Architecture_Roadmap.md) Rev 1 (these version as `Rev N`, not `Locked`, per §6 — they're periodically re-run assessments, not standing decisions) |

**From this point forward, no direct architecture edits.** Every architecture change — to any document above, to any `ADR-*`, or to any decision that would change a row in [SA-TRACE-001](SA-TRACE-001_Architecture_Traceability_Matrix.md) — follows one path and no other:

```
New ADR (Draft) → Review → Approval → Implementation
```

Silently editing a `Locked` or `Approved` document to reflect a new decision is itself a governance violation, even if the edit is correct — the point of freezing the baseline is that changes are visible and reviewed, not that the content never changes. A correction to a factual error (a stale file path, a broken link) is not an architecture change and doesn't need this process; a change to what the architecture *decides* does.

**On `Approved` vs. `Locked`:** SA-ARCH-000, SA-ARCH-011, SA-ARCH-012, SA-ARCH-999, and SA-TRACE-001 were issued `Approved` on first review, then genuinely re-reviewed (this is not a rubber stamp — that second pass added the Classification column to the Maturity Matrix, SA-ARCH-012 itself, SA-ARCH-013, and this section's own rewrite) and left substantively intact, which is what earns `Locked` per §2. This locking pass and the addition of SA-ARCH-013 are the last edits made *before* the freeze takes full effect — from here on, the process above is the only path for change, including to these just-locked documents.

## 1. Document Types

| Prefix | Purpose | Example |
|---|---|---|
| `SA-ARCH-NNN` | A locked architecture decision, the master architecture itself, or (as with `SA-ARCH-013`) a foundational product-vision document that governs the technical documents rather than being one itself | `SA-ARCH-000`, `SA-ARCH-001`, `SA-ARCH-013` |
| `ADR-NNN` | A single architecture decision record: one decision, alternatives considered, consequences | `ADR-001` through `ADR-005` |
| `SA-AUDIT-NNN` | A point-in-time review of the codebase/docs against the current architecture — not itself a decision | `SA-AUDIT-002` |
| `SA-REVIEW-NNN` | A narrower-scope review (e.g., principles-only) | `SA-REVIEW-001` |
| `SA-ROADMAP-NNN` | A sequencing/dependency document translating audit findings into an execution order | `SA-ROADMAP-001` |
| `SA-TRACE-NNN` | A traceability matrix mapping principles/documents/ADRs/capabilities/code/tests/CI to each other — a cross-reference artifact, not a decision itself | `SA-TRACE-001` |
| `SA-ARCH-999` | Reserved permanently for this governance document — never reused | — |

Numbering is sequential per prefix and never reused, even for a superseded or deprecated document — see §5 (Deprecation Policy).

## 2. Document Lifecycle & Stability Labels

Every `SA-ARCH-*` document and every `ADR-*` carries exactly one of these labels in its `Status` field. `SA-AUDIT-*`, `SA-REVIEW-*`, and `SA-ROADMAP-*` documents use their own revision/status conventions instead (see §6) since they describe a point-in-time assessment, not a standing decision.

| Label | Meaning | Who can move a document into this state |
|---|---|---|
| **Experimental** | A decision being tried in code before it's written up formally; may be abandoned without ceremony | Any engineer, no review required |
| **Draft** | A written proposal, not yet reviewed or acted on as authoritative | Author |
| **Approved** | Reviewed and accepted as current guidance; may still be revised without a formal deprecation | Architecture reviewer (currently: the user) |
| **Locked** | Foundational — not open for casual redesign. Changing a Locked document requires a new ADR that explicitly supersedes it, not a silent edit | Architecture reviewer, and only after the decision has held up under at least one real review cycle |
| **Deprecated** | Still in effect but scheduled for replacement; new code should not depend on it further | Architecture reviewer |
| **Replaced** | No longer in effect; kept in the repo for history, with a pointer to what replaced it | Architecture reviewer, at the same time the replacement is marked Approved/Locked |

**Rule:** nothing goes straight to `Locked`. A decision earns `Locked` status by surviving an actual review (like the ones producing this document), not by an author's own declaration. This is why [SA-ARCH-000](SA-ARCH-000_Master_Architecture.md), `SA-ARCH-999` (this document), and `SA-ARCH-011` are all issued as **Draft** — they become `Approved` when the user reviews them, and `Locked` only after that.

**Retroactive application (Rev 1 finding):** ADR-001 through ADR-005 previously used `Accepted`, a label from before this lifecycle existed. They are being relabeled `Locked` as part of adopting this governance document, since all five describe decisions already implemented in running code and treated as non-negotiable by [SA-ARCH-001](SA-ARCH-001.md) (itself already `Locked`). `SA-ARCH-006`'s own Arabic status (`معتمد` / "Approved") maps directly to this taxonomy's `Approved` and needs no relabeling.

## 3. Naming Conventions

- Document filenames: `<ID>_<Short_Title_In_Title_Case>.md` (or `.docx` where the source is binary). The ID must match the `Document ID` field inside the file exactly.
- Section references in prose use `§N` for numbered sections within the same document, and `DocumentID §N` (e.g., `SA-AUDIT-002 §7`) across documents.
- Code-level naming (module layout, Python/TS conventions) is governed by the relevant ADR, not by this document — e.g., the `routers/services/repositories/models/schemas/security/events/tasks/tests` module layout is `SA-ARCH-001 §7`'s concern, not this one's.

## 4. Layer Responsibilities & Module Ownership

Until [SA-ARCH-011](SA-ARCH-011_Capability_Map.md) (Capability Map) has real per-capability owners assigned, ownership is tracked at the architecture-document level:

| Layer | Governing document(s) | Notes |
|---|---|---|
| Core data/tenancy/auth | ADR-001, ADR-002, ADR-004, [SA-ARCH-001](SA-ARCH-001.md) | Locked |
| Storage | ADR-003 | Locked |
| Eventing | ADR-005 | Locked; coupled to the Wave 3 HA decision — see [SA-ROADMAP-001](SA-ROADMAP-001_Architecture_Roadmap.md) |
| Extension model (plugins, industry editions) | Wave 0 of [SA-ROADMAP-001](SA-ROADMAP-001_Architecture_Roadmap.md) (`B-EXT`, `B9-iface`) | Not yet written — highest-priority open ADR |
| AI / connectors / voice / vector search | Wave 1/3 of [SA-ROADMAP-001](SA-ROADMAP-001_Architecture_Roadmap.md) | Not yet written |
| Capability ownership (per-feature) | [SA-ARCH-011](SA-ARCH-011_Capability_Map.md) | Owner field currently unassigned pending a team to assign it to |

**Dependency rule:** a module in the shared core (per [SA-ARCH-000](SA-ARCH-000_Master_Architecture.md)'s core-vs-edition boundary, itself pending the `B-EXT` ADR) may never import from or special-case an industry-edition module. The reverse (an edition depending on core capabilities) is expected and fine. This rule exists specifically to prevent the "gradual core erosion" failure mode identified in `SA-AUDIT-002 §17`.

## 5. Review Process

1. A new architecture question is first captured as an entry in the relevant Track B wave of [SA-ROADMAP-001](SA-ROADMAP-001_Architecture_Roadmap.md) (or a new wave item, if none of the existing ones fit).
2. A `Draft` ADR or `SA-ARCH-*` document is written addressing it, including alternatives considered and rejected (matching the standard already set by ADR-001 through ADR-005 — this is not new practice, just now written down as a requirement).
3. The user reviews it. Outcomes: `Approved` (accepted, may still evolve), sent back for revision, or rejected outright (kept as a record with status `Replaced` pointing to whatever alternative was chosen instead, if any).
4. A document only reaches `Locked` after it has been `Approved` and held up through at least one subsequent review cycle without being overturned (this document and [SA-AUDIT-002](SA-AUDIT-002_Enterprise_Architecture_Audit.md)/[SA-ROADMAP-001](SA-ROADMAP-001_Architecture_Roadmap.md) themselves are the first real instance of that cycle).

## 6. Versioning & Revision History

- `SA-ARCH-*` and `ADR-*` documents version as `Major.Minor` (e.g., `v1.0`). A **Minor** bump is a clarification or reference fix (exactly what happened to `SA-ARCH-006` in this revision — its dependency citation was corrected without changing its substantive content, so it was not re-versioned; only genuinely substantive changes warrant a version bump). A **Major** bump means the decision itself changed, and the document should move toward `Deprecated`/`Replaced` rather than being silently overwritten.
- `SA-AUDIT-*`, `SA-REVIEW-*`, and `SA-ROADMAP-*` documents version as `Rev N` (integer, no minor version) since they're point-in-time assessments re-run periodically, not standing decisions — each revision keeps a Revision History table at the top recording what changed and why (the pattern already established in `SA-AUDIT-002` Rev 1 and `SA-ROADMAP-001` Rev 1).
- Every document's Revision History table is permanent — entries are never deleted, only appended to, even across Major version bumps.

## 7. Deprecation Policy

- A document moves to `Deprecated` the moment its replacement is drafted, not the moment the replacement is finished — this gives implementers visible warning during the transition rather than a surprise cutover.
- A document moves to `Replaced` only once its replacement reaches `Approved` or `Locked`, at which point the deprecated document gets one final edit: a pointer at the top to what replaced it. Its content otherwise stays untouched as a historical record.
- Numbering is never reused (§1) specifically so a citation to `ADR-003` always means the same document, even years later, whether it's current or long since `Replaced`.

## 8. Relationship to the Other Cornerstone Documents

This document (`SA-ARCH-999`) is one of seven documents that jointly form Architecture Baseline v1.0 (see declaration above) and govern all future SmartArchive work:

0. **[SA-ARCH-013](SA-ARCH-013_Product_Vision_and_Evolution.md)** (Product Vision & Evolution) — the "North Star": *why* SmartArchive exists and what it's for, deliberately upstream of and independent from the technical documents below. Every other document ultimately serves this one, not the reverse.
1. **[SA-ARCH-000](SA-ARCH-000_Master_Architecture.md)** — the master architecture: what SmartArchive *is*, technically (principles, decisions, deployment model).
2. **`SA-ARCH-999`** (this document) — how architecture decisions are *made, named, owned, and retired*.
3. **[SA-AUDIT-002](SA-AUDIT-002_Enterprise_Architecture_Audit.md)** — the current state of the codebase against #1, as of the last review.
4. **[SA-ROADMAP-001](SA-ROADMAP-001_Architecture_Roadmap.md)** — the dependency-ordered plan for closing the gaps #3 found.
5. **[SA-ARCH-011](SA-ARCH-011_Capability_Map.md)** (Capability Map) — what capabilities exist and who owns them. Every future ADR should reference a capability from this map rather than a file path, per §4.
6. **[SA-ARCH-012](SA-ARCH-012_Domain_Model.md)** (Domain Model) — the shared business-domain language (Tenant, Document, Workflow, etc.) that #5's capabilities operate on.

**[SA-TRACE-001](SA-TRACE-001_Architecture_Traceability_Matrix.md)** sits alongside the baseline as a derived artifact rather than an eighth cornerstone: it maps #1's principles through #2-6 down to actual repository modules, tests, and CI/CD — it should be regenerated/reviewed whenever any cornerstone document changes, rather than maintained as an independent source of truth.

## 9. Feature Proposal Requirement

**Every new feature proposal must explicitly identify which capability (per [SA-ARCH-011](SA-ARCH-011_Capability_Map.md)) it belongs to, and which architecture documents and ADRs govern it, before implementation begins.** If a proposal doesn't fit any existing capability, that's resolved by extending the Capability Map first (§4/§8 above), not by building the feature as an unowned one-off. This is what prevents features from becoming isolated functionality with no architectural accountability — and it's the same discipline [SA-TRACE-001](SA-TRACE-001_Architecture_Traceability_Matrix.md) depends on to stay accurate: a feature that skipped this step has nothing for that matrix to trace.
