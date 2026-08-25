# SA-UI-STRATEGY-001
## SmartArchive Unified UI Creation & Implementation Strategy

| Field | Value |
|---|---|
| Document ID | SA-UI-STRATEGY-001 |
| Title | SmartArchive Unified UI Creation & Implementation Strategy |
| Version | **1.0** |
| Status | **OPERATING STANDARD — Founder-approved 2026-08-24.** Standing procedure for all future UI work, reconciled against the joint Claude/ChatGPT/Cursor/Founder discussion and independently verified against the live repository before this approval. This file does **not** by itself authorize product UI implementation — that still requires its own work package and gates under the process defined here. |
| Date | 2026-08-24 |
| Owner | Founder |
| Classification | Internal |
| Authority | Founder authorization to write and reconcile this file after Claude, ChatGPT, and Cursor discussion; frozen as Version 1.0 by explicit Founder authorization following that reconciliation. Product UI still requires its own work package and gates. |
| Path | `documentation/Standards/SA-UI-STRATEGY-001.md` |
| Related — independently verified against this repository during reconciliation | `documentation/UX/SA-UX-009_Main_UI_Foundation/`, `documentation/adr/ADR-002-multi-tenancy.md`, `ADR-004-authorization.md`, `ADR-009-account-tenant-family-entitlement.md`, `documentation/Auth/SA-AUTH-001_.../`, `SA-AUTH-002_.../`, `AI_CONTEXT/SA-DESIGN-HSA08-CONSOLIDATED-DIRECTION-001.md` |
| Related — cited but not an authority | `documentation/Standards/SA-STD-006_UI_Standards/SA-STD-006-00-README.md` exists but is currently an **empty (0-byte) placeholder**, not established content — retained as a pointer for where UI standards content will eventually live, not as a source this document draws from |
| Deferred | AI-COS project overlay (separate future file). Do not infer it from this document. |

**Do not create `PAGE_BUILD_STRATEGY.md` or a second copy of this procedure.**

**This document does not authorize Page 4, `/app` redesign, or any product UI change.** It defines how that work must be executed when Founder opens a work package.

---

## 1. Purpose

Page 1 shipped once, clean. Pages 2 and 3 looped because implementation started before visual direction was locked, chat was used as memory, and “reported done” substituted for independent verification.

**Central principle**

> The AI must never discover the visual design while implementing the UI.

Correct sequence:

**UNDERSTAND → DEFINE → DESIGN → SIMULATE → APPROVE → PRODUCE ASSETS → VALIDATE → IMPLEMENT → VERIFY → FREEZE**

Forbidden sequence:

**IDEA → code → screenshot → patch → screenshot → patch**

---

## 2. Scope

Applies to: SmartArchive public website, `/app`, future product modules, UX redesigns, new features, and any AI or human occupying the seats below.

Reusable on other products via a **project overlay**. SmartArchive rules are **Appendix A** in this file. AI-COS is a future separate overlay — not drafted here.

---

## 3. Governance & Roles

### 3.1 Authority ≠ responsibility ≠ capability

- **Capability** — what a role *can* do (generate an image, open a URL).
- **Responsibility** — what a role is *expected* to produce.
- **Authority** — who may *accept* a result as final.

Capability or responsibility never grants approval authority.

### 3.2 Authority ladder

| Verb | Who | Meaning |
|---|---|---|
| **DECIDE** | Founder only | Approve direction, assets, implementation; accept notes; freeze; reopen; override any AI; resolve disputed work-level classification |
| **RECOMMEND** | ChatGPT | Process, synthesis, one visual direction, conflict-solving between AI *proposals*. Never a freeze. Never a gate pass. |
| **AUDIT** | Claude | Independent check of claims vs source vs live. Output is **evidence + recommendation**, never approval. May not implement. May not freeze. |
| **IMPLEMENT** | Cursor, or a human in this seat | Production code, integration, tests, technical runtime proof. May not redesign. May not self-certify visual truth for its own package. |
| **RECORD** | Work-package folder | Memory. Chat is transport, not authority, once a Founder-signed document exists. |

