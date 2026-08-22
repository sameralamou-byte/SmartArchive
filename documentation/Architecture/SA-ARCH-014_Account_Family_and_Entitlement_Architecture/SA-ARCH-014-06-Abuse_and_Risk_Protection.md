# SA-ARCH-014-06 — Abuse and Risk Protection

## Document Information

| Field | Value |
|---|---|
| Document ID | SA-ARCH-014-06 |
| Title | Abuse and Risk Protection |
| Version | 1.1 |
| Status | **Draft** |
| Owner | Architecture team — SmartArchive AI Platform |
| Classification | Internal |
| Parent Document | SA-ARCH-014 – Account, Family and Entitlement Architecture |
| Created | 2026-08-16 |
| Last Updated | 2026-08-16 |
| Dependencies | [SA-ARCH-014-05](SA-ARCH-014-05-Trial_Eligibility_and_History.md), [SA-ARCH-014-03](SA-ARCH-014-03-Family_Entitlement_Architecture.md), [ADR-009](../../adr/ADR-009-account-tenant-family-entitlement.md) |

---

# Purpose

Define v1 abuse protection as **signals, not verdicts**: patterns may trigger verification or review; they must not silently declare guilt, fingerprint users invasively, or **automatically permanently ban or terminate an account**.

# Scope

**In scope:** v1 signal classes; prohibited techniques; preferred response path; relationship to existing rate limits.

**Out of scope:** numeric risk weights; a production Risk/Abuse Service; legal threat-model fill (SA-SEC-007 is a later wave); implementation.

# Terminology

- **Signal** — an observation that *may* indicate misuse. Not proof.
- **Verdict** — a determination of guilt or automatic loss of service. v1 must not emit hidden verdicts to users as scores, and must **not** automatically permanently ban or terminate an account based on automated abuse signals.
- **Verification** — an additional step the user can complete (message-level, not fraud-score-level).

# Architecture Relationships

Abuse protection supports TrialEligibility and Family integrity. It does not replace Entitlement or `authorize()`. It must not become a surveillance layer ([SA-ARCH-014-07](SA-ARCH-014-07-Privacy_and_GDPR_Boundaries.md)).

Existing HTTP rate limits (`backend/app/core/rate_limit.py`) are **generic hardening** (credential stuffing / abuse polling). They are a supporting v1 signal class, not a Family/trial identity system. That file is **not modified** in Wave A.

# Principle: signals, not verdicts

No single weak signal automatically proves abuse. Example: **same IP ≠ same person.** A genuine family may share Wi-Fi, devices, travel locations, and networks.

Conceptual weighting, if ever designed, requires an approved threat/risk model. **Do not implement arbitrary weights.** This document lists signal *classes* only.

# Possible v1 signals

| Signal | Use in v1 |
|---|---|
| Verified Account / email | Primary identity input for trial |
| TrialHistory | Primary trial-farming input |
| Invitation history | Unusual invite patterns may trigger review |
| Family membership history | Context for seat changes |
| Seat churn (remove A, add B, repeat) | May trigger verification, not auto-termination |
| Existing rate limiting | Supporting; brute-force / rapid register |

IP and network observations, if used at all, are **supporting** for rate limiting or review. They must not independently identify a person or automatically deny a legitimate user solely because an IP is shared.

# Explicitly prohibited in v1

- GPS tracking, including continuous location to police Family membership
- Invasive device fingerprinting
- User-visible fraud scores (“Your fraud score is 87”)
- **Automatic permanent account ban or termination in v1**, regardless of whether the signal is IP, device, seat churn, or another signal. This rule must not be weakened to “IP only.”
- Treating shared IP as proof of the same person
- Automatic termination solely because of seat churn (covered by the ban/termination rule above; seat churn may trigger verification/review only)
- Collecting payment-instrument identity as the v1 trial-binding mechanism ([SA-ARCH-014-05](SA-ARCH-014-05-Trial_Eligibility_and_History.md))

Backend `Permissions-Policy: geolocation=()` already disables geolocation at the HTTP header layer; this architecture must not introduce GPS as a Family control.

# Preferred response

```text
verify → review → protect
```

not:

```text
detect → automatically ban
```

Preferred user-visible direction (copy is illustrative, not final UI):

- Seat churn: “We've noticed unusual Family membership activity. Please verify your Family subscription.”
- Unclear trial eligibility: “We need one more verification step before we can activate your trial.”
- Cannot auto-establish eligibility: “We couldn't verify your eligibility automatically. Please choose another verification method.”

Provide a support/appeal path conceptually. Case-management implementation is a later wave.

# Seat churn

Repeated unusual membership replacement may trigger verification. It must not automatically accuse or terminate the user.

# Constraints

- Do not build a risk engine in Wave A.
- Do not show internal models to users.
- Do not expand `audit_logs.ip_address` collection without privacy review (Wave C / legal). Existing optional IP on audit logs is noted, not extended.

# Assumptions

- Proportionate protection is required; surveillance is not the product.

# Risks

- Over-collecting device or network signals “just in case” would violate purpose limitation ([SA-ARCH-014-07](SA-ARCH-014-07-Privacy_and_GDPR_Boundaries.md)).

Leaving a weaker “IP-only” auto-ban wording would contradict Founder Decision 1 and ADR-009 Decision 8. That weaker wording is removed in v1.1.

# References

- [SA-ARCH-014-05](SA-ARCH-014-05-Trial_Eligibility_and_History.md)
- [SA-ARCH-014-07](SA-ARCH-014-07-Privacy_and_GDPR_Boundaries.md)
- [SA-ARCH-014-08](SA-ARCH-014-08-Family_Invitation_Lifecycle.md)
- `backend/app/core/rate_limit.py` (inspection only)
- `backend/app/core/security_headers.py` (inspection only)

# Change History

| Version | Date | Description |
|---|---|---|
| 1.0 | 2026-08-16 | Draft. Signals not verdicts; v1 prohibitions. |
| 1.1 | 2026-08-16 | Founder alignment: no automatic permanent account ban/termination in v1 (any signal). Removes the weaker “based solely on IP” wording. |
