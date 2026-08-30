# ADR-013 — Integrated, Standalone, and Hybrid ESA as Configurations of One Platform

| Field | Value |
|---|---|
| Document ID | ADR-013 |
| Title | Integrated, Standalone, and Hybrid ESA as Configurations of One Platform |
| Version | 1.2 |
| Status | **Approved** (Founder Approval, round 1 review of Rev 1.1 — content unchanged from Rev 1.1; not yet Locked per `SA-ARCH-999` §2, which requires surviving a subsequent review cycle first) |
| Date | 2026-08-29 |
| Owner | Architecture team — SmartArchive AI Platform |
| Classification | Internal |
| Related | [SA-ARCH-000](../SA-ARCH-000_Master_Architecture.md) §4 (Locked — the document this amends), [SA-ARCH-013](../SA-ARCH-013_Product_Vision_and_Evolution.md) §5, [ADR-002](ADR-002-multi-tenancy.md) (Locked), [ADR-010](ADR-010-esa-organizational-hierarchy-and-boundary-model.md) (**Approved**, Rev 1.2), [ADR-011](ADR-011-device-and-intake-governance.md) (**Approved**, Rev 1.2), [ADR-012](ADR-012-ai-permission-inheritance.md) (**Approved**, Rev 1.2) |
| Resolves | The Integrated/Standalone wording conflict named in the ESA Core Architecture Reconciliation Audit (2026-08-29), and the previously unaddressed Hybrid mode |
| Part of package | ESA Architecture Draft Package, 2026-08-29 |

## 1. Status

**Approved.** Founder Approval recorded 2026-08-29 (round 1 review of Rev 1.1, content unchanged — see Revision History). The central decision — Integrated, Standalone, and Hybrid are configurations of one ESA platform, Integrated and Standalone are equal first-class modes, Standalone requires no ERP/CRM prerequisite — and all reviewed areas (§3.1–§3.6, the mode-transition invariant, Intake and AI-security applicability across all modes, and the proposed `SA-ARCH-000` §4 wording) are Founder-approved. Not yet Locked per `SA-ARCH-999` §2 (Locked status requires surviving a subsequent review cycle beyond first Approval).

**Synchronization not yet authorized.** This ADR does not itself edit `SA-ARCH-000`. With this approval, all four ADRs in the ESA Architecture Draft Package (ADR-010, ADR-011, ADR-012, ADR-013) are now Founder-approved; the coordinated synchronization pass to Locked documents (`SA-ARCH-000` §2/§4, `SA-ARCH-011`, `SA-TRACE-001`, and the ADR-007 cross-references named in ADR-011/ADR-012) remains explicitly parked pending a separate Founder instruction to proceed. No implementation of any kind is authorized by this document.

## 2. Context / Problem

`SA-ARCH-000` §4 (Locked) currently reads: *"Per SA-ARCH-006: **Integration-first, standalone as a designed fallback, not the reverse.**"* This wording subordinates Standalone Mode to Integrated Mode.

The Founder has decided both modes are equal first-class operating modes for ESA — Standalone is not a fallback, and ERP/CRM is never a prerequisite. This is a genuine wording conflict between a Locked document and current direction (identified in the 2026-08-29 audit), not merely an undocumented gap.

**Round 1 Founder review (this revision responds to it):** the central decision is approved unchanged. Rev 1.0 under-specified two things: it defined the difference between modes as narrowly as "Connectors active or not," and it did not address Hybrid at all despite `organizations.deployment_mode` already including it as a schema value. Both are corrected below, along with a mode-transition invariant Rev 1.0 also lacked.

## 3. Decision

### 3.1 One platform, three operating configurations — not a Connectors on/off switch

**Revised from Rev 1.0.** Integrated, Standalone, and Hybrid are operating **configurations** of the same ESA platform architecture and capability foundation — not three products, and not distinguished by a single on/off flag. They may differ in configuration such as:

- whether external-system Connectors are active;
- which systems are treated as external systems of record;
- mapping/synchronization configuration;
- integration governance;
- data-flow configuration;
- other future integration-specific settings.

This ADR does not invent specific integrations or synchronization mechanics — those are future `B3` design work.

**Permanent invariant: operating mode must not create a second ESA architecture.** All three configurations share, identically: Tenant isolation (ADR-002), the organizational hierarchy ([ADR-010](ADR-010-esa-organizational-hierarchy-and-boundary-model.md)), authorization (ADR-004), Intake governance ([ADR-011](ADR-011-device-and-intake-governance.md)), AI Permission Inheritance ([ADR-012](ADR-012-ai-permission-inheritance.md)), document intelligence, and audit/security principles. No mode carries its own parallel version of any of these.