**Unanimous AI agreement is not approval.** If all three AIs agree and Founder has not signed, the phase is not closed.

ChatGPT recommends. Claude challenges. Cursor reports. **Founder approves.**

### 3.3 One hat per work package

The Implementer of a package cannot be the independent visual verifier of that same package.

If Claude is asked to “just patch the CSS,” Claude has become Implementer for that change and may not write that package’s verification record. If ChatGPT produces production UI, ChatGPT is Implementer for that package and loses RECOMMEND-as-authority on it.

### 3.4 Role ownership

| Role | Owns | Does not own |
|---|---|---|
| **Founder** | Product promise, honesty labels, design/asset/live approval, freeze, reopen, disputed classification | Reconstructing history from chat |
| **ChatGPT** | Strategy, work-package architecture, one proposed direction, “which phase are we in” | Frozen system architecture (ADRs, AUTH, milestone gates); production React; any freeze |
| **Claude** | Read-only audit, design/process critique, independent verification, catching “reported done” vs bytes | Implementation; new visual directions unless Founder asks; declaring Founder approval; writes to shared infra without permission |
| **Cursor** (or human Implementer) | Phase 8 technical verification (source vs served), implementation from a locked packet, tests for this package, listing out-of-scope dirty files | Art direction; classifying its own work level; treating generated assets as approved; writing independent verification; freezing |
| **Repository folder** | The only memory AIs may treat as true once Founder-signed | Git commit (separate Founder act) |

### 3.5 AI-to-AI disagreement

> When two AI roles disagree on a material fact, neither resolves it by persuasion or by silently changing its report. Both positions and their evidence go to Founder **unchanged**. Founder decides.

Applies especially to: source vs runtime, design compliance, asset compliance, technical claims, scope. Goal is **truth, not consensus**.

### 3.6 README is Founder-controlled

`00-README.md` is mandatory on every Level 2 and Level 3 package. It states: ID, one-sentence job, current phase, approval state, frozen / allowed / forbidden, production mode, next action and owner.

- Body text: role that owns the current phase.
- `APPROVED` / `FROZEN` / `REOPENED`: **Founder only**.
- README vs chat disagreement: **stop**. Founder points at the file.

### 3.7 Vacancy

- No Claude → independent visual check still required (Founder or another non-implementer). Skip forbidden.
- No ChatGPT → Founder + Claude may lock the brief; Cursor may not invent strategy or direction.
- No Implementer named → no production UI code.

### 3.8 Auditor evidence boundary

> AUDIT = evidence + recommendation, never approval.

Claude may say: “I found X. Here is the check/value proving X.” Claude may not say: “Approved.”

### 3.9 Auditor write-access

> Audit-support does not grant write permission.

`launch.json`, Docker, env, compose, another role’s files: explicit Founder permission first. Reading ≠ permission to modify. Reverse also holds: Cursor does not “fix” auditor tooling without asking.

### 3.10 Retraction

> The burden of proof for retracting a finding is the same as for raising it.

State what was re-checked, at which URL/viewport, and why the first check was wrong.

### 3.11 Evidence outranks confidence

Neither Cursor’s confidence, Claude’s confidence, ChatGPT’s reasoning, nor Founder’s assumption is evidence by itself.

- Objectively testable → reproducible evidence wins (computed color, file metadata, served bytes).
- Inherently subjective → Founder wins (“does this feel right”).

### 3.12 Stop authority

**Any role may stop. Only Founder may resume.**

---

## 4. Work Levels

How much process is required. Independent of problem classification (Section 8).

