# SmartArchive — Master Project Context for Cursor & Copilot
## Version 1.0 — Working Context / Design & Architecture Phase
**Project:** SmartArchive  
**Engineering identity:** SmartArchive AI Platform v1.0 — Foundational Architecture  
**Product identity:** SmartArchive  
**Experiences:** SmartArchive Home (HSA) + SmartArchive Enterprise (ESA) + Public Website  
**Current phase:** Controlled visual/design reference evaluation — NO MAJOR UI CODING YET

---

# 1. PURPOSE OF THIS FILE

This file is the project context that Cursor, Copilot and other engineering/design assistants must read before making changes to SmartArchive.

It explains:

- what SmartArchive is;
- what the product is trying to become;
- the Home/Enterprise split;
- the shared architecture direction;
- the UX/design philosophy;
- the current visual-design process;
- the decision and approval rules;
- what is already established;
- what is still proposed/not frozen;
- what assistants may and may not change.

This is a working context document. It does NOT replace the official governed architecture documents.

**Account / Tenant / Family terminology** follows [ADR-009](../documentation/adr/ADR-009-account-tenant-family-entitlement.md) (Approved v1.1). Family is an entitlement, membership, and billing group. Family is **not** a Tenant, **not** an Organization, and **not** a shared document archive. Every Account has one private Personal Tenant. See also [SA-ARCH-012](../documentation/SA-ARCH-012_Domain_Model.md) and [SA-ARCH-013](../documentation/SA-ARCH-013_Product_Vision_and_Evolution.md).

---

# 2. PRODUCT IDENTITY

## 2.1 Product name

**SmartArchive**

## 2.2 Engineering/project name

**SmartArchive AI Platform v1.0 — Foundational Architecture**

This is the engineering/platform identity, not a replacement for the commercial product name.

## 2.3 Core idea

SmartArchive is an intelligent document and knowledge environment.

The product is not intended to be a generic file-storage application and not intended to be a generic AI chatbot.

The central promise is:

> **Documents are understood, organized and connected to useful action while the user remains confidently in control.**

The product combines:

- AI document understanding
- document explanation
- confidence/uncertainty communication
- source traceability
- voice-AI assistance
- reminders and timelines
- knowledge search
- workflow automation
- governance
- compliance
- security
- personal document archives and Family membership/entitlement (Family is not an Organization)
- enterprise knowledge management

---

# 3. PRODUCT EXPERIENCES

SmartArchive has one shared platform/core with two adaptive experiences.

## 3.1 SmartArchive Home — HSA

Audience:

- individuals
- families
- personal document users

Experience:

**Personal · Calm · Human · Simple · Reassuring · Accessible**

Experience principle:

> **Tell me what matters.**

Emotional promise:

> **“Now I understand what this means.”**

HSA should help people deal with:

- government letters
- bills
- contracts
- insurance
- school documents
- family documents
- reminders
- deadlines
- translations
- everyday document questions

HSA must NOT feel like a small enterprise dashboard.

---

## 3.2 SmartArchive Enterprise — ESA

Audience:

- companies
- organizations
- departments
- operations teams
- knowledge-heavy environments

Experience:

**Powerful · Precise · Analytical · Controlled · Traceable · Governed**

Experience principle:

> **Show me what matters and give me control.**

ESA should support:

- enterprise knowledge search
- document intelligence
- contracts
- invoices
- projects
- workflows
- approvals
- compliance
- governance
- security
- auditability
- human review
- operational intelligence

ESA must NOT simply be a dark version of HSA.

---

## 3.3 Public Website

The public website explains the product before login.

Core story:

> People have difficult documents → SmartArchive understands them → explains what matters → shows uncertainty honestly → the person stays in control.

The website may use stronger storytelling and photography than the application, but imagery must still support the product truth.

Avoid:

- generic AI robots
- AI brains used as decoration
- excessive holograms
- meaningless neon
- futuristic effects with no product meaning

---

# 4. SHARED PLATFORM ARCHITECTURE

The architecture direction is a shared SmartArchive platform with adaptive Home and Enterprise experiences.

Conceptually:

