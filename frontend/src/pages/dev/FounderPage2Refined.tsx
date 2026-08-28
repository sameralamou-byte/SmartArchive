import { Button, Icon } from "../../components";
import { SmartArchiveWordmark } from "../../components/SmartArchiveWordmark";

const DEMO = "Illustrative example · Demo data";

const STEPS = [
  { n: "1", title: "Bring it in", body: "Scan, photograph or upload a real document." },
  { n: "2", title: "We understand", body: "SmartArchive reads the document and explains what matters." },
  { n: "3", title: "You stay in control", body: "You review, decide, act, and choose your reminders." },
] as const;

/**
 * Development-only Page 2 alternative.
 * Not production. Does not replace WebsiteIntelligence.
 */
export function FounderPage2Refined({ showChrome = true }: { showChrome?: boolean }) {
  return (
    <div
      className={
        showChrome
          ? "overflow-hidden rounded-lg border border-border bg-surface-page text-text-primary shadow-1"
          : "bg-transparent text-text-primary"
      }
    >
      {showChrome ? (
        <div className="flex items-center justify-between gap-3 border-b border-border bg-surface-page px-4 py-3 sm:px-6">
          <SmartArchiveWordmark variant="light" showMark />
          <div className="flex shrink-0 items-center gap-2">
            <Button type="button" variant="secondary" size="sm">
              Sign in
            </Button>
            <Button type="button" variant="primary" size="sm">
              Start for Free
            </Button>
          </div>
        </div>
      ) : null}

      <section className="border-b border-border bg-gradient-to-b from-surface-recessed/80 to-surface-page px-4 py-8 sm:px-6 sm:py-10">
        <p className="text-overline font-bold uppercase tracking-wide text-[color:var(--esa-surface)]">
          How SmartArchive works
        </p>
        <h3 className="mt-2 max-w-3xl font-display text-heading-1 font-bold leading-tight text-[color:var(--esa-surface)] sm:text-display-l">
          Bring it in. We understand. You stay in control.
        </h3>
        <p className="mt-3 max-w-2xl text-body-l text-text-secondary">
          A real person. A real document. SmartArchive explains what it means — then you decide.
        </p>
        <ol className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
          {STEPS.map((step) => (
            <li key={step.n} className="rounded-lg border border-border bg-surface-card p-4">
              <p className="text-overline font-bold text-accent-2">Step {step.n}</p>
              <p className="mt-1 font-display text-heading-3 font-bold text-[color:var(--esa-surface)]">{step.title}</p>
              <p className="mt-1 text-body-m text-text-secondary">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-b border-border px-4 py-8 sm:px-6">
        <p className="text-overline font-bold uppercase tracking-wide text-accent-2">Step 1 — Bring it in</p>
        <h4 className="mt-1 font-display text-heading-2 font-bold text-[color:var(--esa-surface)]">
          You received a document. SmartArchive can help.
        </h4>
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-stretch">
          <figure className="overflow-hidden rounded-lg border border-[color:var(--esa-surface)]/20 bg-surface-card shadow-2">
            <img
              src="/assets/page2/page2_closer_look.png"
              alt="Person reviewing an official letter at home"
              className="h-72 w-full object-cover sm:h-80"
              style={{ objectPosition: "45% 28%" }}
            />
            <figcaption className="px-4 py-3 text-caption text-text-muted">
              Human/document still from current Page 2 production photography — used here only to prototype presence,
              not as a recovered old-board crop.
            </figcaption>
          </figure>
          <div className="flex flex-col justify-center rounded-lg border border-border bg-surface-card p-5">
            <p className="font-display text-body-l font-bold text-[color:var(--esa-surface)]">A real document comes in</p>
            <p className="mt-2 text-body-m text-text-secondary">
              Scan it, photograph it, or upload it. The paper stays the source. SmartArchive does not replace it.
            </p>
            <ul className="mt-4 space-y-2 text-body-m">
              <li className="flex items-center gap-2">
                <Icon name="scan" size={20} className="text-[color:var(--esa-surface)]" /> Photograph the letter
              </li>
              <li className="flex items-center gap-2">
                <Icon name="upload" size={20} className="text-[color:var(--esa-surface)]" /> Upload from your computer
              </li>
              <li className="flex items-center gap-2">
                <Icon name="document" size={20} className="text-[color:var(--esa-surface)]" /> Keep the original in view
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-4 rounded-lg border-2 border-dashed border-accent-2/70 bg-accent-2-tint/40 px-4 py-4">
          <p className="font-display text-body-m font-bold text-[color:var(--esa-surface)]">
            Earlier visual direction — source photo required
          </p>
          <p className="mt-1 text-body-m text-text-secondary">
            Recovered boards show a woman with a government letter, a family reviewing household papers, and an older
            reader with an official letter. Those scenes exist only as small composite-board panels — not as standalone
            photographs for this prototype.
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-surface-recessed/50 px-4 py-8 sm:px-6">
        <p className="text-overline font-bold uppercase tracking-wide text-accent-2">Step 2 — We understand</p>
        <h4 className="mt-1 font-display text-heading-2 font-bold text-[color:var(--esa-surface)]">
          The original stays. SmartArchive explains.
        </h4>
        <p className="mt-2 max-w-2xl text-body-m text-text-secondary">
          Intelligence appears as explanation, deadline, action, authority, and source — not as an AI character.
        </p>
        <div className="mt-5 grid grid-cols-1 overflow-hidden rounded-lg border border-[color:var(--esa-surface)]/25 bg-surface-card shadow-2 lg:grid-cols-2">
          <article className="border-b border-border p-5 sm:p-6 lg:border-b-0 lg:border-e">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-body-l font-bold text-[color:var(--esa-surface)]">Government letter</p>
                <p className="mt-0.5 text-overline text-text-muted">Original — Page 1 of 2</p>
              </div>
              <span className="rounded-pill bg-surface-recessed px-2.5 py-1 text-overline font-bold text-text-muted">
                {DEMO}
              </span>
            </div>
            <div className="mt-5 space-y-3 leading-relaxed text-body-m text-text-secondary">
              <p className="font-display text-body-l text-[color:var(--esa-surface)]">Sehr geehrte Damen und Herren,</p>
              <p>wir bitten Sie, Ihre aktuelle Anschrift zu bestätigen.</p>
              <p>
                Reichen Sie die Unterlagen bitte bis spätestens{" "}
                <mark className="rounded-sm bg-accent-2-tint px-1.5 py-0.5 font-display font-bold text-accent-2 no-underline">
                  18 August 2026
                </mark>{" "}
                ein.
              </p>
              <p>Bitte verwenden Sie das beigefügte Formular.</p>
            </div>
            <p className="mt-5 text-caption text-text-muted">The original document remains the source of authority.</p>
          </article>
          <article className="bg-surface-page p-5 sm:p-6">
            <p className="text-overline font-bold uppercase tracking-wide text-[color:var(--esa-surface)]">
              Here&apos;s what this means
            </p>
            <p className="mt-2 font-display text-body-l font-bold text-text-primary">
              This letter concerns your registration requirement.
            </p>
            <dl className="mt-5 space-y-3 text-body-m">
              <div className="rounded-md border border-accent-2/40 bg-accent-2-tint/70 px-3 py-2">
                <dt className="text-overline font-bold text-text-muted">Important</dt>
                <dd className="font-display font-bold text-accent-2">Deadline: 18 August 2026</dd>
              </div>
              <div>
                <dt className="text-overline font-bold text-text-muted">What you need to do</dt>
                <dd className="font-bold text-text-primary">Confirm your address</dd>
              </div>
              <div>
                <dt className="text-overline font-bold text-text-muted">Authority</dt>
                <dd>City Registration Office</dd>
              </div>
              <div>
                <dt className="text-overline font-bold text-text-muted">Source</dt>
                <dd className="flex items-center gap-1.5">
                  <Icon name="document" size={16} className="text-info" />
                  Page 1, Paragraph 3
                </dd>
              </div>
            </dl>
            <p className="mt-5 text-overline text-text-muted">{DEMO}</p>
          </article>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6">
        <p className="text-overline font-bold uppercase tracking-wide text-accent-2">Step 3 — You stay in control</p>
        <h4 className="mt-1 font-display text-heading-2 font-bold text-[color:var(--esa-surface)]">
          A reminder is suggested. You choose.
        </h4>
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <figure className="overflow-hidden rounded-lg border border-border bg-surface-card">
            <img
              src="/assets/page2/page2_reminder.png"
              alt="A reminder moment beside a document deadline"
              className="h-56 w-full object-cover"
              style={{ objectPosition: "center 40%" }}
            />
            <figcaption className="px-4 py-3 text-caption text-text-muted">
              Current Page 2 reminder still — supporting the human consequence, not a new generated image.
            </figcaption>
          </figure>
          <div className="rounded-lg border-2 border-accent-2 bg-surface-card p-5 shadow-2">
            <p className="font-display text-body-l font-bold text-[color:var(--esa-surface)]">Suggested reminder</p>
            <p className="mt-2 text-body-m text-text-secondary">
              Confirm your address by 18 August 2026. SmartArchive will not create this reminder unless you confirm.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="button" variant="primary" size="sm">
                Add reminder
              </Button>
              <Button type="button" variant="secondary" size="sm">
                Not now
              </Button>
            </div>
            <p className="mt-5 font-display text-body-l font-bold text-accent-2">SmartArchive suggests. You decide.</p>
            <p className="mt-2 text-overline text-text-muted">{DEMO}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
