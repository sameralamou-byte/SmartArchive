import { useNavigate } from "react-router-dom";

import { Button, Icon, type IconName } from "../../../components";

/**
 * ESA Core Journey copy is recovered from
 * SA-DESIGN-ESA-SITE-SPECIFICATION-001 §4.4 / §2.3 and master-doc §8 / §16–20.
 * Draft for Founder review — not locked copywriting. Do not treat any line as
 * a new product claim.
 *
 * Human-control wording is ESA's rule, not HSA's: AI recommends → named human
 * decides → attributable/auditable. Do not substitute "AI suggests."
 */

const JOURNEY = [
  {
    id: "search",
    icon: "search" as const satisfies IconName,
    title: "Search",
    what: "Knowledge Search looks across enterprise knowledge and returns useful answers — not merely filenames.",
    control:
      "Search surfaces what matters. It does not authorize an action or record a decision.",
  },
  {
    id: "understand",
    icon: "document" as const satisfies IconName,
    title: "Understand",
    what: "The original document remains the authoritative record. Any AI explanation sits beside it as commentary, not as a replacement.",
    control:
      "A named reader can still open the source. Understanding is assistance; it is not a decision.",
  },
  {
    id: "intelligence",
    icon: "spark" as const satisfies IconName,
    title: "Intelligence",
    what: "Document Intelligence classifies, extracts, and analyses — contracts, deadlines, risks, and relationships — and marks that output as AI-origin.",
    control:
      "Intelligence recommends. It does not silently take a consequential decision in the organization's name.",
  },
  {
    id: "confidence",
    icon: "scan" as const satisfies IconName,
    title: "Confidence",
    what: "Confidence measures certainty only. Source and grounding measure provenance only. The two are never conflated, and fake-precise percentages are not the primary signal.",
    control:
      "When certainty is incomplete, the reason is shown in plain language so a named reviewer can see why a decision still belongs to them.",
  },
  {
    id: "human-review",
    icon: "eye" as const satisfies IconName,
    title: "Human Review",
    what: "Consequential enterprise actions are reviewed by a person the organization can name — not by an anonymous system actor.",
    control: "AI recommends → a named human decides → the decision is attributable and auditable.",
  },
  {
    id: "workflow",
    icon: "workflow" as const satisfies IconName,
    title: "Workflow",
    what: "The Workflow Command Center carries operational work: routing, approvals, automation, and the human-review steps those flows require.",
    control:
      "Automation moves work. Approvals remain named. They must not appear as anonymous “System” decisions.",
  },
  {
    id: "governance",
    icon: "shield" as const satisfies IconName,
    title: "Governance",
    what: "Governance holds roles, rules, permissions, transparency, and controlled knowledge — who may see, recommend, and decide.",
    control:
      "Who is allowed to decide is explicit before the decision. That name is part of the record, not inferred after the fact.",
  },
  {
    id: "audit",
    icon: "document" as const satisfies IconName,
    title: "Audit",
    what: "Audit is the traceable trail of document processing and of the decisions taken on it — compliance-oriented processing with an attributable history.",
    control:
      "The trail records the named decision. It does not rewrite the outcome as an anonymous system result.",
  },
] as const;