| Level | Name | Typical work | Workflow |
|---|---|---|---|
| **1** | Micro | Typo, existing token, spacing, known overflow, broken route | Identify → Implement → Verify → Close |
| **2** | Feature / Component | New card, interaction, module, structural change on an existing page | Audit → UX → Direction → Approval → Implement → Verify |
| **3** | Major UI | New page (Page 1/2/3 class), major redesign | Full lifecycle, Section 6 |

**Who classifies:** ChatGPT proposes at Intake → Claude may place a **VETO / ESCALATION RECOMMENDATION** with specific evidence → Founder decides if disputed.

**Cursor never classifies its own work level.**

Claude’s VETO / ESCALATION RECOMMENDATION is **not** a Founder veto. It remains active until Founder explicitly overrides it in the README. Only Founder can override it. It does not expire automatically.

### 4.1 Per-level matrix

| | Level 1 Micro | Level 2 Feature | Level 3 Major UI |
|---|---|---|---|
| **Entry** | One TECHNICAL fact on an existing pattern | New component / structure on an existing page | New page or major redesign |
| **Documents** | Entry in `documentation/UX/SA-UI-MICRO-LOG.md` *(PROPOSED — NOT LOCKED, see note below 4.1)* | Reduced package + `00-README.md` | Full `documentation/UX/SA-UI-[ID]/` *(PROPOSED — NOT LOCKED)* |
| **Gates** | No design approval gate — because Level 1 is **forbidden** from introducing design change. If audit finds hierarchy, composition, user promise, or any other design dimension, Level 1 **immediately escalates**. | One design gate before code | Phases 5, 6, 10 (four-state vocabulary) |
| **Production mode** | None (no new visual invention) | One mode if visual; simulate if layout is new | Design direction + production mode required |
| **Verify** | Reproducible value + source = served for **that** claim. Verifier field required to Close. | Phase 8 + independent check of the change | Phases 8 → 9 → 10 |
| **Stop if** | Feel / hierarchy / photography / new section / honesty change | Definition of Ready blank; CONCEPT-SCENE across a whole page | Second Level 3 *implementation* starts while first is open |

**Note on the `documentation/UX/` path (PROPOSED — NOT LOCKED)**: the exact folder location for work-package documents was never explicitly agreed in the joint Claude/ChatGPT/Cursor discussion. `documentation/UX/` was independently verified during reconciliation to be a real, established directory already holding `SA-UX-001` through `SA-UX-009`, so placing `SA-UI-[ID]/` and `SA-UI-MICRO-LOG.md` there is a reasonable, non-fabricated inference consistent with existing repository structure — not an invented path. It is kept as a proposal pending explicit Founder confirmation, not stated as already-agreed.

### 4.2 Level Escalation

Classification at Intake is **provisional**. Audit may **escalate** with evidence (Level 1 → 2 or 3). Escalation is a normal, expected transition — not a process failure. Nobody is penalized for it. Implementation **stops** when the new level’s boundary is crossed.

**De-escalation is Founder-only**, recorded in README. Audit and Cursor must not reduce process so coding can start.

### 4.3 Level 1 Close rule

`SA-UI-MICRO-LOG.md` separates **Implementer** from **verifier** on every entry.

Verifier field values: `pending` | `no objection` | `VETO/ESCALATION: <evidence>`.

Silence is not a veto and not a pass. A clearly TECHNICAL micro (typo, named token) may start while `pending`. The entry does not **Close** until the verifier field is filled. If Claude never saw it, it stays `pending` — Founder may Close as verifier, or wait.

### 4.4 Level 2 static simulation

Skip static HTML **only** when reusing an existing **approved** on-screen pattern under **PRODUCT-UI-FIRST** or **COPY/EDITORIAL**. Any new composition or layout requires static simulation first.

---

## 5. Production Modes

**Design direction** = what the surface should communicate and feel like (one approved direction).  
**Production mode** = how it is physically built (mechanism, not a competing design).

Official modes:

- **PHOTO-FIRST** — approved photography is the primary visual
- **PRODUCT-UI-FIRST** — reuses real `/app` (or equivalent) components
- **CONCEPT-SCENE** — hand-built CSS/SVG for a not-yet-shipped capability. On Level 3: **one section per pass**, never a whole page in one sitting
- **COPY / EDITORIAL** — type and layout; no imagery as the story
- **SVG / DIAGRAM** — illustrative, non-photographic

Every Level 3 package (and any Level 2 that touches visual design) states both before implementation:

```text
DESIGN DIRECTION: [one approved direction]
PRODUCTION MODE: [one mode from the list; per section if mixed]
```

Do not propose multiple *looks* unless Founder explicitly asks for alternatives.

---

## 6. Lifecycle (Level 3)

```text
0   INTAKE
1   AUDIT
2   PRODUCT / UX DEFINITION
3   VISUAL DIRECTION
4   STATIC SIMULATION
5   FOUNDER DESIGN GATE
6   ASSET PRODUCTION & ASSET GATE
7   IMPLEMENTATION
8   TECHNICAL VERIFICATION
9   INDEPENDENT VISUAL VERIFICATION
10  FOUNDER FINAL GATE
11  FREEZE & ARCHIVE
```

Level 2 uses a compressed form of the same order. Gates are merged only when separate documents would be theater — they are not skipped. Level 1 skips design/asset phases because it is forbidden to touch them.

Static simulation is HTML/CSS only. Not React, not Docker, not token-inheritance debugging. If the design can only be judged inside the live app, implementation has started too early.

---

## 7. Stage conditions

| Phase | Entry | Output | Exit proves | Stop if |
|---|---|---|---|---|
| 0 Intake | Founder request | `00-BRIEF.md` | Objective, constraints, frozen areas, assets/system named; **provisional** work level | Objective undefined |
| 1 Audit | Brief exists | `01-AUDIT.md` sorted A–E (good / design / technical / missing asset / product decision) | Every finding classified; work level confirmed or escalated | Cannot reach source or live — say so; do not infer |
| 2 UX / Product | Audit complete | `02-UX-STRATEGY.md` | Every UI claim labeled REAL / DEMO / CONCEPT | Implied capability that is not real and not labeled |
| 3 Visual Direction | UX defined | `03-VISUAL-STRATEGY.md` | One direction + production mode(s); section table | Multiple directions without Founder asking |
| 4 Static Simulation | Direction exists | Static HTML/CSS | Founder can judge without React/Docker | Simulation requires the live app |
| 5 Founder Design Gate | Simulation delivered | Four-state decision (Section 12) | Recorded in README | — |
| 6 Asset Production & Gate | Design approved | Assets + contact sheet + crop check + Founder asset approval | Every asset traceable; no silent substitution | Approved asset missing and no explicit no-photo rule |
| 7 Implementation | Definition of Ready met | Working code + `06-IMPLEMENTATION-REPORT.md` | Files changed / not changed; scope held | Any DoR field blank |
| 8 Technical Verification | Implementation exists | tsc / lint / tests for **this** package; source vs served | Served bytes match source — not HTTP 200 alone | Served ≠ source |
| 9 Independent Visual Verification | Phase 8 exists | `07-VERIFICATION-LOG.md` + `07-VERIFICATION.md` by a non-implementer | Claims as values; Phase 8 spot-re-verified | Live unverifiable and no backup (3.7) |
| 10 Founder Final Gate | Phase 9 delivered | Four-state decision | Recorded | — |
| 11 Freeze & Archive | Final approval | `08-CHECKPOINT.md` | README `FROZEN` by Founder | — |

---

## 8. Problem classification

**Work level** = how much process. **Problem type** = what kind of problem. Independent axes.

A Level 1 request can become a Level 3 DESIGN problem. A Level 3 page can still contain a Level 1 TECHNICAL defect during verification.

