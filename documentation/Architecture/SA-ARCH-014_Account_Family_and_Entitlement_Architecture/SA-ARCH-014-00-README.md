# SA-ARCH-014-00 — Account, Family and Entitlement Architecture (README)

## Document Information

| Field | Value |
|---|---|
| Document ID | SA-ARCH-014-00 |
| Title | README — Account, Family and Entitlement Architecture |
| Version | 1.1 |
| Status | **Draft** |
| Owner | Architecture team — SmartArchive AI Platform |
| Classification | Internal |
| Parent Document | SA-ARCH-014 – Account, Family and Entitlement Architecture |
| Created | 2026-08-16 |
| Last Updated | 2026-08-16 |
| Dependencies | [ADR-009](../../adr/ADR-009-account-tenant-family-entitlement.md) (**Approved**), [ADR-002](../../adr/ADR-002-multi-tenancy.md) (Locked), [ADR-004](../../adr/ADR-004-authorization.md) (Locked) |

---

# Purpose

This README is the index for **SA-ARCH-014**, the Draft architecture package that explains the Founder-approved distinction:

```text
Account
    ↓
Personal Tenant
    ↓
Family Membership / Entitlement
```

It tells readers which part document to open, what this package does **not** authorize, and which Locked documents remain unchanged.

# Scope

**In scope:** architecture rules for Account, personal Tenant, Family entitlement, subscription/entitlement service, trial eligibility, v1 abuse signals, privacy boundaries, Family invitations, and Owner/member access.

**Out of scope:** implementation; HSA-08; Wave C business/legal/payment stubs; AI-COS / `zip one packege/`. Wave B Locked-map updates are complete.

# Document Structure

| ID | Document | Status |
|---|---|---|
| SA-ARCH-014-00 | README (this file) | Draft |
| SA-ARCH-014-01 | Account Architecture | Draft |
| SA-ARCH-014-02 | Personal Tenant Architecture | Draft |
| SA-ARCH-014-03 | Family Entitlement Architecture | Draft |
| SA-ARCH-014-04 | Subscription and Entitlement Service | Draft |
| SA-ARCH-014-05 | Trial Eligibility and History | Draft |
| SA-ARCH-014-06 | Abuse and Risk Protection | Draft |
| SA-ARCH-014-07 | Privacy and GDPR Boundaries | Draft |
| SA-ARCH-014-08 | Family Invitation Lifecycle | Draft |
| SA-ARCH-014-09 | Owner and Member Access Boundaries | Draft |
| ADR-009 | Account, Tenant, and Family Entitlement Separation | **Approved** |

# Terminology

| Term | Meaning in this package |
|---|---|
| **Account** | Durable customer identity. Owns trial history, subscription history, and at most one Family membership in v1. |
| **User** | Authenticated actor inside a Tenant (current realized model). Bound to an Account once Account exists. |
| **Tenant** | Data-isolation boundary (realized today as `Organization`). ADR-002. |
| **Personal Tenant** | The private archive Tenant belonging to one person. |
| **Family** | Entitlement/billing group. Not a Tenant. Not an Organization. Not a shared archive. |
| **Family Owner** | Account that manages Family membership, invitations, seats, billing, and entitlement — not member archives. |
| **Entitlement** | What an Account is allowed to use (plan, seats, trial vs paid). Separate from RBAC. |
| **Authorization** | What a User may do inside a Tenant, via `authorize()` (ADR-004). |

# Architecture Relationships

- **ADR-002** remains authoritative for Tenant/RLS. This package does not change RLS.
- **ADR-004** remains authoritative for `authorize()`. Entitlement is not a second permission checker in UI or routes.
- **ADR-009** is the **Approved** decision record for this package.
- **SA-ARCH-011 / SA-ARCH-012 / SA-TRACE-001** were additively amended in Wave B. ADR-002 and ADR-004 remain unchanged.

# Constraints

- Package status is Draft. ADR-009 is Approved. Neither is implementation authority.
- Do not model Family as a shared Organization.
- Do not represent subscription tiers as RBAC roles.
- Do not treat Family Owner as superuser over member Tenants.
- Seat limits are configurable, not hard-coded in this architecture.
- Family v1 is adult-only. One Family per Account in v1.

# Assumptions

- Founder Wave A authorization applies. Later waves require separate authorization.
- Current backend registration/login remain as inspected until an implementation wave is approved.

# Risks

- Readers of Locked SA-ARCH-012 may still treat Tenant as “the customer” if they skip Wave B amendments. **ADR-009 (Approved) + SA-ARCH-014 (Draft)** remain the authority for the Founder split.
- Copying an org-invite or superuser pattern into Family would violate privacy even if RLS is correctly applied inside one Tenant.

# Known contradictions with Locked documents (not edited)

Reported per SA-ARCH-999 and Founder rule: do not silently reconcile.

| Existing Locked rule | This Draft package | Conflict | Resolution |
|---|---|---|---|
| SA-ARCH-012 (pre-Wave B): Tenant = “organization or customer”; prefer “Tenant, not account” | Account = customer identity; Tenant = isolation only | Vocabulary | **Done in Wave B** (SA-ARCH-012 additive amendment) |
| SA-ARCH-011 (pre-Wave B): Identity = org/user; no Entitlement row | Entitlement is a distinct capability | Missing capability | **Done in Wave B** (Entitlement + Trust & Abuse added) |
| Code: first User of a new org is `is_superuser` | Owner must not be superuser over member archives | If Family were one org, Owner would see member data | Do not model Family as org; change register/superuser only in a later implementation wave |
| Code: email unique per Organization; new org = new User | Trial and identity belong to Account | Unbounded implicit trials | Account + TrialHistory (not implemented; implementation is not authorized) |

ADR-002 and ADR-004 were **not** modified. Wave B map updates do not authorize implementation.

# Non-goals

- No code, migrations, APIs, UI, commits, or pushes.
- HSA-08 A+C is frozen and unrelated.
- Not a legal opinion (see SA-ARCH-014-07).

# References

- [ADR-009](../../adr/ADR-009-account-tenant-family-entitlement.md)
- [ADR-002](../../adr/ADR-002-multi-tenancy.md)
- [ADR-004](../../adr/ADR-004-authorization.md)
- [SA-ARCH-999](../../SA-ARCH-999_Architecture_Governance.md)
- [SA-ARCH-011](../../SA-ARCH-011_Capability_Map.md)
- [SA-ARCH-012](../../SA-ARCH-012_Domain_Model.md)
- [SA-ARCH-013](../../SA-ARCH-013_Product_Vision_and_Evolution.md)

# Change History

| Version | Date | Description |
|---|---|---|
| 1.0 | 2026-08-16 | Draft package index created under Founder Wave A authorization. |
| 1.1 | 2026-08-16 | Founder alignment: ADR-009 recorded as **Approved**. Wave B map updates noted. Package remains Draft. No implementation. |