```text
                    SMARTARCHIVE
                         |
              SHARED PLATFORM / CORE
                         |
        +----------------+----------------+
        |                                 |
       HSA                               ESA
   SmartArchive Home              SmartArchive Enterprise
        |                                 |
 Personal/Careful                   Operational/Controlled
 UX + Documents                     Knowledge + Workflows
        |                                 |
        +---------------+-----------------+
                        |
                Shared Intelligence
                        |
      +-----------------+------------------+
      |                 |                  |
  Intelligence       Connect/Mode      Reminders
      |
  AI / Document Understanding
  Search / Extraction / Explanation
  Confidence / Source Traceability
  Workflow intelligence
```

The exact production service decomposition is governed separately by the architecture documentation and must not be invented by UI work.

---

# 5. SHARED ENGINE CONCEPT

The project documentation describes a shared engine containing:

- Intelligence
- Human/ACE
- Connect/Mode
- Reminders

The shared engine is intended to power both HSA and ESA while allowing different density, workflows and interaction patterns.

The Home and Enterprise experiences should therefore share:

- document authority rules
- confidence behavior
- source traceability
- AI-origin indication
- human-control principles
- typography
- icon language
- semantic states
- Weave/Confidence Thread language
- accessibility expectations
- multilingual support

---

# 6. CORE PRODUCT LOOP

Both products express the same fundamental loop:

```text
Document
    ↓
Understanding
    ↓
Explanation
    ↓
Confidence
    ↓
Relevant next action
```

HSA expresses this simply and personally.

ESA expresses it operationally, with control, review and governance.

---

# 7. HSA CORE JOURNEY

The agreed HSA journey is:

```text
Bring it in
    ↓
Understand it
    ↓
Know what matters
    ↓
Decide
    ↓
Reminder
    ↓
Timeline
```

Important HSA capabilities:

### Home / Dashboard
A calm overview of what needs attention.

### Document Understanding
The original document remains authoritative.
SmartArchive explains the meaning next to it.

### AI Assistant
A document-aware assistant, not generic chat.

### Timeline
A chronological document-life flow.

### Reminders
Supportive reminders for deadlines, contracts, bills and important events.

### Family View
A named HSA product/UI concept for Family **membership, entitlement, and management** (invitations, seats, billing entitlement). It is **not** a shared document repository and **not** a shared Organization/Tenant. Each Account retains its own Personal Tenant and private archive. Family membership does not merge archives. The Family Owner does not automatically access member documents, AI history, or private archives (ADR-009).

---

# 8. ESA CORE JOURNEY

The agreed ESA journey is:

```text
Search
    ↓
Understand
    ↓
Intelligence
    ↓
Confidence
    ↓
Human Review
    ↓
Workflow
    ↓
Governance
    ↓
Audit
```

Important ESA capabilities:

### Knowledge Search
Search across enterprise knowledge and return useful answers, not merely filenames.

### Document Intelligence
Classification, extraction, analysis, contracts, deadlines, risks and relationships.

### Workflow Command Center
Operational workflows, approvals, automation and human review.

### Governance
Roles, rules, permissions, transparency and controlled knowledge.

### Compliance
Compliance-oriented document processing and traceability.

### Security
Enterprise security and protection architecture.

---

# 9. PUBLIC WEBSITE / PRODUCT CONTENT PLAN

The current documented structure includes:

## Vision & Philosophy
- Why SmartArchive
- Calm × Human × Intelligence
- Documents as life flow
- Weave design system

## SmartArchive Home
- Calm Home
- Human Context
- Timeline
- Reminders
- Document Understanding
- AI Assistant
- Family View
- Home Footer
- Home Pricing

## SmartArchive Enterprise
- Knowledge Search
- Document Intelligence
- Workflow Command Center
- Governance
- Compliance
- Security
- Enterprise Footer
- Enterprise Pricing Sphere
- Enterprise Pricing Bridge

## Shared Engine
- Intelligence
- Human/ACE
- Connect/Mode
- Reminders
- Shared-engine visualization

## Pricing
- Home Pricing
- Enterprise Pricing
- Pricing comparison
- Pricing visual concepts

## Security & Trust
- Zero-Stress Document Life
- Privacy
- Encryption
- Compliance

## Use Cases
- Home
- Family (audience / household context — not a shared document archive)
- Small Business
- Enterprise
- Government
- Healthcare
- Education

## Final CTA
- Home CTA
- Enterprise CTA

This is a product/content structure, not permission to immediately code every page.

---

# 10. VISUAL DESIGN SYSTEM

## 10.1 Weave

The current production-design foundation uses **Weave** as the visual language.

Weave is not a single screen.