| Type | Examples | Routes to |
|---|---|---|
| **PRODUCT** | Feature does not exist; wrong user promise; unclear responsibility | Phase 2 |
| **UX / DESIGN** | Feels empty; weak hierarchy; wrong photography; “doesn’t feel like Page 1” | Phase 3 |
| **TECHNICAL** | Overflow; wrong token; TS error; broken route; stale runtime | Stay in Phases 7–8 |
| **ASSET** | Wrong subject; missing crop; wrong aspect ratio; non-fictional content | Phase 6 |
| **CONTENT / HONESTY** | REAL / DEMO / CONCEPT missing or false; invented claim | Phase 2 |
| **INFRASTRUCTURE** | launch config, Docker, env, ports, another role’s tooling | **STOP.** Writes only with explicit Founder permission (3.9) |

**“I’ll just fix it in CSS” is banned** as a response to DESIGN, PRODUCT, ASSET, CONTENT/HONESTY, or INFRASTRUCTURE.

---

## 9. Definition of Ready (Phase 7 entrance ticket)

If any field is blank, the Implementer **stops** and returns the packet. It does not “try.”

- Founder Phase 5: `APPROVE`, or `APPROVE WITH NOTES — DEFERRED`. `APPROVE WITH NOTES — BLOCKING` must already be resolved at this same gate.
- Frozen section order
- Every visual slot named with production mode
- Assets on disk at exact approved paths, **or** an explicit no-photography decision
- Honesty per element: REAL / DEMO / CONCEPT
- Do-not-touch list (pages, tokens, architecture)
- Copy source (locale keys or approved English)
- Authoritative runtime (host, port, how to prove the served bundle is current)
- Responsive targets (1280 / 768 / 375 unless the package names others)
- Scope — exact files that may change

---

## 10. Asset governance

- Method named before generation (who/what, reference, negative-prompt / fictional-content rules).
- Exact list: filename, shot, fictional constraints, **aspect ratio and pixel target** (not only a resolution floor).
- Order every time: **Generate → Contact Sheet → Crop Validation → Founder Approval**. Crop validation is an actual cropped file checked against the frame (face / hands / text survive), not a description of a future crop.
- No silent substitution, including reuse of another page’s asset without a fresh approval.
- Fictional content checked explicitly: no real institution names, seals, case numbers, or identifiable people — including generated text that might be legible.
- **Generation capability is not approval.** Cursor (or anyone) generating an image still goes through this gate.

Phase 6 does **not** default to “Claude generates, Cursor implements.” Claude does not generate images unless a package explicitly says otherwise.

---

## 11. Verification model

### 11.1 Three truths

A package is not done unless all three agree:

1. **Source truth** — what the files contain.
2. **Served truth** — what Docker/Vite actually delivers. `docker restart` is not proof. HTTP `200` is not proof. Check `Content-Type` and byte size/hash. A SPA fallback can return `200` / `text/html` for a missing path.
3. **Visual truth** — what renders and what Founder sees. DOM / computed-style / network checks prove correctness (color, position, text). They do not prove “looks composed.” Founder owns that.

### 11.2 Evidence is a value, not a verdict

> A claim is not verified until another party can reproduce a **value**.

“Tests passing,” “live,” “matches spec” are verdicts.  
`page2Visuals.tsx:203` contains `text-accent-2`; live element computes `rgb(...)` at 1280px; 113/117 tests pass and the 4 failures are named files unrelated to this package — these are values.

### 11.3 Phase 8 vs Phase 9

Phase 8 is the Implementer’s technical proof. It is **not** accepted as already proven. Phase 9 spot-re-verifies load-bearing Phase 8 claims (served vs source, the specific values).

### 11.4 Verifier capability disclosure

Phase 9 states what could and could not be checked **before** conclusions.

- Live unreachable → `LIVE UNVERIFIABLE`, not “looks fine from the report.”
- Tool quirks named (Appendix A). Do not report a tool artifact as a product defect.
- Unrelated dirty-tree failures are listed separately. They are not this package’s failure.

