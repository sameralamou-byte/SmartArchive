import { Link, useNavigate } from "react-router-dom";

import { Button, Icon } from "../../../components";
import { FounderPage2Refined } from "../FounderPage2Refined";
import { DEMO_LABEL, HSA_PAGE1_ASSETS, HSA_SECURITY_ASSETS, HSA_WEBSITE_BASE } from "./hsaWebsiteAssets";

export function HsaWebsiteHowItWorks() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-4 pb-4 pt-10 sm:px-6">
        <p className="text-overline font-bold uppercase tracking-wide text-accent-2">How it works</p>
        <h1 className="mt-2 font-display text-display-l font-bold text-[color:var(--esa-surface)]">
          A real document. Then you decide.
        </h1>
        <p className="mt-3 max-w-2xl text-body-l text-text-secondary">
          Understand, remember, automate, connect — told as one SmartArchive story, not four separate products.
        </p>
      </section>
      <div className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
        <FounderPage2Refined showChrome={false} />
      </div>
    </main>
  );
}

export function HsaWebsiteSecurity() {
  const navigate = useNavigate();

  return (
    <main>
      <section className="relative overflow-hidden bg-[color:var(--surface-page)]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 lg:grid-cols-[minmax(17rem,0.42fr)_minmax(0,1fr)]">
          <div className="flex flex-col justify-center px-4 py-10 sm:px-6 lg:py-16">
            <p className="text-overline font-bold uppercase tracking-[0.14em] text-accent-2">Security &amp; Privacy</p>
            <h1 className="mt-3 font-display text-display-xl font-bold leading-[1.05] text-[color:var(--esa-surface)]">
              A Safer, Simpler Way
              <br />
              to Manage <span className="text-accent-2">What Matters.</span>
            </h1>
            <p className="mt-4 max-w-sm text-body-l text-text-secondary">
              Keep your important documents organized, secure, and always within reach — for today and tomorrow.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button type="button" variant="primary" onClick={() => navigate("/register")}>
                Start Your Journey
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate(`${HSA_WEBSITE_BASE}/how-it-works`)}>
                See How It Works
              </Button>
            </div>
          </div>

          <div className="relative min-h-[320px] sm:min-h-[420px] lg:min-h-[520px]">
            <img
              src={HSA_SECURITY_ASSETS.hero}
              alt="A person reviewing an insurance letter at a warm home desk, family visible nearby, with a soft thread of light connecting the document to a private-information panel"
              className="h-full w-full object-cover"
            />
            <p className="absolute bottom-3 right-3 rounded bg-[color:var(--esa-midnight)]/80 px-2 py-1 text-caption text-[color:var(--esa-text-muted)]">
              {DEMO_LABEL}
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-[color:var(--surface-card)] py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-overline font-bold uppercase tracking-wide text-accent-2">Your information stays private</p>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {["Protected", "Under your control", "Access only by you", "Safe for the future"].map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 rounded-lg border border-border bg-[color:var(--surface-page)] px-4 py-3 text-body-m"
              >
                <Icon name="shield" size={16} className="text-accent-2" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-xl text-caption text-text-muted">
            These describe intent, not a specific technical mechanism or certification — SmartArchive does not claim a
            specific encryption standard, compliance certification, or security score here until one is independently
            verified true.
          </p>
        </div>
      </section>

      <section className="border-t border-border bg-[color:var(--surface-page)] py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-overline font-bold uppercase tracking-wide text-accent-2">Your Privacy. Your Choice.</p>
          <h2 className="mt-2 max-w-xl font-display text-heading-1 font-bold text-[color:var(--esa-surface)]">
            You decide what to store, what to share, and what to keep private.
          </h2>
          <div className="mt-8 max-w-md rounded-lg border border-border bg-[color:var(--surface-card)] p-5 shadow-2">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Icon name="document" size={20} className="text-text-muted" />
                <p className="font-display text-body-m font-bold">Insurance</p>
              </div>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-tint text-overline font-bold text-accent">
                A
              </span>
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-caption font-bold text-accent-2">
              <Icon name="shield" size={16} />
              Private
            </p>
            <p className="mt-2 text-overline text-text-muted">{DEMO_LABEL}</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export function HsaWebsiteForHome() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-overline font-bold uppercase tracking-wide text-accent-2">For Home</p>
        <h1 className="mt-2 font-display text-display-l font-bold text-[color:var(--esa-surface)]">
          For life, household, and small work.
        </h1>
        <p className="mt-4 max-w-2xl text-body-l text-text-secondary">
          Home stays simple and personal. It covers individuals, households, small projects, freelancers, simple
          offices, local stores, workshops, and straightforward school administration.
        </p>
        <figure className="mt-8 overflow-hidden rounded-lg border border-border bg-[color:var(--surface-card)] shadow-2">
          <img
            src={HSA_PAGE1_ASSETS.forYourLife}
            alt="Personal and household document types SmartArchive Home can keep in context"
            className="h-auto w-full"
          />
        </figure>
        <div className="mt-8 rounded-lg border-2 border-dashed border-accent-2/70 bg-accent-2-tint/40 px-5 py-6">
          <p className="text-overline font-bold uppercase tracking-wide text-accent-2">Photography placeholder</p>
          <p className="mt-2 font-display text-heading-3 font-bold text-[color:var(--esa-surface)]">
            Freelancer or small personal project
          </p>
          <p className="mt-2 max-w-xl text-body-m text-text-secondary">
            Intended photograph: one person at a work table with a contract, invoice, or project papers in a warm room.
            Intelligence overlay secondary. Not a family living-room scene. Not ESA.
          </p>
        </div>
        <p className="mt-8 text-body-m text-text-secondary">
          Complex company workflows belong on{" "}
          <Link className="font-bold text-accent" to={`${HSA_WEBSITE_BASE}/for-business`}>
            For Business
          </Link>
          .
        </p>
      </section>
    </main>
  );
}