It is a rule system for screens.

Core metaphor:

> **A document is a node. Understanding is the thread to the next relevant thing — a deadline, related document, answer or action.**

The thread is also the connection between human decisions and AI suggestions.

AI is NOT represented as a human/robot character.

AI presence should be represented through the product's own thread/node language.

---

# 11. SHARED VISUAL DNA

The shared visual families are:

1. **Human × Intelligence**
2. **Document × Understanding**
3. **Organization × Intelligence**
4. **Confidence × Action**

HSA and ESA must clearly look like the same product family.

The adaptation is in:

- density
- structure
- tone
- amount of information
- workflow complexity

Not in inventing two unrelated design systems.

---

# 12. IMPORTANT VISUAL DIRECTION

Earlier exploratory references included:

- emerald green
- cosmic blue
- futuristic rooms
- holograms
- smart-home imagery
- robots
- space imagery

Those references are **exploration material, not automatically the final production design**.

The later Weave foundation deliberately corrected the visual direction:

### Avoid as default production language

- robot characters
- humanoid AI
- glowing AI faces
- purple/blue gradients as generic AI signals
- futuristic command centers without product purpose
- decorative AI imagery
- CGI used only because it looks futuristic

### Prefer

- real human contexts
- realistic documents
- meaningful document/data visualization
- subtle intelligence visualization
- the Weave thread/node language
- petrol/dark grounding with restrained accent colors
- calm, trustworthy surfaces

Do not silently revive an older visual direction merely because it looks impressive.

---

# 13. COLOR / BRAND NOTE

There are two historical visual directions in project material.

Earlier exploratory material used:

- Emerald Green `#00A86B`
- Graphite Gray `#2E2E2E`
- Solar Yellow `#FFD966`
- Cosmic Blue `#1E3A8A`
- White Mist `#F5F5F5`

The later Weave production foundation moves toward:

- petrol/deep grounding
- rose-copper
- thread-gold
- controlled semantic colors

Therefore:

**Do not invent a new palette.**

When implementing production UI, use the current approved Product Design System / Weave tokens in the repository rather than copying colors from exploratory AI-generated images.

If there is a conflict between an old visual reference and an approved design-system token, the approved design-system token wins unless the Founder explicitly reopens the decision.

---

# 14. TYPOGRAPHY / MULTILINGUAL

SmartArchive must support:

- English
- German
- Arabic

RTL is a first-class requirement.

The Weave foundation resolved the earlier typography issue using:

- Display: Cairo
- Body: IBM Plex Sans / Plex Sans Arabic
- Data/monospace: Cascadia Code

Production typography must follow the approved design system and must not introduce unrelated fonts without approval.

---

# 15. ACCESSIBILITY

Accessibility is part of the product architecture/design requirement.

The Weave foundation includes a WCAG 2.1 AA review and corrections.

Important principles:

- sufficient text contrast
- functional icons must remain accessible
- semantic colors must not be the only source of meaning
- keyboard/focus states
- touch targets
- RTL support
- responsive layouts
- reduced-motion support

Do not trade accessibility for visual effects.

---

# 16. CONFIDENCE RULE

This is a LOCKED product rule.

> **Confidence measures certainty only.**

Confidence must not be confused with source/provenance.

Do NOT use one visual language to communicate:

- “AI is uncertain”
and
- “this answer is not based on the document.”

These are different concepts.

Confidence is represented as:

- thread/bar visual
- semantic state
- plain-language explanation

Avoid fake-precise confidence percentages as the primary communication.

Examples:

- Mostly confident
- Some uncertainty
- Needs your review

The user must understand WHY the system is uncertain.

---

# 17. SOURCE / GROUNDING RULE

This is separate from confidence.

> **Source tracing identifies provenance only.**

Every AI-derived statement should be traceable to its source when the source exists.

For document understanding:

- original document = authoritative record
- AI explanation = commentary
- citation = source traceability

AI must not silently replace the source document.

---

# 18. ORIGINAL DOCUMENT RULE

The original document remains authoritative.

For single-document screens:

> expose the original/source inline in the same experience.

For list/queue views:

> the list may cite the source and provide a direct path to the source.

Do not create an AI explanation screen that makes the original evidence effectively disappear.

---

# 19. AI-ORIGIN RULE

AI-generated/suggested content must have one consistent AI-origin indicator.

Human-authored/confirmed content is the default.

