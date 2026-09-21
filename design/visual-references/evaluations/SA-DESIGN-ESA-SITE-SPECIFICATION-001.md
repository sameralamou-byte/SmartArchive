# SmartArchive ESA — General Design Framework & Site Specification

**Document ID:** SA-DESIGN-ESA-SITE-SPECIFICATION-001
**Version:** 1.0
**Status:** DRAFT — governs implementation direction, not yet page-by-page frozen
**Date:** 2026-09-20
**Supersedes for ESA only:** the human-warmth/shared-DNA sections of `SmartArchive_Master_Project_Context_v1.0.md`, per `SA-DESIGN-ESA-EXCEPTION-001`. Does not touch HSA, which stays governed by `SA-DESIGN-HSA08-FREEZE-001`.
**Also supersedes:** the pre-exception ESA restoration package at `SmartArchive_ESA_Restoration_2026-09-14/docs/recovery/esa-ui-restoration/` — that package was written under the old shared-Weave/human-warmth assumption (petrol/copper palette, no exception). Its site architecture and evidence-map thinking are still useful reference; its visual-system and per-page emotional direction are not, for ESA specifically.

---

## 1. Purpose of this document

One place that defines (a) the design rules every ESA page must follow, and (b) what each ESA page is for, before any more implementation happens. Mirrors the discipline the project already used for HSA (`SmartArchive_Master_Project_Context_v1.0.md` §24, the locked REFERENCE→EVALUATE→FREEZE→IMPLEMENT process) but scoped to what's actually decidable right now: the Founder is the sole approver for the ESA exception, so this skips the 5-reviewer vote HSA went through and states his approvals directly.

This is a specification, not a freeze. It says what's approved, what's a working assumption, and what's genuinely still open — those are different things and this document keeps them visibly different throughout.

---

## 2. General Design Framework (applies to every ESA page)

### 2.1 Positioning

ESA is business-only. No individuals, no families, no personal-life framing anywhere. Audience: companies, organizations, departments, operations teams (`SmartArchive_Master_Project_Context_v1.0.md` §3.2, still authoritative — the exception only changes *visual* treatment, not audience or product positioning).

Experience principle (unchanged from the master doc): **Show me what matters and give me control.**
Tone: Powerful · Precise · Analytical · Controlled · Traceable · Governed.

### 2.2 Visual language (the exception, `SA-DESIGN-ESA-EXCEPTION-001`)