`organizations.deployment_mode` (`integrated | standalone | hybrid`) remains the existing schema field, unchanged in shape — understood as a configuration selector across one architecture, not a product selector.

### 3.2 Hybrid Mode

**New in this revision.** Hybrid is explicitly acknowledged, not left implicit merely because the schema value already exists. Hybrid is **not** a third separate product architecture. Conceptually:

- **Standalone** — ESA can operate without requiring external ERP/CRM/business systems.
- **Integrated** — ESA works alongside relevant existing external systems.
- **Hybrid** — some organizational capabilities/areas may rely on external systems while other areas operate directly within ESA, within one Tenant.

This ADR deliberately does not over-design Hybrid's behavior (which areas can independently be Standalone vs. Integrated, how conflicts between them are resolved) — that is future `B3`/integration design work. The invariant decided here:

**Standalone + Integrated + Hybrid = one ESA platform with different configuration, not three products.**

### 3.3 Mode evolution / transition

**New in this revision, correcting Rev 1.0's §12.** No schema migration is required by this ADR — `deployment_mode` already supports all three values. What this ADR establishes is an architectural requirement: an organization may evolve between operating configurations (Standalone → Integrated, Standalone → Hybrid, Hybrid → Integrated, and, where operationally valid, Integrated → Hybrid or Integrated → Standalone) **without becoming a different SmartArchive product or requiring replacement of its Tenant identity.**

**Permanent principle: adding an ERP/CRM later must not require rebuilding the customer's SmartArchive organization from zero.** The customer's existing Tenant identity, organizational structure ([ADR-010](ADR-010-esa-organizational-hierarchy-and-boundary-model.md)), permission boundaries, documents, and governed metadata/context must remain governed through a mode transition according to future migration/integration rules.

This ADR does **not** promise automatic lossless migration before that implementation exists. Exact connector disengagement, synchronization, ownership, and data-reconciliation mechanics remain future `B3`/integration design work.

### 3.4 Intake applies identically in all modes

**New in this revision, incorporating the now-Approved [ADR-011](ADR-011-device-and-intake-governance.md).** Intake Contract capability is independent of whether a Tenant operates Standalone, Integrated, or Hybrid. A Standalone organization may use network scanners; an Integrated organization may use network scanners *and* ERP/CRM Connectors; a Hybrid organization may use both, according to configuration. **Intake must not be treated as something available only because ERP/CRM integration exists.**

### 3.5 AI security applies identically in all modes

**Strengthened in this revision.** [ADR-012](ADR-012-ai-permission-inheritance.md) applies identically across Standalone, Integrated, and Hybrid modes. Integration with an external system must never create an AI authorization bypass. A document's external origin does not weaken: Tenant isolation, organizational boundaries, Restricted Area rules, requesting-identity authorization, or derived-artifact security — all of ADR-012's invariants apply to an Integrated- or Hybrid-mode document exactly as they apply to a Standalone-mode document.

### 3.6 Proposed replacement wording for `SA-ARCH-000` §4 (for Founder approval, not applied by this ADR)

> Per ADR-013: **Standalone, Integrated, and Hybrid are supported operating configurations of the same ESA platform architecture.** Standalone and Integrated are equal first-class modes; neither is a fallback for the other. Standalone ESA provides the organizational document-intelligence environment without requiring an external ERP/CRM/business system. Integrated ESA adds governed connections to relevant existing systems while preserving SmartArchive's own security, organizational, document-intelligence, and intake foundations. Hybrid configuration allows these approaches to coexist where appropriate within one Tenant. Operating mode is explicit per Tenant and does not create a separate ESA product architecture.

## 4. Scope

Wording/positioning amendment to `SA-ARCH-000` §4, via the required ADR path, plus an architectural clarification of the mode-transition and Hybrid-mode invariants. No change to `organizations.deployment_mode`'s values, schema, or any code. No Connector, Hybrid-behavior, or migration implementation is authorized.

## 5. Domain Model implications

None to `SA-ARCH-012` — Tenant and `deployment_mode` (already including `hybrid`) model this correctly as-is. Only the prose framing in `SA-ARCH-000` changes, plus this ADR's own explicit statement that Hybrid is a first-class configuration rather than an implicit/unaddressed third value.

## 6. Security implications

None beyond what ADR-010/ADR-004/ADR-011/ADR-012 already establish. This ADR exists in part so "Standalone" is never read as license for a lighter security posture, and so that "Integrated" or "Hybrid" — a document's external origin — is never read as license to weaken Tenant isolation, organizational boundaries, Restricted Area rules, or AI-context authorization (§3.5). All three configurations get identical authorization, intake, and AI-security guarantees.

## 7. Authorization implications

