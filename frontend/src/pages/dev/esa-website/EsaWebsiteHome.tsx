import { useNavigate } from "react-router-dom";

import { Button, Icon } from "../../../components";
import { DEMO_LABEL, ESA_HOME_ASSETS } from "./esaWebsiteAssets";

/**
 * Copy below is transcribed directly from the Founder-approved reference
 * image (SA-DESIGN-ESA-EXCEPTION-001, 02-esa hero) as a starting draft, not
 * locked final copywriting -- review before treating any line as permanent.
 */

function ImagePlaceholder({ title, intended }: { title: string; intended: string }) {
  return (
    <div className="flex min-h-[280px] flex-col justify-center rounded-lg border-2 border-dashed border-accent/60 bg-accent-tint px-5 py-8">
      <p className="text-overline font-bold uppercase tracking-wide text-accent">Reference image pending</p>
      <p className="mt-2 font-display text-heading-2 font-bold text-[color:var(--esa-mkt-text)]">{title}</p>
      <p className="mt-2 max-w-xl text-body-m text-text-secondary">{intended}</p>
      <p className="mt-3 text-caption text-text-muted">
        No confirmed final file for this slot yet -- see SA-DESIGN-ESA-EXCEPTION-001 Section 6.
      </p>
    </div>
  );
}

export default function EsaWebsiteHome() {
  const navigate = useNavigate();

  return (
    <main>
      <section className="relative overflow-hidden bg-[color:var(--surface-page)]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 lg:grid-cols-[minmax(20rem,0.55fr)_minmax(0,1fr)]">
          <div className="flex flex-col justify-center px-4 py-10 sm:px-6 lg:py-16">
            <p className="text-overline font-bold uppercase tracking-[0.14em] text-accent">The SmartArchive ESA difference</p>
            <h1 className="mt-3 font-display text-display-xl font-bold leading-[1.05] text-[color:var(--esa-mkt-text)]">
              Enterprise Intelligence
              <br />
              in <span className="text-accent">Action.</span>
            </h1>
            <p className="mt-4 max-w-sm text-body-l text-text-secondary">
              From global headquarters to local teams, SmartArchive ESA connects people, processes and information —
              helping you work smarter, faster and more securely.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button type="button" variant="secondary" onClick={() => navigate("how-it-works")}>
                Discover How It Works
              </Button>
            </div>
          </div>

          <div className="relative min-h-[360px] sm:min-h-[460px] lg:min-h-[560px]">
            <img
              src={ESA_HOME_ASSETS.hero}
              alt="Business people in a glass enterprise atrium, connected by threads of light representing SmartArchive ESA's document intelligence"
              className="h-full w-full object-cover"
            />
            <p className="absolute bottom-3 right-3 rounded bg-[color:var(--esa-mkt-midnight)]/80 px-2 py-1 text-caption text-[color:var(--esa-mkt-text-muted)]">
              {DEMO_LABEL}
            </p>
          </div>
        </div>
      </section>

      <section id="solutions" className="scroll-mt-24 border-t border-white/10 bg-[color:var(--surface-card)] py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-overline font-bold uppercase tracking-wide text-accent">People. Documents. Intelligence.</p>
          <h2 className="mt-2 max-w-2xl font-display text-heading-1 font-bold text-[color:var(--esa-mkt-text)]">
            A Smarter Tomorrow for a <span className="text-accent">Bigger</span> World.
          </h2>
          <p className="mt-3 max-w-2xl text-body-l text-text-secondary">
            AI-powered document intelligence for global enterprises. Secure. Scalable. Built for what&apos;s next.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button type="button" variant="primary" onClick={() => navigate("how-it-works")}>
              See Our Solutions
            </Button>
            <Button type="button" variant="secondary">
              Watch Video
            </Button>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-caption text-text-secondary">
            <li>AI-Powered</li>
            <li>Enterprise-Grade</li>
            <li>Globally Compliant</li>
            <li>Built to Scale</li>
          </ul>
          <figure className="mt-8 overflow-hidden rounded-lg border border-white/10">
            <ImagePlaceholder
              title="Global conference room with holographic intelligence globe"
              intended="Intended: a conference room of enterprise stakeholders around a table, a luminous data globe at the center, thin light-threads connecting laptops and documents to the globe and city skyline beyond -- same ambient-intelligence treatment as the approved hero, no AI face or character."
            />
          </figure>
        </div>
      </section>

      <section id="cta" data-header-theme="dark" className="scroll-mt-24 bg-[color:var(--esa-mkt-midnight)] py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-overline font-bold uppercase tracking-wide text-accent">Let&apos;s build what&apos;s next — together</p>
          <h2 className="mt-2 max-w-2xl font-display text-heading-1 font-bold text-[color:var(--esa-mkt-text)]">
            Intelligent Documents for a <span className="text-accent">Brighter Tomorrow.</span>
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button type="button" variant="primary" onClick={() => navigate("/register")}>
              Contact Sales
            </Button>
            <Button type="button" variant="secondary">
              Request a Demo
            </Button>
          </div>
          <figure className="mt-8 overflow-hidden rounded-lg border border-white/10">
            <ImagePlaceholder
              title="Earth from orbit, global network overlay"
              intended="Intended: Earth from space at night with a glowing network of connected city lights, matching the approved hero's palette and thread language. Told to keep unchanged from the original reference -- no refinement requested -- but the exact final file was not confirmed before this page was built."
            />
          </figure>
          <p className="mt-4 text-caption text-[color:var(--esa-mkt-text-muted)]">{DEMO_LABEL}</p>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[color:var(--surface-page)] py-12">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {[
            {
              icon: "document" as const,
              title: "Capture Without Limits",
              body: "Any document. Any format. From anywhere in the world.",
            },
            {
              icon: "spark" as const,
              title: "Understand with AI",
              body: "Extract meaning, context and value — automatically.",
            },
            {
              icon: "workflow" as const,
              title: "Automate Workflows",
              body: "From manual work to intelligent processes.",
            },
            {
              icon: "search" as const,
              title: "Turn Information into Opportunities",
              body: "Empower your people. Drive better decisions.",
            },
          ].map((feature) => (
            <div key={feature.title}>
              <Icon name={feature.icon} size={24} className="text-accent" />
              <p className="mt-3 font-display text-heading-3 font-bold text-[color:var(--esa-mkt-text)]">{feature.title}</p>
              <p className="mt-1 text-body-m text-text-secondary">{feature.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
