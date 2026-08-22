# ADR-009 — Account, Tenant, and Family Entitlement Separation

| Field | Value |
|---|---|
| Document ID | ADR-009 |
| Title | Account, Tenant, and Family Entitlement Separation |
| Version | 1.1 |
| Status | **Approved** (2026-08-16, Founder alignment after Wave B) |
| Date | 2026-08-16 |
| Owner | Architecture team — SmartArchive AI Platform |
| Classification | Internal |
| Related | ADR-002 (not superseded), ADR-004 (not superseded), [SA-ARCH-014](../Architecture/SA-ARCH-014_Account_Family_and_Entitlement_Architecture/SA-ARCH-014-00-README.md), [SA-ARCH-011](../SA-ARCH-011_Capability_Map.md), [SA-ARCH-012](../SA-ARCH-012_Domain_Model.md), [SA-ARCH-001](../SA-ARCH-001.md), [SA-ARCH-999](../SA-ARCH-999_Architecture_Governance.md) |
| Resolves | Founder-approved split between durable customer identity, data isolation, and Family billing/entitlement |

## Context

SmartArchive today treats `Organization` as both the **data-isolation unit** (ADR-002: shared schema + PostgreSQL RLS on `organization_id`) and the practical **customer unit**. Registration creates a new Organization and a first User with `is_superuser=True`. Email uniqueness is per Organization, not global. There is no durable Account, no TrialHistory, no Family membership, and no Entitlement Service.

The Founder has approved a product architecture that these facts cannot express without collapsing distinct jobs into one tenant:

```text
Account
    ↓
Personal Tenant
    ↓
Family Membership / Entitlement
```

Locked ADR-002 must remain the isolation rule. Locked ADR-004 must remain the authorization gate. This ADR records the new relationship **beside** those decisions. It does not rewrite them.

Wave B additively amended [SA-ARCH-011](../SA-ARCH-011_Capability_Map.md), [SA-ARCH-012](../SA-ARCH-012_Domain_Model.md), [SA-TRACE-001](../SA-TRACE-001_Architecture_Traceability_Matrix.md), and a minimal clarification in [SA-ARCH-013](../SA-ARCH-013_Product_Vision_and_Evolution.md). ADR-002 and ADR-004 were not edited.

This ADR authorizes **documentation of the architecture**. It does **not** authorize implementation, migrations, APIs, UI, or changes to running code. Wave C is not authorized.

## Decision

1. **Account** is the durable customer identity. Trial eligibility, subscription history, and Family membership attach to the Account, not to an Organization/Tenant.
2. **Tenant** remains the document and data-isolation boundary. ADR-002 remains authoritative: shared schema, `organization_id` on tenant-owned tables, PostgreSQL RLS. In product terms, each person has one **private personal Tenant** (personal SmartArchive archive).
3. **Family** is an entitlement and billing group. Family is **not** a Tenant. Family is **not** an Organization. Family must **not** become a shared document archive. Members retain separate Accounts and separate private Tenants.
4. **ESA organizations** remain collaboration Tenants and are distinct from Family. An ESA org-invite is not a Family invitation.
5. **Family Owner** may manage membership, invitations, seats, billing, and entitlement information. The Owner must **not** automatically access member documents, document history, AI analysis, or private archives. Family Owner must **not** be modeled as Organization superuser over member Tenants.
6. **Entitlement** is a separate architectural concern from authorization. A future server-side Entitlement Service determines *what the Account may use* (Individual vs Family, seats, trial vs paid). [ADR-004](ADR-004-authorization.md) `authorize()` remains the only permission gate for *what the User may do inside a Tenant*. Subscription tiers must **not** become RBAC roles. Entitlement must **not** be implemented as UI-only logic.
7. **Trial eligibility is Account-scoped.** One introductory trial belongs to the Account. Creating another Tenant/Organization must not mint another introductory trial. Joining a Family must not automatically grant another introductory trial. There is no separate Family trial SKU in v1. v1 primary controls are verified identity/email plus TrialHistory. Payment instrument is **not** the v1 identity mechanism.
8. **No automatic permanent account ban or termination in v1**, regardless of whether the signal is IP, device, seat churn, or another signal. Risk signals may trigger verification, review, or protection only (`verify → review → protect`). They are not identity and not guilt.
9. HSA-08 A+C remains frozen and is out of scope for this decision.

## Alternatives rejected