export function HsaWebsiteForBusiness() {
  return (
    <main>
      <section data-header-theme="dark" className="bg-[color:var(--esa-midnight)] py-16 text-[color:var(--esa-text)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-overline font-bold uppercase tracking-wide text-accent-2">For Business</p>
          <h1 className="mt-2 max-w-xl font-display text-display-l font-bold">Enterprise SmartArchive</h1>
          <p className="mt-4 max-w-xl text-body-l text-[color:var(--esa-text-muted)]">
            For Business is ESA: departments, enterprise teams, complex organizational permissions, ERP and CRM,
            governance, and company workflows.
          </p>
          <p className="mt-4 max-w-xl text-body-m text-[color:var(--esa-text-muted)]">
            A small office, a local store, or a workshop managing its own papers stays in Home. That boundary is
            deliberate.
          </p>
          <p className="mt-8 text-caption text-[color:var(--esa-text-muted)]">
            Preview positioning only. ESA architecture is not implemented on this page.
          </p>
          <Link className="mt-6 inline-block font-bold text-accent-2" to={`${HSA_WEBSITE_BASE}/for-home`}>
            Back to For Home
          </Link>
        </div>
      </section>
    </main>
  );
}

export function HsaWebsiteAbout() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-overline font-bold uppercase tracking-wide text-accent-2">About us</p>
        <h1 className="mt-2 font-display text-display-l font-bold text-[color:var(--esa-surface)]">SmartArchive</h1>
        <p className="mt-4 max-w-2xl text-body-l text-text-secondary">
          SmartArchive helps people keep real documents in the situations they belong to. Intelligence is visible, and
          secondary to the human story.
        </p>
        <p className="mt-4 max-w-2xl text-body-m text-text-secondary">
          Home is for personal life, household, and small work. Business is for enterprise organization. This page is
          preview copy for Founder review — not a new product claim.
        </p>
      </section>
    </main>
  );
}
