# SA-ARCH-014-07 — Privacy and GDPR Boundaries

## Document Information

| Field | Value |
|---|---|
| Document ID | SA-ARCH-014-07 |
| Title | Privacy and GDPR Boundaries |
| Version | 1.0 |
| Status | **Draft** |
| Owner | Architecture team — SmartArchive AI Platform |
| Classification | Internal |
| Parent Document | SA-ARCH-014 – Account, Family and Entitlement Architecture |
| Created | 2026-08-16 |
| Last Updated | 2026-08-16 |
| Dependencies | [SA-ARCH-014-02](SA-ARCH-014-02-Personal_Tenant_Architecture.md), [SA-ARCH-014-03](SA-ARCH-014-03-Family_Entitlement_Architecture.md), [SA-ARCH-014-06](SA-ARCH-014-06-Abuse_and_Risk_Protection.md), [ADR-009](../../adr/ADR-009-account-tenant-family-entitlement.md) |

---

# Purpose

State **architecture privacy boundaries** for Account, Family, trial, and abuse signals.

**This is not a legal opinion.** It does not determine lawful basis, DPIA outcome, or GDPR adequacy. Exact legal implementation requires legal/privacy review in a later wave (`SA-COM-002` / `SA-SEC-005` are not filled here).

# Scope

**In scope:** minimization; purpose limitation; Owner/member separation; what abuse protection must not become.

**Out of scope:** filling GDPR, Privacy, or Threat Model stubs; retention schedules; processor agreements; implementation.

# Terminology

- **Architecture boundary** — a rule the system design must obey.
- **Legal determination** — reserved for counsel and compliance documents (later wave).

# Architecture Relationships

Privacy here is a constraint on SA-ARCH-014-01 through 09. Isolation is still ADR-002. Authorization is still ADR-004. Family must not punch a hole through either.

# Data minimization

Collect the **minimum information necessary for the specific purpose**.

| Purpose | May need | Must not become |
|---|---|---|
| Authenticate Account | credentials / verified email | a dossier of household location |
| Trial eligibility | TrialHistory + verified identity | payment-instrument identity in v1 |
| Family membership | invitation and membership events | member document contents |
| Abuse review | proportionate signals in 014-06 | continuous tracking |

# Purpose limitation

Account history, invitation patterns, rate-limit metadata, and (if ever used) IP/network signals may be used only for the purpose they were collected for: security, eligibility, or membership integrity — not for profiling, advertising, or Family policing by location.

# Private member archives

Each member’s personal Tenant is a private archive. Family Package does not create a shared document space and does not grant the Owner read access.

# Owner / member separation

The Owner cannot read member documents. The Owner cannot read member AI history (AI jobs, explanations, assistant history in the member Tenant). See the access matrix in [SA-ARCH-014-09](SA-ARCH-014-09-Owner_and_Member_Access_Boundaries.md).

# Limited abuse signals

v1 uses verified Account/email, TrialHistory, invitation/membership history, seat-churn review, and existing rate limits. IP is supporting only. See [SA-ARCH-014-06](SA-ARCH-014-06-Abuse_and_Risk_Protection.md).

# No unnecessary location tracking

No GPS. No continuous location to enforce Family membership. Geolocation is not a Family control.

# No unnecessary device surveillance

No invasive device fingerprinting in v1. Device/security signals, if ever added after privacy review, are not authorized by this Draft.

# Owner cannot read member documents or AI history

This is a product and architecture rule, not only a UI rule. Modeling Owner as `is_superuser` on a shared or member Organization would violate it because superuser bypasses `authorize()`.

# Constraints

- Do not create or modify `documentation/Compliance/SA-COM-002_GDPR/` or `documentation/Security/SA-SEC-005_GDPR/` in Wave A.
- Do not store unnecessary personal data in audit records (event type and identifiers should be enough conceptually; schemas are not designed here).
- Users must not see risk scores.

# Assumptions

- Legal review will follow in a later wave; architecture must not pre-commit to high-intrusion signals.

# Risks

- Filling legal stubs casually in Wave A would mix architecture with unreviewed legal claims. Avoided by not touching those files.

# References

- [SA-ARCH-014-06](SA-ARCH-014-06-Abuse_and_Risk_Protection.md)
- [SA-ARCH-014-09](SA-ARCH-014-09-Owner_and_Member_Access_Boundaries.md)
- [ADR-002](../../adr/ADR-002-multi-tenancy.md)
- [ADR-004](../../adr/ADR-004-authorization.md)
- Empty stubs (later wave, not modified): `SA-COM-002`, `SA-SEC-004`, `SA-SEC-005`

# Change History

| Version | Date | Description |
|---|---|---|
| 1.0 | 2026-08-16 | Draft. Architecture privacy boundaries; not a legal opinion. |