- **Model Family as one shared Organization / Tenant.** Rejected: ADR-002 RLS would share documents and AI jobs across members; Owner-as-first-user-superuser would worsen leakage. Contradicts Founder privacy rules.
- **Keep Organization as the customer identity and attach trials to each new org.** Rejected: email-per-org registration already allows unbounded implicit trials.
- **Treat Family Owner as `is_superuser` on member Tenants.** Rejected: superuser bypasses `authorize()` (ADR-004) and would expose member archives.
- **Encode subscription tiers as RBAC roles.** Rejected: roles are tenant-scoped permissions (ADR-004); entitlement is a cross-tenant commercial concern.
- **Bind v1 trial identity to payment instrument, GPS, or device fingerprint.** Rejected for v1: disproportionate, and not Founder-approved as the primary control.
- **Silent edit of ADR-002, ADR-004, SA-ARCH-011, or SA-ARCH-012.** Rejected: SA-ARCH-999 requires a new ADR, not a silent rewrite.
- **Copy billing/seat models from `zip one packege/` (AI-COS).** Rejected: out of scope and not SmartArchive authority.

## Consequences

- Implementation must not begin until Founder authorizes a later implementation wave. This Approval does **not** authorize implementation.
- Family must not reuse one `organization_id` for all members.
- Registering a new Organization, once Account exists, must not create a new introductory trial.
- Current code (User inside one Organization; first user `is_superuser`; email unique per org) **conflicts** with this decision and is **not changed**. The gap remains documented in SA-ARCH-014.
- SA-ARCH-011 / SA-ARCH-012 / SA-TRACE-001 were additively amended in Wave B under Founder authorization. ADR-002 and ADR-004 remain unchanged.
- ADR-008’s locale cascade (User → Organization → platform default) remains in force. Account-level locale vs personal-Tenant locale is not redesigned here.

## Dependencies

- ADR-002 — Tenant/RLS isolation (authoritative, not superseded)
- ADR-004 — `authorize()` (authoritative, not superseded)
- SA-ARCH-999 — documentation lifecycle (Draft → Review → Approval → Implementation)
- SA-ARCH-014 — standing architecture package that explains this decision

## Non-goals

- No database models, migrations, APIs, authentication changes, Family/trial/billing implementation, abuse engine, risk scoring, or UI.
- No Stripe or other payment-provider selection.
- No GPS, invasive device fingerprinting, user-visible fraud scores, or **automatic permanent account ban/termination in v1** (any signal).
- No change to HSA-08 visual direction or `/dev/hsa-understanding`.
- No Wave C fill of Business, GDPR, Threat Model, Payment, or Pricing stubs.
- Not a legal opinion and not a GDPR compliance determination.

## Related ADRs and documents

| Document | Relationship |
|---|---|
| [ADR-002](ADR-002-multi-tenancy.md) | Related. **Not superseded.** Tenant/RLS isolation remains. |
| [ADR-004](ADR-004-authorization.md) | Related. **Not superseded.** `authorize()` remains the centralized authorization gate. |
| ADR-008 | Locale cascade still User → Organization; not amended here. |
| [SA-ARCH-014](../Architecture/SA-ARCH-014_Account_Family_and_Entitlement_Architecture/SA-ARCH-014-00-README.md) | Draft architecture package for this decision. |
| SA-ARCH-011, SA-ARCH-012, SA-TRACE-001 | Locked; additively amended in Wave B. |
| SA-ARCH-013 | Product vision (Home includes households). Family here is entitlement, not a shared Home archive. |

## Future follow-up changes

Wave B (011 / 012 / TRACE / minimal 013) is complete. Remaining only after Founder authorizes the corresponding later wave:

1. Align Master Project Context “Family View” language (shared organization → entitlement/membership).
2. Later: Business Model, Revenue Model, Product Editions, GDPR, Threat Model, Payment, Pricing stubs (Wave C — **not authorized**).
3. Implementation of Account / Family / Entitlement / TrialHistory / abuse protection — **not authorized**.

## Assumptions

- Founder architecture direction is Approved (ADR-009). SA-ARCH-014 remains Draft. Implementation is not authorized.
- Family v1 is adult-only; one Family per Account; seat limits are configurable.
- Each person has one private personal Tenant; ESA membership is optional and separate.

## Risks

- Leaving Locked domain/capability language unchanged until Wave B can confuse readers who treat SA-ARCH-012 as the only vocabulary. This Draft package and this ADR are the interim authority for the new distinction.
- Implementing Family as an Organization before this ADR is Approved would create a privacy defect that RLS cannot fix.

## References

- Founder Authorization: Wave A Architecture Documentation (2026-08-16)
- [SA-ARCH-999](../SA-ARCH-999_Architecture_Governance.md)
- Current inspection (not modified): `backend/app/services/auth_service.py`, `backend/app/models/user.py`, `backend/app/security/authorize.py`, `backend/app/core/tenancy.py`

## Revision History

| Rev | Change |
|---|---|
| 1.0 | Draft. Records Founder-approved Account / Tenant / Family split without modifying ADR-002 or ADR-004. |
| 1.1 | **Approved** after Wave B. Records no automatic permanent account ban/termination in v1 (any signal). Does not authorize implementation or Wave C. |
