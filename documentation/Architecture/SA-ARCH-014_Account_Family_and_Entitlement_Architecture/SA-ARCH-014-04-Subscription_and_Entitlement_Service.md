# SA-ARCH-014-04 — Subscription and Entitlement Service

## Document Information

| Field | Value |
|---|---|
| Document ID | SA-ARCH-014-04 |
| Title | Subscription and Entitlement Service |
| Version | 1.0 |
| Status | **Draft** |
| Owner | Architecture team — SmartArchive AI Platform |
| Classification | Internal |
| Parent Document | SA-ARCH-014 – Account, Family and Entitlement Architecture |
| Created | 2026-08-16 |
| Last Updated | 2026-08-16 |
| Dependencies | [ADR-004](../../adr/ADR-004-authorization.md), [ADR-009](../../adr/ADR-009-account-tenant-family-entitlement.md), [SA-ARCH-014-01](SA-ARCH-014-01-Account_Architecture.md), [SA-ARCH-014-03](SA-ARCH-014-03-Family_Entitlement_Architecture.md) |

---

# Purpose

Separate **what an Account may use** (entitlement) from **what a User may do inside a Tenant** (authorization), and require a server-side Entitlement Service as the home for that logic.

# Scope

**In scope:** Individual vs Family entitlement; subscription and seat relationship; separation from RBAC; non-UI enforcement.

**Out of scope:** plan catalog, prices, Stripe, feature flags in frontend, `authorize()` signature changes, implementation.

# Terminology

- **Subscription** — commercial relationship attached to an Account (Individual or Family Owner billing).
- **Entitlement** — evaluated result: which product capabilities and seats the Account currently has.
- **Seat entitlement** — a Family slot consumed by a member Account.
- **Entitlement Service** — server-side evaluator of entitlement. Conceptual in Wave A; not a module to create now.
- **Authorization** — `authorize(session, user, action, resource)` per ADR-004.

# Architecture Relationships

```text
Account
  ├── Identity
  ├── Trial History
  └── Subscription History
            │
            ▼
     Entitlement Service
            │
     ┌──────┴──────┐
     │             │
 Individual      Family
     │             │
     ▼             ▼
 Personal        Personal Tenants remain isolated
 Tenant          (ADR-002). Entitlement does not open them.
```

[ADR-004](../../adr/ADR-004-authorization.md) remains the **only** place permission checks happen. Entitlement answers a different question and must not be copied into route handlers or React components as the source of truth.

# Individual entitlement

An Account with an Individual subscription (or a valid introductory trial) is entitled to use SmartArchive in that Account’s personal Tenant according to the Individual offering. Individual entitlement does not grant access to any other Account’s Tenant.

# Family entitlement

An Account that is Owner or Member of a Family is entitled to the Family offering **while membership is active**, still only inside that Account’s own personal Tenant (and any separate ESA Tenant they belong to under ordinary org rules).

Family entitlement is **not** a key to other members’ archives.

# Subscription relationship

Subscription history belongs on the Account. The Family Owner is the billing customer for the Family Package. Members are covered by seats; they are not automatically billing customers.

Payment-provider mechanics are out of scope (later SA-INT-007). This architecture must not copy AI-COS billing models.

# Seat entitlement

Seats are countable coverage on a Family subscription. The limit is **configurable**. Consuming a seat does not create a Tenant and does not share `organization_id`.

Leaving Family releases the seat per lifecycle rules; it does not erase TrialHistory or create a new introductory trial ([SA-ARCH-014-05](SA-ARCH-014-05-Trial_Eligibility_and_History.md)).

# Server-side Entitlement Service

Entitlement must be evaluated on the server. Clients may display plan names; they must not be the authority for “this user is on Family, therefore show member documents” or “this user is on trial, therefore allow feature X” without a server decision.

No module path is mandated in Wave A. When implementation is authorized, entitlement logic belongs in the backend service layer, not in `frontend/src` as the system of record.

# Entitlement is separate from authorization

| Concern | Owner | Question |
|---|---|---|
| Entitlement | Entitlement Service | May this Account use this product offering / seat / trial? |
| Authorization | `authorize()` (ADR-004) | May this User perform this action on this resource inside this Tenant? |

Both may apply to the same request (for example: entitled **and** permitted to `document.create` in the personal Tenant). They must not be collapsed into one Role named “Family” or “Premium.”

# authorize() remains the permission gate

- No route or service inlines a second permission model for Family.
- Stage 2+ ABAC inside `authorize()` (already reserved in ADR-004) is not a substitute for Entitlement.
- Family Owner must not be implemented as `is_superuser` on member Tenants. Superuser currently bypasses `authorize()` entirely.

This document does **not** change `authorize.py`.

# Entitlement must not be UI-only

Hiding a button is not entitlement enforcement. UI may reflect entitlement; the API must reject unentitled use.

# Entitlement must not be represented as RBAC roles

Roles remain tenant-scoped bundles of permission codes (ADR-004). “Family Owner,” “Family Member,” and plan names are **not** entries in the Permission catalogue and **not** substitutes for Role.

Family-management actions (invite, remove, change seats) will eventually need authorization **inside whatever Tenant or administrative context is approved later**. That is still `authorize()`, plus Entitlement confirming the caller is Family Owner. Wave A does not invent that administrative Tenant.

# Constraints

- Do not scatter subscription checks through UI components as the authority.
- Do not implement this service in Wave A.
- Do not use `zip one packege/` Stripe/seat code as a template.

# Assumptions

- A later implementation wave will introduce Account and Entitlement persistence after Founder approval.

# Risks

- Putting plan names on `Role` would make ESA RBAC and HSA commercial state the same mechanism, and would not survive cross-tenant Family membership.

# References

- [ADR-004](../../adr/ADR-004-authorization.md)
- [ADR-009](../../adr/ADR-009-account-tenant-family-entitlement.md)
- [SA-ARCH-014-05](SA-ARCH-014-05-Trial_Eligibility_and_History.md)
- [SA-ARCH-011](../../SA-ARCH-011_Capability_Map.md) — no Entitlement row yet (Wave B)

# Change History

| Version | Date | Description |
|---|---|---|
| 1.0 | 2026-08-16 | Draft. Entitlement Service separate from authorize(). |