function JourneyDiagram() {
  return (
    <figure className="overflow-hidden rounded-lg border border-white/10 bg-[color:var(--surface-card)] px-4 py-6 sm:px-6">
      <svg
        className="h-auto w-full text-accent"
        viewBox="0 0 880 168"
        role="img"
        aria-label="ESA core journey: Search, Understand, Intelligence, Confidence, Human Review, Workflow, Governance, Audit"
      >
        <defs>
          <linearGradient id="esa-journey-thread" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-2)" />
          </linearGradient>
        </defs>
        {[
          [72, 28],
          [210, 46],
          [360, 22],
          [510, 50],
          [660, 30],
          [800, 44],
          [120, 120],
          [780, 128],
        ].map(([cx, cy], i) => (
          <circle key={`ambient-${i}`} cx={cx} cy={cy} r={i % 2 ? 1.6 : 2.2} fill="var(--accent-2)" opacity={0.45} />
        ))}
        <path
          d="M36 84 C 130 36, 210 132, 310 84 S 490 28, 570 84 S 750 140, 844 84"
          fill="none"
          stroke="url(#esa-journey-thread)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {JOURNEY.map((step, index) => {
          const x = 36 + index * 116;
          return (
            <g key={step.id} transform={`translate(${x} 84)`}>
              <circle r="16" fill="var(--surface-page)" stroke="var(--accent)" strokeWidth="1.5" />
              <text
                y="4"
                textAnchor="middle"
                fill="var(--esa-mkt-text)"
                fontSize="10"
                fontWeight="700"
              >
                {String(index + 1).padStart(2, "0")}
              </text>
              <text
                y="38"
                textAnchor="middle"
                fill="var(--esa-mkt-text-muted)"
                fontSize="11"
                fontWeight="700"
              >
                {step.title}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-4 text-caption text-[color:var(--esa-mkt-text-muted)]">
        Ambient thread diagram — existing ESA network language, not a product screenshot. No AI face or character.
      </figcaption>
    </figure>
  );
}

export default function EsaWebsiteHowItWorks() {
  const navigate = useNavigate();

  return (
    <main>
      <section className="bg-[color:var(--surface-page)]">
        <div className="mx-auto max-w-6xl px-4 pb-4 pt-10 sm:px-6">
          <p className="text-overline font-bold uppercase tracking-[0.14em] text-accent">How It Works</p>
          <h1 className="mt-3 font-display text-display-xl font-bold leading-[1.05] text-[color:var(--esa-mkt-text)]">
            From search to audit.
            <br />
            A <span className="text-accent">named human</span> decides.
          </h1>
          <p className="mt-4 max-w-2xl text-body-l text-text-secondary">
            Show what matters and keep control. SmartArchive ESA is one operational journey from search through
            audit, so every consequential decision stays attributable.
          </p>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[color:var(--surface-card)] py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-overline font-bold uppercase tracking-wide text-accent">The ESA core journey</p>
          <h2 className="mt-2 max-w-2xl font-display text-heading-1 font-bold text-[color:var(--esa-mkt-text)]">
            Search → Understand → Intelligence → Confidence → Human Review → Workflow → Governance → Audit
          </h2>
          <p className="mt-3 max-w-2xl text-body-l text-text-secondary">
            Each step below is the mechanism: what happens, then who still decides.
          </p>
          <div className="mt-8">
            <JourneyDiagram />
          </div>
        </div>
      </section>

      <section className="bg-[color:var(--surface-page)] py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ol className="relative space-y-10 lg:border-l lg:border-white/10 lg:pl-10">
            {JOURNEY.map((step, index) => (
              <li key={step.id} id={step.id} className="scroll-mt-24">
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/50 bg-[color:var(--surface-card)] text-accent">
                    <Icon name={step.icon} size={20} />
                  </span>
                  <div>
                    <p className="text-overline font-bold uppercase tracking-wide text-accent">
                      Step {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-1 font-display text-heading-2 font-bold text-[color:var(--esa-mkt-text)]">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-2xl text-body-l text-text-secondary">{step.what}</p>
                    <p className="mt-3 max-w-2xl text-body-m text-[color:var(--esa-mkt-text-muted)]">
                      <span className="font-bold text-accent">Named human. </span>
                      {step.control}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section data-header-theme="dark" className="scroll-mt-24 bg-[color:var(--esa-mkt-midnight)] py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-overline font-bold uppercase tracking-wide text-accent">Human control</p>
          <h2 className="mt-2 max-w-2xl font-display text-heading-1 font-bold text-[color:var(--esa-mkt-text)]">
            AI recommends. A named human decides. The record stays <span className="text-accent">auditable.</span>
          </h2>
          <p className="mt-4 max-w-2xl text-body-l text-text-secondary">
            Enterprise actions and approvals must not appear as anonymous “System” decisions when a human decision is
            required. The name, the recommendation, and the outcome belong on the same trail.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button type="button" variant="primary" onClick={() => navigate("/register")}>
              Contact Sales
            </Button>
            <Button type="button" variant="secondary">
              Request a Demo
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
