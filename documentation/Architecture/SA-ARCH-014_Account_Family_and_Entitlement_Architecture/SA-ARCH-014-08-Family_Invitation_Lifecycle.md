# SA-ARCH-014-08 — Family Invitation Lifecycle

## Document Information

| Field | Value |
|---|---|
| Document ID | SA-ARCH-014-08 |
| Title | Family Invitation Lifecycle |
| Version | 1.0 |
| Status | **Draft** |
| Owner | Architecture team — SmartArchive AI Platform |
| Classification | Internal |
| Parent Document | SA-ARCH-014 – Account, Family and Entitlement Architecture |
| Created | 2026-08-16 |
| Last Updated | 2026-08-16 |
| Dependencies | [SA-ARCH-014-03](SA-ARCH-014-03-Family_Entitlement_Architecture.md), [SA-ARCH-014-01](SA-ARCH-014-01-Account_Architecture.md), [ADR-009](../../adr/ADR-009-account-tenant-family-entitlement.md) |

---

# Purpose

Define how Family membership is established: explicit invitation, secure expiring token, separate Account, no archive merge.

# Scope

**In scope:** conceptual lifecycle; distinction from ESA org invite; adult-only v1; auditability.

**Out of scope:** token cryptography, email templates, API routes, implementation of Phase 2 org invites.

# Terminology

- **Family invitation** — offer of a Family **seat**, not of access to an archive.
- **ESA organization invitation** — offer to join a **collaboration Tenant** (Phase 2 comment in auth service; different privacy default).
- **Secure expiring token** — time-bounded secret that represents the invitation. Algorithm not specified in Wave A.

# Architecture Relationships

Invitations change **Family membership / entitlement**, not Tenant membership of the Owner’s archive.

Trial eligibility remains on the recipient Account ([SA-ARCH-014-05](SA-ARCH-014-05-Trial_Eligibility_and_History.md)). Accepting does not mint a new introductory trial.

# Lifecycle

```text
Family Owner
      ↓
Invite Member
      ↓
Secure expiring token
      ↓
Recipient (existing Account or new Account)
      ↓
Adult-only acceptance (v1)
      ↓
Family Membership (seat)
      ↓
Separate personal Tenant remains (or is created for a new Account)
```

Accepting an invitation **does not merge private archives**.

# Requirements

| Requirement | Rule |
|---|---|
| Explicit invitation | Membership is not implied by shared household, shared IP, or payment. |
| Expiring invitation | Tokens expire; expired tokens cannot be accepted. |
| Secure token | Treat as a secret; do not put long-lived raw tokens in audit logs. |
| Existing or new Account | Recipient may already have an Account, or create one; either way they keep a private Tenant. |
| Adult-only v1 | Do not accept Family membership for non-adult Accounts in v1. Verification method not specified here. |
| Auditable | Record invitation created, accepted, expired, revoked; member removed; member leaves — with minimal personal data. |
| Separate from ESA invite | Different lifecycle, different default access, different code path when implemented. |

# Family invitation is not ESA organization invitation

| | Family invitation | ESA org invitation |
|---|---|---|
| What is granted | Seat / Family entitlement | Membership in a collaboration Tenant |
| Documents | Still private personal Tenants | Shared per that Tenant’s RBAC |
| Owner access to invitee documents | No | Per ESA roles (explicit collaboration) |
| Today in code | Does not exist | Commented as Phase 2 in `auth_service.py` only |

Reusing org-invite as Family invite is **rejected** by ADR-009.

# Accepting does not merge archives

After accept:

- Member Account exists (created or linked).
- Member personal Tenant remains the member’s archive.
- Owner Tenant is unchanged.
- No shared `organization_id` for Family.

# Constraints

- Do not implement tokens, mail, or APIs in Wave A.
- Do not enumerate whether an email already has an Account in public error messages (account enumeration protection — principle only; no API design here).
- Seat limit (configurable) is checked by Entitlement when implementation exists.

# Assumptions

- One Family per Account in v1; invitation into a second Family is not allowed while the first membership is active.

# Risks

- A single “invite” feature that joins the Owner Organization would silently violate this lifecycle.

# References

- [SA-ARCH-014-03](SA-ARCH-014-03-Family_Entitlement_Architecture.md)
- [SA-ARCH-014-04](SA-ARCH-014-04-Subscription_and_Entitlement_Service.md)
- [SA-ARCH-014-09](SA-ARCH-014-09-Owner_and_Member_Access_Boundaries.md)
- [ADR-009](../../adr/ADR-009-account-tenant-family-entitlement.md)

# Change History

| Version | Date | Description |
|---|---|---|
| 1.0 | 2026-08-16 | Draft. Family invitation lifecycle; distinct from ESA invite. |