---

## 12. Founder approval gates — LOCKED vocabulary

| State | Meaning | Next |
|---|---|---|
| **APPROVE** | Clean approval | Next phase |
| **APPROVE WITH NOTES — BLOCKING** | Gate not closed | Return to the **same** gate once, correct, re-present. Not implementation. |
| **APPROVE WITH NOTES — DEFERRED** | Baseline approved; note is future refinement | Freeze baseline; record note in checkpoint; no immediate work |
| **REJECT** | Does not hold | Return to owning phase (Section 8). Not a CSS patch. |

If one Founder message mixes blocking and deferred notes without labels: treat the **whole gate as BLOCKING** until Founder splits the list.

---

## 13. Change control / no-drift

Once Founder approves a direction:

> No AI may reinterpret the approved design without explicit Founder authorization.

**STOP → REPORT → CLASSIFY → ASK**

| Discovery mid-build | Action |
|---|---|
| TECHNICAL | Stay in implementation; fix; continue |
| UX / DESIGN | Stop → Phase 3 |
| PRODUCT or CONTENT / HONESTY | Stop → Phase 2 |
| ASSET | Stop → Phase 6 |
| INFRASTRUCTURE | Stop → Founder permission |

---

## 14. Documentation and repository memory

### 14.1 Level 3 / Level 2 folder

```text
documentation/UX/SA-UI-[ID]/
├── 00-README.md
├── 00-BRIEF.md
├── 01-AUDIT.md
├── 02-UX-STRATEGY.md
├── 03-VISUAL-STRATEGY.md
├── 04-PRODUCTION-PLAN.md
├── 05-ASSET-APPROVAL.md
├── 06-IMPLEMENTATION-REPORT.md
├── 07-VERIFICATION-LOG.md      running evidence history
├── 07-VERIFICATION.md          final values summary
└── 08-CHECKPOINT.md
```

Level 1 uses only `documentation/UX/SA-UI-MICRO-LOG.md` (created when first used; Implementer and verifier fields on every row).

### 14.2 Who writes what

| File | Writer |
|---|---|
| `00-BRIEF`, synthesis of `02`–`04` | ChatGPT with Founder |
| `00-README` body | Role that owns the current phase; status fields Founder-only |
| `01-AUDIT`, `07-VERIFICATION-LOG`, `07-VERIFICATION` | Claude (or other non-implementer) |
| `06-IMPLEMENTATION-REPORT` | Cursor / Implementer |
| `05`, Phase 5 / 10 signatures, `08-CHECKPOINT` freeze | Founder |

`06` must include: files changed, files explicitly not changed, URL and port, how the bundle was proven fresh, commands run, viewport checks, out-of-scope dirty files, known notes.

### 14.3 Document authority switch

After Founder has approved a document in the package, **that file overrides chat** for what it covers. Unsigned drafts do not. If signed file and chat disagree: stop. Founder points at the file.

Commit remains a separate Founder act. An uncommitted folder in the working tree is still working truth for AIs until Founder says otherwise.

### 14.4 Locale

**English-first freeze.** Translation is a separately identified Level 1 or Level 2 package unless Founder explicitly requires multilingual release together. Silent English-only UI while seven locale files exist is drift — name the follow-on package in the checkpoint.

---

## 15. Handoff protocol

The handoff object is the **folder** (or Micro log row), not a forwarded novel. If a chat is forwarded, it must cite document IDs.

| From | To | Hands over | Does not |
|---|---|---|---|
| Founder | ChatGPT | Goal, constraints, freeze/reopen | Code |
| ChatGPT | Claude | Brief + audit questions | Implementation |
| Claude | Founder | `01-AUDIT` A–E, product decisions needed | Design alternatives unless asked |
| Founder | ChatGPT | Answers to those decisions | “Pick a look” |
| ChatGPT | Founder | One direction + static simulation | Multiple design options |
| Founder (Phase 5) | Implementer | Approved sim, assets, `00`–`05` | “Make it nicer” |
| Implementer | Claude | Live URL + `06` | Self-approval of look |
| Claude | Founder | `07` vs approved design | A new redesign |
| Founder (Phase 10) | All | FREEZE or return to Phase 3 | CSS patching as the next step |

