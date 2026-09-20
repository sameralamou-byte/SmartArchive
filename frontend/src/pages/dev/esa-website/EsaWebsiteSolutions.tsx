import { Button, Icon, type IconName } from "../../../components";
import { ESA_SOLUTIONS_ASSETS } from "./esaWebsiteAssets";

/**
 * Copy below is transcribed from the Founder-approved Solutions reference
 * (ESA-SOLUTIONS-2026-09-20-v2-approved) and recovered from
 * SA-DESIGN-ESA-SITE-SPECIFICATION-001 §4.2 / master-doc §8.
 * Draft for Founder review — not locked copywriting.
 *
 * Human-control wording is ESA's rule, not HSA's: AI recommends → named human
 * decides → attributable/auditable. Do not substitute "AI suggests."
 */

const CAPABILITIES = [
  {
    id: "extract-understand",
    icon: "document" as const satisfies IconName,
    title: "Extract / Understand",
    mapsTo: "Document Intelligence",
    body: "Classification, extraction, analysis — contracts, deadlines, risks, and relationships. The original document remains the authoritative record; any AI explanation sits beside it as commentary.",
  },
  {
    id: "organize-enrich",
    icon: "search" as const satisfies IconName,
    title: "Organize / Enrich",
    mapsTo: "Knowledge Search",
    body: "Search across enterprise knowledge and return useful answers — not merely filenames.",
  },
  {
    id: "automate-workflows",
    icon: "workflow" as const satisfies IconName,
    title: "Automate Workflows",
    mapsTo: "Workflow Command Center",
    body: "Operational workflows, approvals, automation, and the human-review steps those flows require.",
  },
  {
    id: "ensure-compliance",
    icon: "shield" as const satisfies IconName,
    title: "Ensure Compliance",
    mapsTo: "Compliance",
    body: "Compliance-oriented document processing and traceability — an attributable history of what was processed and who decided.",
  },
  {
    id: "enable-decisions",
    icon: "spark" as const satisfies IconName,
    title: "Enable Better Decisions",
    mapsTo: "Named human control",
    body: "AI recommends. A named human decides. The decision is attributable and auditable.",
  },
] as const;

const FEATURES = [
  {
    icon: "document" as const satisfies IconName,
    title: "Capture Without Limits",
    body: "Any document. Any format. From anywhere in the world.",
  },
  {
    icon: "spark" as const satisfies IconName,
    title: "Understand with AI",
    body: "Extract meaning, context and value — automatically.",
  },
  {
    icon: "workflow" as const satisfies IconName,
    title: "Automate Workflows",
    body: "From manual work to intelligent processes.",
  },
  {
    icon: "shield" as const satisfies IconName,
    title: "Secure by Design",
    body: "Protect what matters with enterprise-grade security.",
  },
  {
    icon: "search" as const satisfies IconName,
    title: "Turn Information into Opportunities",
    body: "Empower your people. Drive better decisions.",
  },
] as const;

export default function EsaWebsiteSolutions() {
  return (
    <main>
      <section className="esa-solutions-hero" aria-label="SmartArchive ESA solutions">
        <div className="esa-solutions-hero__stage">
          <div
            className="esa-solutions-hero__scene"
            style={{ backgroundImage: `url(${ESA_SOLUTIONS_ASSETS.hero})` }}
            role="img"
            aria-label="Enterprise teams in a night-time office, documents and capabilities connected by threads of light. No AI face or character."
          />
          <div className="esa-solutions-hero__content">
            <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center">
              <p className="text-overline font-bold uppercase tracking-[0.14em] text-accent">
                Solutions for a smarter tomorrow
              </p>
              <h1 className="mt-3 max-w-xl font-display text-display-xl font-bold leading-[1.05] text-[color:var(--esa-mkt-text)]">
                From Documents to
                <br />
                <span className="text-accent">Real Outcomes.</span>
              </h1>
              <p className="mt-4 max-w-md text-body-l text-text-secondary">
                Intelligent document solutions that turn information into understanding, workflows and better decisions.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => document.getElementById("capabilities")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Explore Our Solutions
                </Button>
                <Button type="button" variant="secondary">
                  Request a Demo
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="esa-solutions-hero__strip">
          <div className="esa-solutions-hero__strip-grid">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="esa-solutions-hero__strip-item">
                <Icon name={feature.icon} size={32} className="text-accent" />
                <p className="esa-solutions-hero__strip-title font-display text-heading-3 font-bold text-[color:var(--esa-mkt-text)]">
                  {feature.title}
                </p>
                <p className="mt-2 text-body-m text-text-secondary">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="capabilities" className="esa-solutions-deeper scroll-mt-24 border-t border-white/10 bg-[color:var(--surface-card)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="esa-solutions-deeper__intro">
            <p className="text-overline font-bold uppercase tracking-wide text-accent">
              Knowledge Search · Document Intelligence · Workflow Command Center
            </p>
            <h2 className="mt-2 font-display text-heading-2 font-bold text-[color:var(--esa-mkt-text)]">
              Five capabilities. One coherent <span className="text-accent">story.</span>
            </h2>
            <p className="mt-2 text-body-m text-text-secondary">
              Knowledge Search returns useful answers, not merely filenames. Document Intelligence classifies, extracts,
              and analyses. The Workflow Command Center carries the operational work — with a named human still deciding.
            </p>
          </div>
          <div className="esa-solutions-cards">
            {CAPABILITIES.map((capability) => (
              <div
                key={capability.id}
                id={capability.id}
                className="rounded-lg border border-white/10 bg-[color:var(--surface-page)] px-5 py-6"
              >
                <Icon name={capability.icon} size={24} className="text-accent" />
                <p className="mt-4 text-overline font-bold uppercase tracking-wide text-accent">{capability.mapsTo}</p>
                <h3 className="mt-1 font-display text-heading-3 font-bold text-[color:var(--esa-mkt-text)]">
                  {capability.title}
                </h3>
                <p className="mt-2 text-body-m text-text-secondary">{capability.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
