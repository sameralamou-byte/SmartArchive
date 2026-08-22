# Smart Archive

## Document Information

| Field | Value |
|--------|-------|
| Document ID | SA-BIZ-001-00 |
| Title | README |
| Version | 1.1 |
| Status | Draft |
| Owner | Smart Archive Team |
| Classification | Internal |
| Parent Document | SA-BIZ-001 – Product Vision & Business Architecture |
| Created | 2026-07-31 |
| Last Updated | 2026-08-16 |

---

# Purpose

This document serves as the master index for the **SA-BIZ-001 – Product Vision & Business Architecture** package.

It provides an overview of the business documentation, defines the relationships between the documents, and serves as the primary navigation point for stakeholders, architects, developers, AI assistants, and future contributors.

Account / Tenant / Family / Entitlement terminology in this package must follow [ADR-009](../../adr/ADR-009-account-tenant-family-entitlement.md) (Approved v1.1). Product-vision audience language (Home, households, families) follows [SA-ARCH-013](../../SA-ARCH-013_Product_Vision_and_Evolution.md). Standing architecture explanation is [SA-ARCH-014](../../Architecture/SA-ARCH-014_Account_Family_and_Entitlement_Architecture/SA-ARCH-014-00-README.md) (Draft). This package does not replace those documents and does not authorize implementation.

---

# Document Structure

| ID | Document | Status |
|----|----------|--------|
| SA-BIZ-001-00 | README | Draft |
| SA-BIZ-001-01 | Executive Summary | Draft |
| SA-BIZ-001-02 | Vision & Mission | Draft |
| SA-BIZ-001-03 | Product Identity | Draft — not yet filled |
| SA-BIZ-001-04 | Core Philosophy | Draft — not yet filled |
| SA-BIZ-001-05 | North Star | Draft — not yet filled |
| SA-BIZ-001-06 | Problem Statement | Draft — not yet filled |
| SA-BIZ-001-07 | Product Solution | Draft — not yet filled |
| SA-BIZ-001-08 | Value Proposition | Draft — not yet filled |
| SA-BIZ-001-09 | Target Customers | Draft — not yet filled |
| SA-BIZ-001-10 | Market Analysis | Draft — not yet filled |
| SA-BIZ-001-11 | Competitive Positioning | Draft — not yet filled |
| SA-BIZ-001-12 | Business Model | **Future / Deferred** — no prices or plans in Wave C1 |
| SA-BIZ-001-13 | Revenue Model | **Future / Deferred** — no prices, payment provider, or SKU catalog in Wave C1 |
| SA-BIZ-001-14 | Core Values | Draft — not yet filled |
| SA-BIZ-001-15 | Company Principles | Draft — not yet filled |
| SA-BIZ-001-16 | Strategic Pillars | Draft — not yet filled |
| SA-BIZ-001-17 | Business Capabilities | Draft — not yet filled |
| SA-BIZ-001-18 | Product Editions | **Future / Deferred** — editions remain as in SA-ARCH-013; not a Family architecture rewrite |
| SA-BIZ-001-19 | Business Governance | Draft — not yet filled |
| SA-BIZ-001-20 | Success Metrics | Draft — not yet filled |
| SA-BIZ-001-21 | Three-Year Roadmap | Draft — not yet filled |
| SA-BIZ-001-22 | Risk Analysis | Draft — not yet filled |
| SA-BIZ-001-23 | Future Vision | Draft — not yet filled |
| SA-BIZ-001-24 | Glossary | Draft — Wave C1 terminology (ADR-009) |
| SA-BIZ-001-25 | Product Principles | Draft — not yet filled |

---

# Scope

SA-BIZ-001 defines the strategic business foundation of Smart Archive, including:

- Vision
- Mission
- Product Identity
- Core Philosophy
- Strategic Direction
- Business Principles
- Value Proposition
- Target Markets
- Long-Term Business Objectives
- Glossary aligned to approved architecture (SA-BIZ-001-24)

This package is the highest-level **business** reference for the Smart Archive platform. Architecture decisions for Account, Tenant, Family, and Entitlement are **not** made here; they are made in ADR-009 and explained in SA-ARCH-014.

**Out of scope for this index / Wave C1:** prices, payment provider, trial duration, trial features, numeric seat defaults, KYC/age-verification method, billing implementation, GDPR legal conclusions, and implementation.

---

# Related Documents

- [ADR-009](../../adr/ADR-009-account-tenant-family-entitlement.md) — Account / Tenant / Family / Entitlement (Approved)
- [SA-ARCH-014](../../Architecture/SA-ARCH-014_Account_Family_and_Entitlement_Architecture/SA-ARCH-014-00-README.md) — standing architecture package (Draft)
- [SA-ARCH-013](../../SA-ARCH-013_Product_Vision_and_Evolution.md) — product vision; household/family as audience, not shared Family storage
- [SA-ARCH-011](../../SA-ARCH-011_Capability_Map.md) — capability map (includes Entitlement; Trust & Abuse)
- [SA-ARCH-012](../../SA-ARCH-012_Domain_Model.md) — domain vocabulary
- [SA-ARCH-000](../../SA-ARCH-000_Master_Architecture.md) — Master Architecture
- [SA-ARCH-001](../../SA-ARCH-001.md) — Architecture Overview

Commercial detail (Business Model, Revenue Model, Product Editions, Pricing, Payment) remains in existing package IDs and is **not filled** in Wave C1.

---

# Change History

| Version | Date | Description |
|----------|------|-------------|
| 1.0 | 2026-07-31 | Initial document created. |
| 1.1 | 2026-08-16 | Wave C1: complete index; cite ADR-009 / SA-ARCH-014 / SA-ARCH-013; mark commercial documents future/deferred. |