AI suggestions are explicitly marked.

Do not create different AI-origin visual languages for HSA and ESA.

---

# 20. HUMAN CONTROL

SmartArchive AI should assist, not silently take consequential decisions.

HSA:

> AI suggests → person decides.

ESA:

> AI recommends → named human decides → decision is attributable/auditable.

Enterprise actions and approvals must not appear as anonymous “System” decisions when a human decision is required.

---

# 21. ONE PRIMARY STORYLINE PER SCREEN

Every major page should have one dominant user purpose.

Do not fill screens with unrelated cards merely because there is available space.

Especially for HSA:

- low density
- calm hierarchy
- one primary storyline
- clear next action

For ESA:

- higher density is acceptable
- but hierarchy and operational purpose must remain clear.

---

# 22. AI MUST BE HONEST

Never:

- invent document results
- invent users
- invent activity
- invent AI analysis
- invent confidence
- pretend future functionality exists
- manufacture data just to make a screen look impressive

If a future feature is visually represented before implementation, use an honest state such as:

- Preview
- Coming Soon
- Not Available Yet
- Connect Service
- No Data Yet
- Disabled

---

# 23. REFERENCE IMAGE RULES

Reference images are design evidence, not automatically final designs.

Extract:

- composition
- hierarchy
- atmosphere
- visual metaphor
- document treatment
- UI treatment
- colors
- typography
- photography
- illustration
- HSA/ESA suitability

Do NOT copy:

- generated text
- fake data
- impossible UI
- fake buttons
- nonexistent functionality

If an image has a strong idea but unrealistic implementation, preserve the design intent and translate it into technically real SmartArchive behavior.

Significant adaptations must be reported.

---

# 24. VISUAL DESIGN DECISION PROCESS

This is LOCKED.

```text
REFERENCE COLLECTION
        ↓
INDEPENDENT EVALUATION
        ↓
SCORING
        ↓
COMPARISON
        ↓
DISCUSSION
        ↓
FINAL SYNTHESIS
        ↓
5-PERSON VOTE
        ↓
MINIMUM 4/5 YES
        ↓
DESIGN FREEZE
        ↓
IMPLEMENTATION PACKAGE
        ↓
CODING
        ↓
BROWSER QA
        ↓
FOUNDER APPROVAL
```

### Five reviewers

1. Founder/User
2. ChatGPT
3. Claude
4. Copilot
5. Independent AI Reviewer #4

Minimum approval:

- 5/5 = unanimous
- 4/5 = approved
- 3/5 = revise
- 2/5 or less = reject

ChatGPT performs the final synthesis before the vote and must remain independent.

---

# 25. REFERENCE SCORING

Each reviewer evaluates 0–10 on:

1. Human/emotional connection
2. SmartArchive identity potential
3. Document intelligence
4. Trust/confidence/transparency
5. Calmness/clarity
6. HSA suitability
7. ESA suitability
8. Originality
9. Technical/UI adaptability
10. Long-term brand suitability

Also provide:

- overall /10
- KEEP
- REMOVE
- MODIFY
- ADAPT
- BEST USE
- RISKS

Do not select a style merely because one image looks attractive.

---

# 26. CURRENT VISUAL REFERENCE FOLDERS

The intended repository structure is:

```text
design/
└── visual-references/
    ├── 00-inbox/
    ├── 01-hsa/
    ├── 02-esa/
    ├── 03-website/
    ├── 04-shared/
    ├── 05-selected/
    ├── 06-rejected/
    ├── evaluations/
    └── decisions/
```

Rules:

- Keep originals unchanged.
- Never overwrite original references.
- Selected references retain source, date, scores, evaluations, modifications and final decision.
- Rejected references remain available for audit/history.

Suggested naming:

```text
SA-VIS-REF-001_HSA_human-documents.png
SA-VIS-REF-002_WEBSITE_document-flow.png
SA-VIS-REF-003_ESA_security-environment.png
```

---

# 27. CURRENT VISUAL STATUS

The project is currently in reference evaluation.

### Group 1 — HSA/Home

Received and being evaluated.

The current reference group contains examples around:

- human/document interaction
- family/document life
- upload → understand → control
- reminders
- translation
- AI assistance
- security/trust
- calm home environments

No final HSA visual style has been selected yet.

### Group 2 — ESA/Enterprise

Received and now entering evaluation.

Current examples include:

- trusted & secure
- enterprise pricing
- security/data-center visual language
- high-tech document environments

No final ESA visual style has been selected yet.

### Important

The images are candidates/reference material.

They are NOT automatically approved production designs.

---

# 28. PAGE DESIGN PROCESS

For every major page:

1. Define purpose
2. Define user experience
3. Define emotional experience
4. Create complete-page visual concept
5. Review
6. Propose justified modifications
7. Re-evaluate
8. 4/5 vote
9. Freeze
10. Implement only after sufficient pages are frozen

Do NOT start coding simply because a mockup looks good.

The goal is to reach agreement BEFORE implementation so that major redesigns later are avoided.

---

# 29. FIRST PRODUCT VISUAL MILESTONE

The two flagship screens establish the system:

### A. HSA Home Dashboard

Must establish:

- shared SmartArchive DNA
- HSA calmness
- navigation philosophy
- information density
- component language
- AI interaction
- confidence language
- imagery strategy
- responsive behavior

### B. ESA Enterprise Command Center

Must establish the same shared DNA but at enterprise density and operational complexity.

These screens are deliberately different in experience but related in product identity.

---

# 30. SECOND VISUAL MILESTONE

After the first two flagship directions are approved:

### HSA

1. Document Understanding
2. AI Assistant
3. Timeline / Reminders

### ESA

4. Universal Knowledge Search
5. Enterprise Document Intelligence
6. Knowledge Graph / AI Workspace

Further pages follow after the design grammar is proven.

---

# 31. PRODUCT PAGE CONCEPTS FROM THE DOCUMENTATION

### HSA

- Calm Home
- Human Context
- Timeline
- Reminders
- Document Understanding
- AI Assistant
- Family View
- Pricing
- Footer

### ESA

- Knowledge Search
- Document Intelligence
- Workflow Command Center
- Governance
- Compliance
- Security
- Pricing
- Footer

These are functional/content areas, not a mandate to build them all immediately.

---

# 32. WEBSITE VISUAL STORYTELLING

The website should show the transformation:

```text
Complex document
       ↓
SmartArchive understands it
       ↓
Meaning becomes clear
       ↓
Uncertainty is visible
       ↓
Relevant action becomes obvious
       ↓
User remains in control
```

Photography should show real human situations where possible.

For example:

- receiving an official letter
- family documents
- bills
- contracts
- school documents
- someone understanding a difficult document
- calm after the document becomes understandable

The visual story must be stronger than generic “AI technology” imagery.

---

# 33. DOCUMENTATION GOVERNANCE

Official SmartArchive documentation follows the project's documentation standards.

Core principles:

- Single Source of Truth
- version control
- professional review workflow
- governed storage
- document control
- approval
- English master + Arabic professional documentation where required

Official naming pattern:

```text
SA-<CATEGORY>-<NUMBER>_<Document_Name>_<Language>_v<Version>.docx
```

Important prefixes include:

```text
SA-FA     Foundation
SA-STD    Standards
SA-MAP    Project Maps
SA-PRD    Product Requirements
SA-SRS    Software Requirements
SA-ARCH   Architecture
SA-AI     AI
SA-SEC    Security
SA-API    API
SA-DB     Database
SA-TPL    Templates
```

---

# 34. DOCUMENTATION LIBRARY

The governed documentation map includes:

```text
00_Governance
01_Executive
02_Product
03_Architecture
04_AI
05_Backend
06_Frontend
07_Database
08_APIs
09_Integrations
10_Security
11_Cloud
12_DevOps
13_Testing
14_UI_UX
15_Data
16_Mobile
17_Website
18_Marketing
19_Sales
20_Investors
21_Legal
22_Presentations
23_Documentation
24_Assets
25_Research
26_Training
27_Releases
28_Archive
29_Templates
30_Branding
99_Temp
```

---

# 35. KEY OFFICIAL DOCUMENTS

Existing foundation documents include:

- SA-FA-001 — Foundational Architecture
- SA-STD-001 — Documentation Standards
- SA-MAP-001 — Documentation & Folder Map
- SmartArchive UI/UX Team Work Plan
- SmartArchive Visual Design Review & Implementation Working Agreement
- SmartArchive Weave Production Design Foundation

These documents should be consulted before making major architecture/design/documentation changes.

---

# 36. TEAM RESPONSIBILITIES

## Founder / Product Owner

Final decision maker.