None beyond confirming all three configurations use `authorize()` identically (ADR-004), the same organizational hierarchy (ADR-010), and the same AI-permission sequence (ADR-012). No Standalone-, Integrated-, or Hybrid-specific carve-out exists or is created.

## 8. Data-model implications

None — `deployment_mode` enum values (`integrated | standalone | hybrid`) are unchanged; all three already exist in schema.

## 9. API implications

None designed here.

## 10. AI implications

[ADR-012](ADR-012-ai-permission-inheritance.md) applies identically regardless of deployment mode, per §3.5 — an external system being the source of a document does not weaken any AI Permission Inheritance invariant.

## 11. Integration implications

In Integrated mode, Connectors (future `B3`) are active and SmartArchive augments existing ERP/CRM/HR/Finance/Procurement/Maintenance/Project systems as an intelligence layer. In Standalone mode, no Connector is required or assumed; SmartArchive's own document/metadata/hierarchy model ([ADR-010](ADR-010-esa-organizational-hierarchy-and-boundary-model.md)) is the complete organizational record. In Hybrid mode, both approaches coexist within one Tenant per §3.2. Intake ([ADR-011](ADR-011-device-and-intake-governance.md)) is available identically in all three, per §3.4. All three are complete, equally first-class operating configurations of one platform.

## 12. Migration / backward-compatibility implications

**Revised from Rev 1.0.** No current schema migration is required by this ADR — `deployment_mode` already supports all three values. This ADR instead establishes the architectural requirement, per §3.3, that an organization may evolve between Standalone, Integrated, and Hybrid without becoming a different product or losing its Tenant identity, organizational structure, permission boundaries, documents, or governed metadata/context. Exact transition mechanics (connector disengagement, synchronization, ownership, data reconciliation) remain future `B3`/integration design work; this ADR does not promise automatic lossless migration ahead of that design.

## 13. Alternatives considered / rejected

- **Leave `SA-ARCH-000` §4 wording unchanged; treat "equal footing" as informal product framing only** — rejected: defeats the purpose of `SA-ARCH-999`'s governance, where the Locked document is supposed to be the actual authority. Letting product language silently diverge from the Locked text is exactly the doc/doc drift `SA-ARCH-999` exists to prevent.
- **Make Standalone the new stated default (over-correcting the other direction)** — rejected: the Founder's direction is equal footing, not a reversal of which mode is more common. This ADR deliberately names neither mode as "the default."
- **Define the difference between modes solely as "Connectors active or not"** — rejected on Founder review (§3.1): too narrow; risks implying the three modes are otherwise architecturally identical by coincidence rather than by design, and omits the other configuration dimensions (systems-of-record, mapping/sync, integration governance, data-flow configuration).
- **Leave Hybrid unaddressed since it wasn't the audit's original focus** — rejected on Founder review (§3.2): `deployment_mode` already includes `hybrid` in schema; a platform ADR naming Standalone and Integrated as equal while staying silent on the third existing schema value would itself be a gap of the kind this package exists to close.
- **Design Hybrid's exact per-area behavior now** — rejected: premature; only the "one platform, not three products" invariant is decided here, the mechanics are future `B3` design work.
- **Promise automatic lossless migration between modes in this ADR** — rejected on Founder review (§3.3): no such implementation exists yet; promising it here would be exactly the kind of over-commitment this package's sibling ADRs (e.g., ADR-012 §18) have consistently avoided.
- **Propagate the equal-modes wording into HSA for consistency** — rejected on Founder review (§7 of the review): this ADR is specifically an ESA operating-model decision; HSA remains governed by its existing product architecture/positioning unless a future HSA-specific decision changes it. HSA documentation is not touched by this ADR.

## 14. Dependencies

