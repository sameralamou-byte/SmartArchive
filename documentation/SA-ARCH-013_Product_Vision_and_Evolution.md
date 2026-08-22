# SA-ARCH-013 — Product Vision & Evolution

| Field | Value |
|---|---|
| Document ID | SA-ARCH-013 |
| Version | 1.1 |
| Owner | Product & Architecture — SmartArchive AI Platform |
| Status | Approved — part of Architecture Baseline v1.0 (new document, first review; see [SA-ARCH-999](SA-ARCH-999_Architecture_Governance.md) §2 for promotion to Locked) |
| Dependencies | None — this document is deliberately upstream of [SA-ARCH-000](SA-ARCH-000_Master_Architecture.md), not downstream of it |
| Purpose | The "North Star." Not a technical architecture document — it answers *why SmartArchive exists* and *what it is for*, so that every technical decision in SA-ARCH-000 and every ADR has something stable to be evaluated against. Unlike the technical documents, this one is expected to change rarely — a change here should be a deliberate product decision, not a byproduct of a technical review. |

## 1. Why SmartArchive Exists

Organizations of every size — from a single home user to a multinational enterprise — accumulate documents faster than they can organize, understand, or act on them: contracts, invoices, IDs, medical records, legal notices, correspondence. Existing tools force a choice between two bad options: a generic file store that understands nothing about what it's holding, or a narrow vertical product (a legal DMS, a medical records system, an ERP's document module) that only works for one kind of organization and one kind of document.

SmartArchive exists to close that gap: one AI-driven document intelligence engine that understands, organizes, explains, and acts on documents for *any* organization, in *any* deployment context, without forcing a rebuild per market segment.

## 2. What Problems SmartArchive Solves

- **"I have this document — what is it, and what do I need to do about it?"** (classification, extraction, reminders)
- **"Where is the document that says X?"** (search, both keyword and semantic)
- **"I don't want to re-enter this into my ERP/CRM by hand."** (connectors, Integrated Mode)
- **"I don't have an ERP/CRM at all — I just need this organized."** (Standalone Mode)
- **"I'd rather ask than click through menus."** (Voice, chat, AI Everywhere)
- **"I need to trust what the AI tells me, not just believe it."** (Human-Centered — the AI explains itself, per Principle #9)

## 3. What Products Belong to SmartArchive

| Product | Who it's for | Deployment default |
|---|---|---|
| **Enterprise** | Companies, factories, warehouses, government bodies already running administrative systems | Integrated Mode (Principle #5) |
| **Home** | Individuals and households managing personal documents. “Household” here is **audience / use-context** language. It does **not** mean that a Family Package or household relationship creates a shared document archive or shared Tenant. Each person keeps a private Personal Tenant (ADR-009). | Standalone Mode (Principle #6) |
| **SMB** | Small offices/businesses, NGOs, startups — may or may not have an existing system | Either, depending on what the customer already runs |
| **Future industry editions** | Legal, Healthcare, Education, Government — verticals with domain-specific document types and regulatory requirements | Built on the same shared Engine (Principle #1); *how* is the open `B-EXT` question in [SA-ROADMAP-001](SA-ROADMAP-001_Architecture_Roadmap.md) |

## 4. What Does *Not* Belong to SmartArchive

Stated explicitly, because "no duplicated business logic" (Principle #1) only means something if there's a clear line for what SmartArchive should *not* try to become:

- **Not a replacement ERP/CRM.** SA-ARCH-006 is explicit: SmartArchive adds an intelligence layer over existing systems; it doesn't compete with SAP, Salesforce, or Odoo for their core job (inventory, sales pipelines, financials).
- **Not a general-purpose file sync tool.** SmartArchive isn't trying to be Dropbox or Google Drive — those are Connectors it integrates *with* (Principle #5), not competitors it's replacing.
- **Not a per-industry fork.** A "Legal edition" is not a separate codebase that happens to share some libraries — see [SA-ARCH-000](SA-ARCH-000_Master_Architecture.md) §7 and [SA-ARCH-011](SA-ARCH-011_Capability_Map.md) for why that would violate Principle #1.
- **Not a workflow/BPM platform in the general sense.** SmartArchive automates *document-centric* workflows (a document arrives → gets classified → triggers a reminder or action); it is not trying to become a general business-process orchestration tool for processes that don't touch documents.

## 5. How Home, SMB, Enterprise, and Future Editions Relate

They are not separate products built independently and loosely federated — they are **the same Engine, configured differently**:

- **Deployment mode** (integrated / standalone / hybrid — [SA-ARCH-000](SA-ARCH-000_Master_Architecture.md) §4) answers "does this customer already run a system SmartArchive should connect to?"
- **Product tier** (Home / SMB / Enterprise) answers "what scale and feature set does this customer need?" — a Home user doesn't need multi-role RBAC depth; an Enterprise customer does. Both run on the identical `Role`/`Permission` model (SA-ARCH-012), just configured differently.
- **Industry edition** (Legal / Healthcare / Education / Government / none) answers "does this customer need domain-specific capabilities beyond the generic core?" — this is the dimension `B-EXT` is still deciding the mechanics of, but the *product* answer is already fixed by Principle #1: whatever the mechanism, the underlying OCR, AI Gateway, Search, Storage, Security, and Audit stay the same Engine.

These three dimensions are independent of each other — an Enterprise customer can be in Standalone mode with no industry edition; a Home user could theoretically need a Healthcare-edition capability (for example, medical records kept in that user’s **personal** archive). “Household” / “family member” in this vision document is audience language and possible future **explicit** sharing; it does **not** authorize Family membership as a shared document Tenant (see [ADR-009](adr/ADR-009-account-tenant-family-entitlement.md), [SA-ARCH-014-03](Architecture/SA-ARCH-014_Account_Family_and_Entitlement_Architecture/SA-ARCH-014-03-Family_Entitlement_Architecture.md)). The architecture should never assume these three dimensions are correlated.

## 6. The Long-Term Platform Vision

SmartArchive becomes the layer between "a document exists" and "the right thing happens with it" — regardless of who owns the document, what system it originated in, what device someone is using to interact with it, or what industry that organization is in. Growth happens by adding capabilities to the shared Engine (per [SA-ARCH-011](SA-ARCH-011_Capability_Map.md)) and connectors/editions on top of it (per the still-open `B-EXT`), never by forking the core. Success looks like: a Home user, an Enterprise compliance officer, and a hospital records clerk are all using recognizably "the same SmartArchive," just surfaced differently for what they each need.

## 7. Relationship to the Technical Architecture

This document is deliberately upstream of, and independent from, [SA-ARCH-000](SA-ARCH-000_Master_Architecture.md): SA-ARCH-000 can be rewritten entirely (a new database, a new API framework, a new cloud provider) without this document changing a word, because this document never mentions technology. Conversely, if this document ever changes — if SmartArchive decided to, say, exit the Home market, or take on a product SmartArchive currently says it is *not* (§4) — that's the signal for a full re-evaluation of SA-ARCH-000 downstream, not the other way around. Technical architecture serves product vision; product vision should not be inferred backward from whatever the technical architecture happens to support today.

## Revision History

| Rev | Change |
|---|---|
| 1.0 | Initial authoring, added to Architecture Baseline v1.0 as its 7th constitutional document — the "North Star" the six technical/governance documents all ultimately serve. |
| 1.1 | Wave B minimal clarification (Founder authorization 2026-08-16), authority **ADR-009**: “household” / “family member” is audience language and does not imply a shared Family document archive. Product vision otherwise unchanged. |