Responsibilities:

- product vision
- business priorities
- final visual approval
- final architecture decisions
- acceptance/rejection
- real-world user/business perspective

The Founder does not need to solve implementation details unless they affect product behavior or business decisions.

---

## ChatGPT — Product / UX / Visual / Architecture Review Lead

Responsibilities:

- product UI/UX vision
- Home vs Enterprise adaptation
- shared visual language
- interaction principles
- page concepts
- information hierarchy
- user journeys
- AI interaction rules
- confidence/source behavior
- architecture consistency review
- review of implementation against approved concepts
- identify missing product/UX considerations
- final synthesis before visual vote

ChatGPT must remain independent and may disagree with Claude, Copilot or other reviewers.

---

## Claude — Implementation / Engineering Lead

Responsibilities:

- repository implementation
- reusable components
- responsive behavior
- browser testing
- accessibility checks
- performance
- integration
- implementation QA

Claude must NOT independently redesign an approved concept.

If engineering constraints require a significant visual change:

> stop → explain → propose → wait for approval.

---

## Copilot — Technical/UI Feasibility Reviewer

Responsibilities:

- technical feasibility
- frontend implementation feedback
- component/system feasibility
- implementation risks
- responsive and browser concerns
- code-level review when implementation begins

Copilot must not silently alter approved product direction.

---

## Independent AI Reviewer #4

Provides an independent visual/product critique during the reference evaluation.

---

# 37. IMPLEMENTATION WORKFLOW

When a page is approved:

```text
APPROVED VISUAL
      ↓
UX SPECIFICATION
      ↓
BEHAVIOR + STATES
      ↓
RESPONSIVE RULES
      ↓
COMPONENT MAPPING
      ↓
IMPLEMENTATION
      ↓
REAL BROWSER QA
      ↓
CHATGPT PRODUCT/ARCHITECTURE REVIEW
      ↓
FOUNDER APPROVAL
      ↓
FREEZE
```

---

# 38. DO NOT MAKE THESE CHANGES WITHOUT APPROVAL

Do not independently change:

- product architecture
- Brand Identity
- Weave visual foundation
- Product Design System
- HSA/ESA product positioning
- core journeys
- confidence rules
- source-traceability rules
- AI-human responsibility
- navigation philosophy
- approved page layouts
- major information hierarchy
- approved visual references

If a change is needed:

```text
IDENTIFY PROBLEM
→ EXPLAIN
→ PROPOSE
→ WAIT FOR DECISION
```

---

# 39. RESPONSIVE DESIGN

Production UI must work across:

- desktop
- laptop
- tablet
- mobile

The Weave foundation defines responsive behavior including:

- Enterprise sidebar behavior
- Home rail behavior
- centered/capped wide layouts
- responsive information density

Do not simply shrink desktop UI for mobile.

Responsive behavior must be designed deliberately.

---

# 40. MOTION

Motion should be quiet by default.

Use motion for meaning, not decoration.

The Weave foundation identifies:

- fast interaction transitions
- base transitions
- panel transitions
- a signature thread-drawing behavior during AI thinking

Respect:

```text
prefers-reduced-motion
```

Do not add decorative animations merely to make the interface look futuristic.

---

# 41. TECHNICAL IMPLEMENTATION PRINCIPLES

When implementation begins:

- inspect the existing repository first;
- preserve working functionality;
- reuse established architecture where appropriate;
- use reusable components;
- avoid duplicated page-specific code;
- avoid unnecessary dependencies;
- maintain modularity;
- test before reporting completion;
- verify in a real browser;
- check console errors;
- check responsive behavior;
- check accessibility;
- do not replace working architecture because a mockup looks different.

---

# 42. DATA INTEGRITY

Never use fake data in production.

For design/mockup work:

- fictional demo data is acceptable when clearly treated as demo content;
- government documents and sensitive-looking entities require extra care;
- do not imply fictional documents are real;
- legal/compliance-sensitive marketing imagery requires review before publication.

---

# 43. LEGAL / TRUST PRINCIPLE

SmartArchive deals with potentially sensitive personal and enterprise documents.

Therefore:

- privacy must be visible;
- security claims must be accurate;
- compliance claims must not be invented;
- AI limitations must be transparent;
- source traceability must be understandable;
- no misleading “100% accurate” AI language;
- no invented certifications or compliance status.

---

# 44. WHAT IS CURRENTLY LOCKED