---

## 16. Escalation and stop rules

Any role may stop. Named stops:

- Definition of Ready has a blank field
- Asset brief exists, approved file does not
- Implementation would invent a screen not in the live product and label it REAL
- Frozen page or milestone-gated area without a new Founder wave
- Relevant Founder gate not passed
- Runtime not proven authoritative
- Visual target changed mid-build
- Request is “improve the design” without Phases 3–5
- Two Level 3 **implementations** active (Section 17)
- INFRASTRUCTURE write without permission

---

## 17. Work-package isolation

> A Level 3 UI work package must be completed or explicitly paused before another Level 3 **implementation** begins.

A Level 1 fix on a different page may run. Planning or audit on a second Level 3 while the first is between gates is allowed. Starting a second Level 3 implementation while the first is open is not.

Do not open Page N+1 implementation in the same session as Page N’s freeze.

---

## 18. Definition of Done

All must be true:

- Source, served, and visual truth agree
- Every verification claim is a reproducible value
- Phase 9 spot-re-verified Phase 8’s load-bearing claims
- No open BLOCKING notes
- Founder Phase 10 decision recorded
- `08-CHECKPOINT.md` exists (approved design, assets, implementation summary, verification summary, DEFERRED notes, frozen boundaries, locale follow-on if any)
- README status `FROZEN` set by Founder

---

## 19. Unresolved / Proposed-not-locked (explicitly outside this reconciliation)

1. **AI-COS project overlay** — separate future file. Do not infer it from SmartArchive pages or this session.
2. **`documentation/UX/SA-UI-[ID]/` and `SA-UI-MICRO-LOG.md` as the fixed work-package location** (Section 4.1) — a reasonable, repo-verified inference, not an explicitly jointly-agreed decision. Marked PROPOSED — NOT LOCKED at point of use.
3. **The three operational templates** (README status block, implementation packet, Micro log row) — drafted by Cursor, not individually reviewed by the group. Marked PROPOSED — NOT LOCKED at point of use.

All ten of the 2026-08-24 policy decisions on Governance and Work Levels are incorporated above and are locked, not proposed.

---

## 20. Lessons learned (named failure modes)

**Implementer / runtime**

- **Status-as-proof** — `restart` + HTTP 200 reported as current when served bytes were stale.
- **SPA-200 trap** — deleted path still `200` / `text/html`.
- **Wrong gap flagged** — resolution disclosed; aspect-ratio miss against the crop table was not.
- **Verdict without a value** — “passing / live / matches spec” required a second check.

**Auditor**

- **Environment contamination** — leftover browser theme reported as a contrast bug; retracted after reset.
- **Tool quirk as defect** — `loading="lazy"` in an automated pane; same pattern on already-approved Page 1.
- **Infra write without reading first** — `.claude/launch.json` overwritten to support audit, destroying existing entries.

**Systemic**

- Implementation before locked visual direction (Page 2 root cause).
- Design problems treated as CSS bugs.
- Chat used as memory; parties recalled different freezes.

---

## Appendix A — SmartArchive overlay

These bind this strategy to SmartArchive. They do not replace frozen architecture.

Every row below except the last two was independently verified against the live repository during reconciliation, not carried over from Cursor's draft unchecked.