- `SA-ARCH-000` — the document amended (§4, and §2 Principles #5/#6).
- `SA-ARCH-013` §5 — already closer to this framing, no change needed there.
- [ADR-002](ADR-002-multi-tenancy.md) — Tenant/RLS, unaffected, applies identically in all three modes.
- [ADR-010](ADR-010-esa-organizational-hierarchy-and-boundary-model.md) — **Approved, Rev 1.2** — organizational hierarchy shared identically across modes.
- [ADR-011](ADR-011-device-and-intake-governance.md) — **Approved, Rev 1.2** — Intake governance shared identically across modes (§3.4).
- [ADR-012](ADR-012-ai-permission-inheritance.md) — **Approved, Rev 1.2** — AI Permission Inheritance shared identically across modes (§3.5).

## 15. Relationship to existing ADRs

Amends `SA-ARCH-000` §4 wording (and clarifies §2 Principles #5/#6). Does not touch ADR-002, ADR-010, ADR-011, or ADR-012 themselves — this ADR states that their guarantees apply identically across all three deployment configurations, without modifying any of those documents.

## 16. Documents requiring synchronization AFTER approval

- `SA-ARCH-000` §2 (Principles #5/#6 restated without the "default"/"fallback" asymmetry, and reflecting all three configurations) and §4 (Deployment Model rewritten per the proposed wording in §3.6) — via the same synchronization-edit pattern already used for ADR-006/007/008 (§7/§8 marked resolved, citing the resolving ADR).
- `SA-TRACE-001` Section A, rows #5/#6 (governing-document citation updated to include this ADR).

## 17. Implementation prerequisites

None — this ADR authorizes no implementation (no Connectors, no Hybrid behavior, no migration tooling). It is a documentation-wording and architectural-clarification correction with real product-positioning weight, not a code change.

## 18. Risks

Low technically. The main risk if left undone is internal-consistency/credibility: a Founder-facing product statement ("equal first-class modes," "one platform, not three products") contradicted by the Locked architecture document beneath it, or silent about a schema value (Hybrid) that already exists, is the same class of doc/doc drift `SA-AUDIT-002` flags elsewhere as a credibility risk. A secondary risk this revision specifically guards against: defining modes narrowly by one configuration flag could later be read as implying the modes are allowed to diverge architecturally — §3.1's invariant forecloses that reading now, while the mechanics remain undesigned.

## 19. Open questions

None substantive. The HSA-propagation question from Rev 1.0 §20.3 is resolved by Founder decision (§7 of the round 1 review): ADR-013 is ESA-specific; HSA is not touched and is not addressed by this ADR.

## 20. Founder decision points

1. Approve the broadened operating-mode model (§3.1): configurations of one platform, not solely a Connectors on/off distinction, with "operating mode must not create a second ESA architecture" as the governing invariant.
2. Approve the explicit Hybrid Mode definition (§3.2) and the "one platform, not three products" invariant, without designing Hybrid's per-area mechanics now.
3. Approve the mode-transition invariant (§3.3) — an organization may evolve between configurations without losing its Tenant identity, structure, or governed data — without promising automatic lossless migration ahead of `B3` design.
4. Approve Intake applying identically across all three modes (§3.4).
5. Approve AI Permission Inheritance applying identically across all three modes, with external origin never weakening any ADR-012 invariant (§3.5).
6. Approve the exact revised replacement wording proposed in §3.6 for `SA-ARCH-000` §4 (or amend it before Approval).
7. Confirm this ADR's equal-modes decision remains ESA-specific and is not propagated to HSA (resolved per §19 — recorded here for the approval record).

## Revision History

| Rev | Change |
|---|---|
| 1.0 | Initial Draft, prepared as part of the ESA Architecture Draft Package following the Founder-approved ESA Core Architecture Reconciliation Audit (2026-08-29). |
| 1.1 | Founder review round 1 (verdict: MODIFY) incorporated. Central decision (Integrated/Standalone equal, ERP/CRM never a prerequisite) unchanged. Broadened §3.1 from "differ only in Connectors on/off" to "configurations of one platform," listing additional configuration dimensions and adding the "operating mode must not create a second ESA architecture" invariant. Added §3.2, explicit Hybrid Mode definition and the "one platform, not three products" invariant, without designing Hybrid mechanics. Rewrote §12/added §3.3, a mode-transition invariant (Tenant identity/structure/data preserved across mode changes) without promising automatic lossless migration. Added §3.4, Intake ([ADR-011](ADR-011-device-and-intake-governance.md)) applying identically across all modes. Strengthened §3.5, AI security ([ADR-012](ADR-012-ai-permission-inheritance.md)) applying identically across all modes with an explicit "external origin never weakens security" statement. Revised the proposed `SA-ARCH-000` §4 wording (§3.6) to cover all three configurations without implying three architectures. Removed the HSA-propagation open question per Founder decision — resolved as ESA-specific, HSA untouched. Sections 4–20 updated throughout for consistency. Status remains Draft. |
| 1.2 | Founder review round 1 verdict: **APPROVED**. All reviewed areas of Rev 1.1 (broadened operating-mode model, Hybrid Mode definition, mode-transition invariant, Intake applicability, AI-security applicability, proposed `SA-ARCH-000` §4 wording, ESA-specific scope resolved against HSA) approved without further change. No content rewrite — status transition only: Status field changed to Approved (not yet Locked per `SA-ARCH-999` §2), §1 rewritten to state the approval and to note that with this approval all four ADRs of the ESA Architecture Draft Package (ADR-010–013) are now Founder-approved, with Locked-document synchronization remaining explicitly parked pending a separate Founder instruction. |