The following working principles are locked unless the Founder explicitly reopens them:

1. HSA and ESA share one SmartArchive DNA.
2. HSA is human/calm/simple.
3. ESA is powerful/precise/controlled.
4. Confidence measures certainty only.
5. Source/grounding measures provenance only.
6. Original document remains authoritative.
7. Single-document experiences expose the source inline.
8. List/queue experiences may cite and link to the source.
9. One consistent AI-origin marker.
10. AI suggests; human remains in control.
11. ESA human decisions are attributable/auditable.
12. One primary storyline per screen.
13. No fake-precise AI confidence.
14. AI must say when it does not know.
15. No fake functionality/data.
16. DE/EN/AR + RTL are first-class requirements.
17. No major UI coding before design agreement.
18. Visual references must be evaluated before becoming design authority.
19. Minimum 4/5 approval for final visual direction.
20. Approved pages become frozen references.

---

# 45. CURRENT PROJECT STATUS

## Architecture

**Foundation established.**

The formal foundational architecture document defines the strategic foundation, architecture direction, AI, integrations, security/compliance, cloud strategy, business model and roadmap areas.

It is not permission to invent implementation details that are not yet formally specified.

## Documentation

**Foundation established and governed documentation structure exists.**

## Product

**HSA + ESA concept established.**

## Visual Design

**Active evaluation phase.**

## Group 1 HSA references

**Received — evaluation in progress.**

## Group 2 ESA references

**Received — evaluation beginning.**

## Design freeze

**NOT YET.**

## Major coding

**DO NOT START based only on reference images.**

---

# 46. CURRENT IMMEDIATE TASK

The immediate task is NOT:

> “Build all pages.”

The immediate task is:

```text
Collect all visual references
        ↓
Evaluate HSA
        ↓
Evaluate ESA
        ↓
Identify reusable visual grammar
        ↓
Modify promising concepts
        ↓
Create finalists
        ↓
Score finalists
        ↓
ChatGPT final synthesis
        ↓
5-person vote
        ↓
4/5 minimum approval
        ↓
Design Freeze
        ↓
Implementation Package
        ↓
Coding
```

---

# 47. ASSISTANT OPERATING RULE

When you open this project:

### FIRST

Read this file.

### SECOND

Inspect the relevant official project documents.

### THIRD

Check current repository status.

### FOURTH

Determine whether the requested work is:

- exploration
- evaluation
- approved design
- implementation
- QA
- architecture
- documentation

### FIFTH

Do not skip the approval stage.

If the Founder has not approved a visual direction:

> **DO NOT CODE THE MAJOR UI.**

---

# 48. HOW TO RESPOND TO A DESIGN REQUEST

If the Founder provides a reference image:

Do NOT immediately code.

Instead provide:

```text
Reference ID
Purpose
Positive points
Negative points
KEEP
REMOVE
MODIFY
ADAPT
Best use
Risks
10-category score
Overall score
Recommendation
```

Then wait.

---

# 49. HOW TO RESPOND TO “NOT GOOD ENOUGH”

Interpret:

> “Not good enough”

as design evidence.

Do not defend the previous design.

Do not try to force acceptance.

Identify what failed:

- identity
- hierarchy
- emotion
- usability
- trust
- density
- imagery
- architecture
- implementation realism

Then propose a better direction.

---

# 50. FINAL PRODUCT PRINCIPLE

The goal is NOT:

> “Make SmartArchive look futuristic.”

The goal is:

> **Make SmartArchive feel like an intelligent, trustworthy environment where documents are understood and the user remains confidently in control.**

Beautiful is not enough.

Technically possible is not enough.

AI-looking is not enough.

The final product must be:

**Distinctive + Human + Intelligent + Trustworthy + Clear + Adaptable + Accessible + Implementable.**

---

# 51. IMPORTANT DISTINCTION: EXPLORATION VS APPROVAL

Every visual item has one of these states:

```text
EXPLORATION
    ↓
CANDIDATE
    ↓
SHORTLIST
    ↓
FINALIST
    ↓
APPROVED
    ↓
FROZEN
    ↓
IMPLEMENTED
    ↓
QA VERIFIED
```

Never treat:

- exploration as approval;
- AI-generated image as production truth;
- mockup as implemented functionality;
- implemented page as automatically approved.

---

# 52. FINAL INSTRUCTION TO CURSOR / COPILOT

