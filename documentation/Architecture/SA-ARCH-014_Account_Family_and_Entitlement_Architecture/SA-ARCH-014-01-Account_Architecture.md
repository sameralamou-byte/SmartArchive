# SA-ARCH-014-01 — Account Architecture

## Document Information

| Field | Value |
|---|---|
| Document ID | SA-ARCH-014-01 |
| Title | Account Architecture |
| Version | 1.0 |
| Status | **Draft** |
| Owner | Architecture team — SmartArchive AI Platform |
| Classification | Internal |
| Parent Document | SA-ARCH-014 – Account, Family and Entitlement Architecture |
| Created | 2026-08-16 |
| Last Updated | 2026-08-16 |
| Dependencies | [SA-ARCH-014-00](SA-ARCH-014-00-README.md), [ADR-009](../../adr/ADR-009-account-tenant-family-entitlement.md) |

---

# Purpose

Define **Account** as SmartArchive’s durable customer identity, and describe how Account relates to User, personal Tenant, optional ESA membership, and Family entitlement — without specifying unimplemented schemas or APIs.

# Scope

**In scope:** identity meaning; verified identity/email as a v1 concept; cardinality rules approved by the Founder.

**Out of scope:** authentication protocol changes; registration rewrite; SSO; payment-instrument identity; code changes.

# Terminology

See [SA-ARCH-014-00](SA-ARCH-014-00-README.md). In this document:

- **Account** — the person as customer: stable across Tenants they may belong to.
- **User** — the actor record used to sign in and act *inside one Tenant* (today’s realized model).
- **Verified identity/email** — an Account identity that SmartArchive treats as confirmed for trial and invitation purposes. Exact verification mechanism is not selected in Wave A.

# Architecture Relationships

```text
Account  (durable identity)
  ├── User-in-Personal-Tenant   → private HSA archive
  ├── User-in-ESA-Tenant        → optional collaboration (not Family)
  ├── Trial History
  ├── Subscription History
  └── Family membership (at most one in v1)
```

- Isolation of documents remains Tenant-scoped ([ADR-002](../../adr/ADR-002-multi-tenancy.md)).
- Actions inside a Tenant remain `authorize()`-gated ([ADR-004](../../adr/ADR-004-authorization.md)).
- What the Account may use (trial, Individual, Family seats) is Entitlement ([SA-ARCH-014-04](SA-ARCH-014-04-Subscription_and_Entitlement_Service.md)).

# Account as durable identity

Account is the unit that:

- holds **one introductory trial** eligibility ([SA-ARCH-014-05](SA-ARCH-014-05-Trial_Eligibility_and_History.md));
- holds subscription/entitlement state;
- may own or belong to **at most one Family** in v1;
- is not destroyed when a Tenant is created or left.

A new Tenant/Organization is a new isolation boundary, not a new customer and not a new trial.

# Relationship: Account, User, Tenant

| Concept | Job | Today (realized, unchanged) | Target (architecture, not implemented) |
|---|---|---|---|
| Account | Who the customer is | **Does not exist** | Durable identity |
| User | Who is signed in inside a Tenant | `User` row with `organization_id`; email unique per org | Actor bound to an Account |
| Tenant | Whose documents are isolated | `Organization` + RLS | Personal archive or ESA collab space |

SA-ARCH-012 already allows a User to act “within one or more Tenants.” That sentence is compatible with one Account spanning a personal Tenant and an ESA Tenant. The missing concept is the Account that binds those memberships. **SA-ARCH-012 is not edited in Wave A.**

# Verified identity / email

v1 trial and invitation flows treat **verified Account/email** as a primary control, together with TrialHistory.

- Email alone is not identity: creating `user2@…` after `user1@…` must not automatically yield a new trial.
- Payment instrument is **not** required as the v1 identity mechanism.
- How verification is performed (link, IdP, other) is an implementation choice for a later approved wave. This document does not select a vendor or protocol.

# Personal HSA relationship

Each person has **one private personal SmartArchive Tenant**. That Tenant is the HSA archive: documents, AI history, settings, and locale as they apply inside that archive. The Account is the customer; the personal Tenant is the archive.

# Optional ESA relationship

An Account may also be a member of an **ESA collaboration Tenant**. That membership is ordinary tenant membership under ADR-002/ADR-004. It is **not** Family. ESA invitations remain a separate lifecycle from Family invitations ([SA-ARCH-014-08](SA-ARCH-014-08-Family_Invitation_Lifecycle.md)).

# Family membership relationship

Family membership is an entitlement link on the Account. It does not merge Tenants, does not share `organization_id`, and does not grant the Owner document access. See [SA-ARCH-014-03](SA-ARCH-014-03-Family_Entitlement_Architecture.md) and [SA-ARCH-014-09](SA-ARCH-014-09-Owner_and_Member_Access_Boundaries.md).

v1: one Family per Account; adult-only.

# Current code (inspection only — not changed)

Wave A does not modify:

- `backend/app/services/auth_service.py` — register creates Organization; first user `is_superuser=True`
- `backend/app/models/user.py` — email unique per organization
- `backend/app/security/jwt.py` — token carries `sub` + `org_id`
- `frontend/src/store/authStore.ts` / `frontend/src/pages/Login.tsx`

Those facts are the gap Account architecture must later close. They are not silently “fixed” here.

# Constraints

- Do not invent table layouts, API routes, or token formats.
- Do not equate Account with Organization.
- Do not use Family as a substitute Account for members.

# Assumptions

- One person ↔ one Account in the intended product (duplicate-Account abuse is an eligibility problem, not a license to merge archives).

# Risks

- Implementing “Account” as another Organization would recreate the trial-farming and privacy problems this package exists to prevent.

# References

- [ADR-009](../../adr/ADR-009-account-tenant-family-entitlement.md)
- [SA-ARCH-012](../../SA-ARCH-012_Domain_Model.md) (Locked; User/Tenant vocabulary — conflict noted in README)
- [SA-ARCH-014-02](SA-ARCH-014-02-Personal_Tenant_Architecture.md)
- [SA-ARCH-014-05](SA-ARCH-014-05-Trial_Eligibility_and_History.md)

# Change History

| Version | Date | Description |
|---|---|---|
| 1.0 | 2026-08-16 | Draft. Account as durable identity; no implementation. |
