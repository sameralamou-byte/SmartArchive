import { Link, useNavigate } from "react-router-dom";

import { Button, Icon } from "../../../components";
import { DEMO_LABEL, HSA_PAGE1_ASSETS, HSA_WEBSITE_BASE } from "./hsaWebsiteAssets";

function PhotoPlaceholder({ title, intended }: { title: string; intended: string }) {
  return (
    <div className="flex min-h-[240px] flex-col justify-center rounded-lg border-2 border-dashed border-accent-2/70 bg-accent-2-tint/40 px-5 py-6">
      <p className="text-overline font-bold uppercase tracking-wide text-accent-2">Photography placeholder</p>
      <p className="mt-2 font-display text-heading-2 font-bold text-[color:var(--esa-surface)]">{title}</p>
      <p className="mt-2 max-w-xl text-body-m text-text-secondary">{intended}</p>
      <p className="mt-3 text-caption text-text-muted">No approved standalone photograph for this slot yet. No image was generated.</p>
    </div>
  );
}

export default function HsaWebsiteHome() {
  const navigate = useNavigate();

  return (
    <main>
      <section className="relative overflow-hidden bg-[color:var(--surface-card)]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 lg:grid-cols-[minmax(17rem,0.42fr)_minmax(0,1fr)]">
          <div className="flex flex-col justify-center px-4 py-10 sm:px-6 lg:py-16">
            <p className="text-overline font-bold uppercase tracking-[0.14em] text-accent-2">For your life</p>
            <h1 className="mt-3 font-display text-display-xl font-bold leading-[1.05] text-[color:var(--esa-surface)]">
              Your life.
              <br />
              <span className="text-accent-2">Organized.</span>
            </h1>
            <p className="mt-4 max-w-sm text-body-l text-text-secondary">
              Documents that belong to a real situation — understood, remembered, and kept in context.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button type="button" variant="primary" onClick={() => navigate("/register")}>
                Start for free
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate(`${HSA_WEBSITE_BASE}/how-it-works`)}>
                How it works
              </Button>
            </div>
          </div>

          <div className="relative min-h-[320px] sm:min-h-[420px] lg:min-h-[520px]">
            <img
              src={HSA_PAGE1_ASSETS.hero}
              alt="A person reading an important document at a desk"
              className="h-full w-full object-cover"
              style={{ objectPosition: "center 28%" }}
            />
            <aside className="absolute bottom-4 right-3 z-10 w-64 max-w-[88%] rounded-lg border border-accent-2/80 bg-[color:var(--esa-midnight)]/92 p-3 text-[color:var(--esa-text)] shadow-3 sm:bottom-6 sm:right-5">
              <p className="flex items-center gap-2 text-overline font-bold uppercase tracking-wide text-accent-2">
                <Icon name="spark" size={16} className="text-accent-2" />
                SmartArchive
              </p>
              <ul className="mt-2 space-y-1.5 text-caption">
                <li>Understood</li>
                <li>Deadline detected</li>
                <li>Action suggested</li>
              </ul>
              <p className="mt-3 border-t border-white/15 pt-2 text-overline text-[color:var(--esa-text-muted)]">{DEMO_LABEL}</p>
            </aside>
          </div>
        </div>
      </section>

      <section id="for-your-life" className="scroll-mt-24 border-t border-border bg-[color:var(--surface-page)] py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-overline font-bold uppercase tracking-wide text-accent-2">For your life</p>
          <h2 className="mt-2 max-w-2xl font-display text-heading-1 font-bold text-[color:var(--esa-surface)]">
            The papers that show up in life — and in small work.
          </h2>
          <p className="mt-3 max-w-2xl text-body-l text-text-secondary">
            Letters, bills, bank papers, insurance, school administration, residence, licences, reminders. Household is
            one of the situations. It is not the whole product.
          </p>
          <figure className="mt-8 overflow-hidden rounded-lg border border-border bg-[color:var(--surface-card)] shadow-2">
            <img
              src={HSA_PAGE1_ASSETS.forYourLife}
              alt="Document types from letters and bills to school papers, licences, and reminders"
              className="h-auto w-full"
            />
          </figure>
        </div>
      </section>

      <section id="understand" className="scroll-mt-24 bg-[color:var(--surface-card)] py-10 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Link to={`${HSA_WEBSITE_BASE}/how-it-works`} className="block no-underline">
            <img
              src={HSA_PAGE1_ASSETS.understand}
              alt="Understand: hands holding a letter. We explain what it means in plain language."
              className="h-auto w-full rounded-lg"
            />
          </Link>
        </div>
      </section>

      <section id="remember" className="scroll-mt-24 bg-[color:var(--surface-page)] py-10 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Link to={`${HSA_WEBSITE_BASE}/how-it-works`} className="block no-underline">
            <img
              src={HSA_PAGE1_ASSETS.remember}
              alt="Remember: a phone reminder for an electricity bill deadline."
              className="h-auto w-full rounded-lg"
            />
          </Link>
        </div>
      </section>

      <section id="automate" className="scroll-mt-24 bg-[color:var(--surface-card)] py-10 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="mb-5 max-w-2xl text-body-m text-text-secondary">
            Small offices, freelancers, and independent work stay in Home. Classify, extract, organize, archive — without
            enterprise departments or ERP.
          </p>
          <Link to={`${HSA_WEBSITE_BASE}/how-it-works`} className="block no-underline">
            <img
              src={HSA_PAGE1_ASSETS.automate}
              alt="Automate: a laptop workflow classifying, extracting, organizing, and archiving a document."
              className="h-auto w-full rounded-lg"
            />
          </Link>
        </div>
      </section>

      <section id="connect" data-header-theme="dark" className="scroll-mt-24 bg-[color:var(--esa-midnight)] py-10 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Link to={`${HSA_WEBSITE_BASE}/how-it-works`} className="block no-underline">
            <img
              src={HSA_PAGE1_ASSETS.connect}
              alt="Connect: Weave shows how your documents relate."
              className="h-auto w-full rounded-lg"
            />
          </Link>
          <p className="mt-4 text-caption text-[color:var(--esa-text-muted)]">
            Related documents · source in view · {DEMO_LABEL}
          </p>
        </div>
      </section>

      <section className="border-t border-border bg-[color:var(--surface-page)] py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-overline font-bold uppercase tracking-wide text-accent-2">Who it is for</p>
          <h2 className="mt-2 font-display text-heading-1 font-bold text-[color:var(--esa-surface)]">
            Home is personal life, household, and small work.
          </h2>
          <p className="mt-3 max-w-2xl text-body-l text-text-secondary">
            SmartArchive Home is not only a family product. Family is one use case.
          </p>
          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Individuals / personal life",
              "Households and families",
              "Small personal projects",
              "Freelancers",
              "Small / simple offices",
              "Local stores and markets",
              "Workshops",
              "Simple school administration",
            ].map((item) => (
              <li key={item} className="rounded-lg border border-border bg-[color:var(--surface-card)] px-4 py-3 text-body-m">
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <figure className="overflow-hidden rounded-lg border border-border bg-[color:var(--surface-card)]">
              <img
                src={HSA_PAGE1_ASSETS.automate}
                alt="Approved Automate still used here as small-office / independent work"
                className="h-56 w-full object-cover object-left"
              />
              <figcaption className="px-4 py-3 text-caption text-text-muted">
                Approved Automate still — small office and independent work, not enterprise.
              </figcaption>
            </figure>
            <PhotoPlaceholder
              title="Local store or workshop"
              intended="Intended photograph: a local shop or workshop desk with supplier invoices, receipts, and warranties in a warm, real working environment. SmartArchive intelligence stays secondary — a quiet overlay such as deadline detected or related documents. Not a family scene. Not ESA departments."
            />
          </div>

          <p className="mt-8 max-w-2xl text-body-m text-text-secondary">
            When the work needs departments, enterprise teams, complex permissions, ERP or CRM, or organizational
            governance, that belongs to{" "}
            <Link className="font-bold text-accent" to={`${HSA_WEBSITE_BASE}/for-business`}>
              For Business
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