You are joining an existing project with established decisions.

Do not behave as if you are starting a new generic SaaS project.

Do not optimize for speed by skipping product decisions.

Do not make large design changes because you personally prefer them.

Do not create “better looking” alternatives without explaining the product reason.

Do not implement features that are not established.

Do not invent architecture.

Do not invent data.

Do not silently change approved design.

When uncertain:

> **Stop → explain the uncertainty → propose options → wait for approval.**

SmartArchive is being built deliberately.

The priority is:

**Correct product direction first.  
Approved design second.  
Engineering third.  
Optimization after correctness.**

---

# 53. SOURCE / AUTHORITY ORDER

When information conflicts, use this order:

1. Explicit Founder decision
2. Approved/frozen SmartArchive design decision
3. Current official architecture/design documents
4. Current Product Design System / Weave foundation
5. Current repository implementation
6. Exploratory references
7. General AI assumptions

Never use an older exploratory image to override an explicit newer decision.

---

# 54. QUICK CONTEXT FOR NEW AI SESSIONS

If an AI assistant only has time to read one section, understand this:

> SmartArchive is an intelligent document and knowledge platform with two adaptive experiences: SmartArchive Home (HSA) for individuals/families and SmartArchive Enterprise (ESA) for organizations. Both share one platform and one visual/product DNA.
>
> “Individuals/families/households” is audience language. Architecturally, Family is an entitlement/membership/billing group (ADR-009), not a shared Organization or shared document archive. Each Account has a private Personal Tenant. Family entitlement does not automatically apply to ESA.
>
> HSA is calm, human, simple and document-centered. ESA is powerful, precise, analytical and controlled.
>
> The core product loop is Document → Understanding → Explanation → Confidence → Relevant action.
>
> The original document remains authoritative. Confidence communicates certainty; source/grounding communicates provenance. AI suggestions are explicitly marked. AI assists; humans remain in control. Enterprise human decisions are attributable and auditable.
>
> The visual language is Weave: document nodes connected by meaningful threads representing understanding, action and human/AI interaction.
>
> Major UI work must NOT begin before visual/design agreement. Reference images are evaluated, scored and discussed before becoming production references. Final visual approval requires at least 4 of 5 reviewers. After approval, the design is frozen and only then implemented.
>
> Never invent data, functionality, architecture or AI certainty. Never silently redesign an approved direction.
>
> The final goal is not futuristic appearance. The goal is an intelligent, trustworthy environment where documents are understood and the user remains confidently in control.

---

## END OF MASTER PROJECT CONTEXT

---

# HSA GROUP 1 — VISUAL REFERENCE DECISION

**Reference Package:** SmartArchive_HSA_Group1_Visual_Reference_Pack_v1.0  
**Status:** Controlled Reference Package  
**Date:** 2026-08-15

## Approved HSA Visual Direction

The HSA Group 1 evaluation established the following visual direction:

### HSA-01 — Calm Home
**Score:** 9.4/10  
**Decision:** YES

Use as a primary visual reference for:
- calm home environment
- human-centered presentation
- natural lighting
- personal document context
- emotional comfort
- trustworthy everyday experience

### HSA-02 — Family / Real Documents
**Score:** 7.9/10  
**Decision:** NO as a primary reference

Useful principles may be retained conceptually:
- real people
- real documents
- family context
- everyday document interaction

It is not an approved primary visual reference.

### HSA-03 — How It Works
**Score:** 8.9/10  
**Decision:** NO as a primary reference

Useful conceptual principle:
- simple document → understanding → action flow

Do not treat the generated visual treatment itself as an approved SmartArchive design.

### HSA-04 — SmartArchive Ecosystem
**Score:** 9.4/10  
**Decision:** YES

Use as a secondary HSA visual reference for:
- SmartArchive ecosystem concept
- family/document context
- assistance
- reminders
- translation
- connected document experience

### HSA-05 — Futuristic Archive
**Status:** No photo available  
**Decision:** Not evaluated / no visual approval

---

## Governance Rule

The approved references define **visual direction and inspiration only**.

They do NOT authorize:
- new product requirements
- new UI components
- new architecture
- new features
- new pricing
- implementation changes
- automatic design decisions

Any implementation must continue to follow the Master Architecture, Human Constitution, Weave Design System, and existing project requirements.

**Reference images are evidence of approved visual direction, not implementation specifications.**