| Topic | Rule |
|---|---|
| Visual language | HSA-08 direction A ("Weave Thread/Node") + C ("Document Marginalia/Annotation") is frozen — verified in `AI_CONTEXT/SA-DESIGN-HSA08-CONSOLIDATED-DIRECTION-001.md` (this is the correct file; an earlier draft of this document cited `SA-DESIGN-HSA08-FREEZE-001`, which does not exist under that exact name — the closest match on disk is `AI_CONTEXT/SA-DESIGN-HSA08-FREEZE-001(1).md`, an oddly-suffixed duplicate, not the canonical source). AI is understanding/connection, not a person. Human decides. |
| HSA-08 in `/app` | Freeze of *direction* is not a license to implement HSA-08 production UI without a new Founder wave. |
| Tokens | Existing Weave tokens (`frontend/src/styles/tokens.css`). No new palette unless a Level 3 package explicitly opens that gate. |
| Honesty | REAL / DEMO / CONCEPT per element. No invented certifications, encryption specs, or statistics. |
| Product UI | Slice 1 identity: Account → Personal Tenant → User — verified against `ADR-009-account-tenant-family-entitlement.md`: "each person has one private personal Tenant"; "Family is **not** a Tenant. Family is **not** an Organization." Do not display raw UUIDs. Family is not a nav destination. C2 / billing / Stripe / entitlement UI deferred. |
| Architecture | Do not reopen ADR-002 (multi-tenancy / RLS / `organization_id`), ADR-004 (authorization / `authorize()`), or AUTH-001/002 (`SA-AUTH-001` email verification, `SA-AUTH-002` password/auth foundation) as a UI work package — all four confirmed to exist in `documentation/adr/` and `documentation/Auth/` during reconciliation. |
| Runtime | Name host and port **per package**. This project has used frontend `http://localhost:5174` and API `http://localhost:8001`. Prove served bytes. Do not assume Vite’s default 5173. |
| Docker | `restart` ≠ `--force-recreate` / rebuild when served frontend bytes must change. |
| SPA | `200` is not proof of the correct module or asset. Check `Content-Type` and hash/size. |
| Claude tooling | DOM / computed-style / network: usable. Screenshots: unreliable. `loading="lazy"` may never resolve in that pane — compare to a known-good baseline. Claude does not generate images. |
| Cursor images | Generation is a method, not approval. Asset Gate still required. |
| Git | Do not stage, commit, or push unless Founder separately authorizes. |
| In-progress tree | Unrelated dirty files are listed in `06`; they are not this package’s test failure. |

---

## Templates (minimum) — PROPOSED, NOT LOCKED

The three templates below were drafted by Cursor and were not individually reviewed line-by-line in the joint discussion. They are consistent with the sections above and are kept as a practical starting point, but are marked proposed rather than agreed until Founder or the group confirms them.

### Work-package README status block

```text
ID:
Job (one sentence):
Level (1/2/3): provisional | confirmed | escalated
Phase:
Approval state:
DESIGN DIRECTION:
PRODUCTION MODE:
Frozen:
Allowed:
Forbidden:
Next action / owner:
```

### Implementation-ready packet (paste at start of an implementation chat)

```text
UI BUILD PACKET
Surface:
Level:
DESIGN DIRECTION:
PRODUCTION MODE:
Section order:
Slots + assets (on disk or explicit none):
Honesty labels:
Do not touch:
Copy source:
Authoritative runtime (how to prove fresh bytes):
Done test (viewports):
Files allowed to change:
Founder Phase 5: APPROVE | APPROVE WITH NOTES — DEFERRED
If any field is blank → do not implement. Return the packet.
```

### Micro log row

```text
Date | ID | Claim (value) | Files | Implementer | Verifier (pending / no objection / VETO/ESCALATION: evidence) | Runtime proof | Close (Y/N)
```

---

*End of SA-UI-STRATEGY-001 v1.0. Operating standard — Founder-approved 2026-08-24. Product UI is not authorized by this file without its own work package and gates. Sections 4.1's `documentation/UX/` path convention and the Templates section remain individually marked PROPOSED — NOT LOCKED within this otherwise-frozen document until separately confirmed.*
