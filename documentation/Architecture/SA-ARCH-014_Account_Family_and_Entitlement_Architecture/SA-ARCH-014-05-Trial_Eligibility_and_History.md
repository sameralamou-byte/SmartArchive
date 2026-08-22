# SA-ARCH-014-05 — Trial Eligibility and History

## Document Information

| Field | Value |
|---|---|
| Document ID | SA-ARCH-014-05 |
| Title | Trial Eligibility and History |
| Version | 1.0 |
| Status | **Draft** |
| Owner | Architecture team — SmartArchive AI Platform |
| Classification | Internal |
| Parent Document | SA-ARCH-014 – Account, Family and Entitlement Architecture |
| Created | 2026-08-16 |
| Last Updated | 2026-08-16 |
| Dependencies | [ADR-009](../../adr/ADR-009-account-tenant-family-entitlement.md), [SA-ARCH-014-01](SA-ARCH-014-01-Account_Architecture.md), [SA-ARCH-014-04](SA-ARCH-014-04-Subscription_and_Entitlement_Service.md) |

---

# Purpose

Place **one introductory trial** on the Account, record it in TrialHistory, and prevent new Tenants, new emails, or Family joins from minting another unlimited introductory trial.

# Scope

**In scope:** TrialHistory; TrialEligibility; v1 primary controls; Family interaction rules.

**Out of scope:** trial length, feature set during trial, payment capture, implementation, risk weights.

# Terminology

- **Introductory trial** — the one legitimate trial opportunity attached to an Account.
- **TrialHistory** — durable record that an Account has started, completed, or exhausted that opportunity.
- **TrialEligibility** — the evaluated answer: may this Account start (or continue) an introductory trial?

# Architecture Relationships

```text
SmartArchive Account
  ├── Trial History
  └── Subscription History
            │
            ▼
     TrialEligibility (input to Entitlement Service)
```

Eligibility is Account-scoped. Organization/Tenant creation is not an eligibility event.

# Trial belongs to the Account

Not to:

- a new `Organization`
- a new `User` row in a new org
- an email address in isolation
- a Family membership

# TrialHistory

TrialHistory is a conceptual record on the Account. It must survive:

- creating additional Tenants;
- joining or leaving a Family;
- changing email, if a later wave allows that, until identity is re-verified (mechanism not specified here).

Wave A does not define columns or APIs.

# TrialEligibility

Eligibility considers, as **v1 primary controls**:

1. verified Account / verified email;
2. TrialHistory (whether an introductory trial was already consumed).

Supporting signals (rate limits, invitation patterns) may inform **review**, not automatic identity. See [SA-ARCH-014-06](SA-ARCH-014-06-Abuse_and_Risk_Protection.md).

Payment instrument is **not** required as the v1 identity mechanism.

# One introductory trial per Account

The same person must not receive four trials by registering four organizations or four emails. Email alone is not identity.

# New Tenant / Organization must not create another trial

Today, `AuthService.register` creates a new Organization and a new first User. That path must **not** be treated as a new trial once Account and TrialHistory exist.

Wave A does not change `auth_service.py`. The rule is architectural: when implementation is authorized, register/bootstrap must consult Account TrialHistory rather than imply a fresh trial per org.

# Joining Family does not automatically grant another introductory trial

| Transition | Trial rule |
|---|---|
| Individual trial → later Family | Consumed trial remains consumed. Family membership is entitlement, not a new trial. |
| Family → later individual | Eligibility follows Account TrialHistory and Subscription History, not “new org.” |
| Member leaves Family | History stays on the Account. No automatic extra trial. |
| Owner creates extra Accounts to farm trials | Distinguished by eligibility/abuse review; not by treating each org as innocent. |

# v1 primary controls

| Control | Role in v1 |
|---|---|
| Verified Account / email | Primary |
| TrialHistory | Primary |
| Payment instrument | Not required for v1 identity |
| IP / rate limit | Supporting only ([SA-ARCH-014-06](SA-ARCH-014-06-Abuse_and_Risk_Protection.md)) |

If eligibility cannot be established automatically, the product direction is additional verification or support — not a silent extra trial, and not a fraud-score screen.

# Current code (inspection only — not changed)

There is no trial table, no eligibility API, and no billing router. Registration does not start or deny a trial. That absence is the gap.

# Constraints

- Do not invent trial duration or included features here.
- Do not require card-on-file as v1 identity.
- Do not implement TrialHistory in Wave A.

# Assumptions

- “Introductory trial” is singular per Account unless Founder later approves a distinct, named exception (none is approved now).

# Risks

- Shipping Family or multi-org register before TrialHistory exists would preserve today’s unbounded-trial behavior.

# References

- [ADR-009](../../adr/ADR-009-account-tenant-family-entitlement.md)
- [SA-ARCH-014-04](SA-ARCH-014-04-Subscription_and_Entitlement_Service.md)
- [SA-ARCH-014-06](SA-ARCH-014-06-Abuse_and_Risk_Protection.md)

# Change History

| Version | Date | Description |
|---|---|---|
| 1.0 | 2026-08-16 | Draft. Account-scoped trial; no implementation. |