- **Palette:** deep navy/midnight (`#05061a`–`#0a0e27` range) with magenta/neon-pink accent (`#e6299b` range) and a secondary bright blue (`#4a7dff` range) for network/data lines. Deliberately different from HSA's petrol/copper Weave palette — the two products are not meant to look like one family on ESA's marketing surfaces.
- **AI representation:** an ambient network of glowing points and threads woven into architecture and surfaces. **Never** a face, avatar, humanoid figure, or character, in any ESA image — this survives the exception for a different reason than it did under the master doc (see `SA-DESIGN-ESA-EXCEPTION-001` §4: buyer-credibility, not human-comfort).
- **Document/data treatment:** documents and information appear as semi-transparent, ghost-like fragments integrated into the light-thread network — not solid floating boxes, not opaque UI-chrome panels.
- **Motion/depth:** thin magenta/blue thread-lines connecting people, documents, and the building/system, implying a document → intelligence → future flow through the center of the composition, not just in one corner.
- **Approved reference:** `design/visual-references/02-esa/ESA-HOME-HERO-2026-09-20-v2-approved.webp`. Treat as direction and inspiration, not a locked pixel spec (same rule the master doc's own §23 already states for HSA references).

### 2.3 What still applies to ESA unchanged from the master doc

- Confidence measures certainty only; source/grounding measures provenance only — never conflated (§16–17).
- Original document remains authoritative; AI explanation is commentary (§18).
- One consistent AI-origin marker for AI-generated/suggested content (§19).
- **ESA-specific human control:** AI recommends → a *named* human decides → the decision is attributable and auditable (§20). This is not the same as HSA's softer "AI suggests, person decides" — ESA's version is about governance and audit trail, not comfort, and stays load-bearing for any in-app (not just marketing) ESA work later.
- Higher information density is acceptable for ESA than HSA, but each screen still needs one clear operational purpose (§21).
- Never invent data, functionality, users, or activity; use honest states (Preview / Coming Soon / Not Available Yet) for anything not yet built (§22).
- DE/EN/AR + RTL as first-class requirements; WCAG 2.1 AA (§14–15). Not yet validated for any ESA page built so far — implementation-time work, not a marketing-copy concern.
- No fake-precise AI confidence, no invented certifications/compliance claims (§43 "Legal / Trust Principle" — doubly important for ESA, which explicitly sells on Governance/Compliance/Security).

### 2.4 Component & code reuse

Mirror the existing HSA dev-preview pattern exactly (`frontend/src/pages/dev/hsa-website/*` → `frontend/src/pages/dev/esa-website/*`), already started:
- `esaWebsiteAssets.ts` — nav + asset path constants.
- `esaWebsitePreview.css` — scoped `.esa-website-preview` palette under `--esa-mkt-*` names (deliberately not reusing the existing `--esa-*` names, which are the older shared petrol palette under a legacy name — see the comment in that file).
- `EsaWebsiteLayout.tsx` — shared header/footer chrome.
- `EsaWebsiteHome.tsx` — first real page, built 2026-09-20.
- `EsaWebsitePages.tsx` — one stub per remaining nav item, honestly labeled "not yet built."

Reuse existing shared components (`Button`, `Icon`, `SmartArchiveWordmark`) rather than inventing ESA-specific versions. The 10-icon Weave icon set (`search`, `document`, `spark`, `workflow`, `shield`, `upload`, `scan`, `voice`, `eye`, `eyeOff`) is the only icon vocabulary currently available — if a page below needs an icon outside this set, that's a real gap to flag, not something to invent inline.

---

## 3. Site map

Nav, as shown in the Founder-approved reference: **Solutions · Industries · How It Works · Security · Resources · About**, plus a persistent **Contact Sales** CTA (not a nav item). Footer repeats nav + "A smarter tomorrow. Together."

| Nav item | Status | Maps to (master doc §8/§31 ESA content areas) |
|---|---|---|
| Home (implicit, logo-linked) | **Founder-approved visual direction** (dev preview) | — |
| Solutions | **Founder-approved visual checkpoint** (dev preview) | Knowledge Search, Document Intelligence, Workflow Command Center |
| Industries | **Founder-approved visual checkpoint** (dev preview) | Use Cases (§9): Manufacturing, Government, Healthcare, Education, etc. |
| How It Works | Built as a draft; **not** a frozen visual | The ESA Core Journey (§8): Search → Understand → Intelligence → Confidence → Human Review → Workflow → Governance → Audit |
| Security | **Founder-approved visual checkpoint** (dev preview) | Security + Compliance combined (§8) |
| Resources | **Founder-approved visual checkpoint** (dev preview) | Not named in the master doc's ESA content plan at all — now Founder-approved as a marketing Resources page |
| About | **Founder-approved visual checkpoint** (dev preview) | ESA-specific About page (Our Story, Mission & Values, People, Trust, close CTA) |

**Protected approved visual directions (do not redesign without Founder):** ESA Home, Solutions, Industries, Security, Resources, About; **HSA Home, How It Works, Features, Life (Use Cases)**. ESA How It Works is not in this freeze. Unbuilt HSA marketing pages are not frozen.

**Not in the nav, but named in the master doc's content plan and worth a decision:** Pricing (§9 lists "Enterprise Pricing Sphere"/"Enterprise Pricing Bridge" as concepts). The approved reference image's CTA section says "Contact Sales" / "Request a Demo" rather than showing pricing directly — plausible that ESA is deliberately sales-led rather than self-serve-priced, but that's an assumption, not a confirmed decision. Flagging rather than guessing.

---

## 4. Per-page specification

### 4.1 Home — BUILT (draft)

**Purpose:** first impression, prove "this is a serious enterprise product," route to Solutions/How It Works/Contact Sales.
**Sections (as built, matching the approved reference):**
1. Hero — "Enterprise Intelligence in Action." + subhead + "Discover How It Works" CTA + side label lists (PEOPLE/IDEAS/TECHNOLOGY/DOCUMENTS/A BETTER TOMORROW; INTELLIGENCE AT EVERY STEP) + approved hero image.
2. "A Smarter Tomorrow for a Bigger World" — value prop + See Our Solutions/Watch Video CTAs + trust badges (AI-Powered, Enterprise-Grade, Globally Compliant, Built to Scale) + globe/conference image slot (**placeholder — no confirmed final file**).
3. Closing CTA — "Intelligent Documents for a Brighter Tomorrow" + Contact Sales/Request a Demo + Earth/network image slot (**placeholder — no confirmed final file**).
4. Feature strip — Capture Without Limits / Understand with AI / Automate Workflows / Turn Information into Opportunities, 4 icons.

**Open before this can be called done:** the two pending image slots (§6 below); copy review (currently transcribed from the reference image, not locked copywriting); accessibility/RTL pass; real component-level QA (blocked today by the pre-existing, unrelated Tailwind build failure noted in the 2026-09-20 commit, see §6).

### 4.2 Solutions — FOUNDER-APPROVED VISUAL CHECKPOINT

**Purpose (from master doc content areas):** make the case for the three core ESA capabilities as one coherent story, not three separate product pitches.
**Should cover:** Knowledge Search (search across enterprise knowledge, useful answers not just filenames), Document Intelligence (classification/extraction/analysis/contracts/deadlines/risk/relationships), Workflow Command Center (operational workflows, approvals, automation, human review).
**Needs before implementation:** its own reference image(s) in the approved visual language; real (not invented) examples of what "document intelligence" produces for an enterprise document — same "no fake data" discipline as everywhere else.

### 4.3 Industries — FOUNDER-APPROVED VISUAL CHECKPOINT

**Purpose:** let a visitor from a specific vertical see themselves in the product.
**Candidate verticals** (from the old, now-superseded restoration package's own evidence map, re-usable as a starting list, not as approved content): Manufacturing, SME, Enterprise/Large Org, Government, Education, Professional Services, Security-sensitive sectors.
**Needs before implementation:** a decision on which verticals actually matter for the Founder's real go-to-market, not just which ones look good in a mockup — this is a business decision, not a design one, and shouldn't be guessed at.

### 4.4 How It Works — BUILT (draft, not frozen)

**Purpose:** walk a skeptical buyer through the actual mechanism, building the trust HSA's home page builds through document-first storytelling — ESA's version should do it through the operational journey instead.
**Should cover the ESA Core Journey** (master doc §8): Search → Understand → Intelligence → Confidence → Human Review → Workflow → Governance → Audit. Each step should get a real explanation of what happens and why a human is still in control at the review/decision points (§20's attributable-decision rule is the actual content here, not just a background rule).
**Needs before implementation:** reference imagery per step (or a single system diagram); confirmation this is a scroll-through narrative page (matching the HSA `HowItWorks` pattern's existing shape) versus something more interactive.

### 4.5 Security — FOUNDER-APPROVED VISUAL CHECKPOINT (dev preview)

**Purpose:** the page an enterprise buyer's security/compliance team actually reads before approving a vendor. Highest bar for honesty in the whole site — §43's "no invented certifications, no misleading accuracy claims" is not optional here.
**Should cover:** Security architecture, Compliance posture, auditability, governance controls (master doc §8's "Compliance" + "Security" content areas, and §43 generally).
**Checkpoint:** Founder approved and froze the current Security visual direction (middle lighting: brighter than the original crushed-dark photography, darker than the over-bright pass) after a full-page desktop review (hero, Security at Every Layer, More Security. More Possibilities, footer). Route `/dev/founder-page-review/esa-website/security`. Implementation is in `EsaWebsiteSecurity.tsx` (cinematic hero + independent layer stills). Do not redesign without Founder. Hero rebuild against `ESA-SECURITY-*-approved.webp` is not required for this freeze. How It Works stays a draft and is not frozen.

### 4.6 Resources — FOUNDER-APPROVED VISUAL CHECKPOINT (dev preview)

**Purpose:** a marketing hub for insights, guides, customer stories, product/technical material, and news.
**Checkpoint:** Founder approved and froze the current Resources visual direction after a full-page desktop review. Route `/dev/founder-page-review/esa-website/resources`. Implementation is in `EsaWebsiteResources.tsx` (cinematic approved-hero overlay, Find What You Need icon cards, Featured Resource, Your Resource Advantage). Do not redesign without Founder.

### 4.7 About — FOUNDER-APPROVED VISUAL CHECKPOINT (dev preview)

**Purpose:** company/mission page for ESA — who we are, what we believe, how people work, trust, and a close CTA.
**Checkpoint:** Founder approved and froze the current About visual direction after a full-page desktop review. Route `/dev/founder-page-review/esa-website/about`. Implementation is in `EsaWebsiteAbout.tsx` (cinematic approved-hero overlay, Our Story, Mission & Values, People, Trust, close CTA). Do not redesign without Founder. How It Works stays a draft and is not frozen.

---

## 5. Governance

Same rule the HSA references carry (master doc §23, §27): this specification and its approved reference establish visual direction and content intent only. They do not by themselves authorize:
- new product requirements or features,
- new pricing,
- claims about security/compliance/certifications not otherwise verified,
- treating any transcribed reference-image copy as final, reviewed copywriting.

Any material change to the ESA exception itself (Section 2.2, or reopening the human-warmth question) requires the Founder directly, per `SA-DESIGN-ESA-EXCEPTION-001` §7.

---

## 6. Open items (do not silently resolve these by guessing)

1. **Globe/conference scene final image** — discussed, refined per the same three-change instructions as the hero, final approved file never confirmed. `EsaWebsiteHome.tsx` currently shows an honest placeholder for this slot.
2. **Earth/closing-section final image** — told to keep unchanged from the original 3-image set the Founder shared, but that exact file was never separately saved/confirmed either. Also a placeholder in the current build.
3. **Pricing page/section presence** — the master doc's content plan names it; the approved reference's CTA section doesn't show it directly. Needs a Founder decision, not an assumption.
4. **Industries list** — which verticals actually matter is a go-to-market decision, not a design one.
5. **About scope** — resolved: ESA-specific About page is Founder-approved and frozen (see §4.7).
6. **Pre-existing, unrelated frontend build blocker:** `bg-surface-page` Tailwind class fails to resolve in `src/index.css`, reproduced on both the existing HSA page and the new ESA page after a full Vite cache clear/restart — blocks visual QA of the *entire* frontend right now, not ESA-specific. Needs its own fix before any ESA page (or HSA page) can be checked in a real browser.
