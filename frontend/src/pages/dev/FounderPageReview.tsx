import { Button, Icon } from "../../components";
import { SmartArchiveWordmark } from "../../components/SmartArchiveWordmark";
import { FounderPage2Refined } from "./FounderPage2Refined";

/**
 * Development-only Founder visual comparison.
 * Not production. Not approved. Does not replace Page 1 / 2 / 3.
 */

const CURRENT_PAGE1 = {
  hero: "/assets/page1/page1_hero_human_document.png",
  "for-your-life": "/assets/page1/page1_for_your_life_document_ecosystem.png",
  understand: "/assets/page1/page1_understand_hands_document.png",
  remember: "/assets/page1/page1_remember_phone_deadline.png",
  automate: "/assets/page1/page1_automate_invoice_workflow.png",
  connect: "/assets/page1/page1_connect_weave.png",
} as const;

const CURRENT_PAGE2 = [
  { src: "/assets/page2/page2_closer_look.png", slot: "Closer look", note: "Official letter, human + document" },
  { src: "/assets/page2/page2_situations_tabletop.png", slot: "Situations", note: "Document-life tabletop" },
  { src: "/assets/page2/page2_quiet_offer.png", slot: "Quiet offer", note: "Explanation / assistance" },
  { src: "/assets/page2/page2_preparation.png", slot: "Preparation", note: "Help preparing a response" },
  { src: "/assets/page2/page2_reminder.png", slot: "Reminder", note: "Deadline / remember" },
] as const;

const EARLIER_HSA_PHOTO = "/assets/dev-founder-review/hsa-aug15-human-document.png";
const REF_BOARD_WEBSITE = "/assets/dev-founder-review/ref-board-aug11-website.png";
const REF_BOARD_SYSTEM = "/assets/dev-founder-review/ref-board-aug11-system.png";

const PAGE1_EARLIER_GAPS = [
  { slot: "For your life", reason: "No recoverable standalone ecosystem photograph." },
  { slot: "Understand (hands + letter)", reason: "No second standalone photograph besides the August 15 hero." },
  { slot: "Remember (phone + deadline)", reason: "Board panels only — not a production photo." },
  { slot: "Automate (invoice workflow)", reason: "ESA slot. No recoverable standalone photograph." },
  { slot: "Connect (Weave)", reason: "Current Weave visual stays. No earlier standalone photo to swap." },
] as const;

function CompareLabel({ tone, children }: { tone: "current" | "earlier"; children: string }) {
  const current = tone === "current";
  return (
    <p
      className={`mb-3 inline-flex rounded-pill px-3 py-1 text-overline font-bold uppercase tracking-wide ${
        current ? "bg-[color:var(--esa-surface)] text-esa-text" : "bg-accent-2-tint text-[color:var(--esa-surface)]"
      }`}
    >
      {children}
    </p>
  );
}

function MissingAsset({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="flex min-h-[160px] flex-col justify-center rounded-lg border-2 border-dashed border-accent-2/70 bg-accent-2-tint/40 px-4 py-5">
      <p className="font-display text-body-l font-bold text-[color:var(--esa-surface)]">
        Earlier visual direction — source photo required
      </p>
      <p className="mt-2 text-body-m font-bold text-text-primary">{title}</p>
      <p className="mt-1 text-body-m text-text-secondary">{detail}</p>
    </div>
  );
}

const PAGE_COPY = {
  signIn: "Sign in",
  startFree: "Start for Free",
  headline: "A document, understood.",
  insightTitle: "We found 3 things that matter",
  amountValue: "€129.40",
  demoLabel: "Illustrative example · Demo data",
  photoCaption: "Illustrative scene — not a real document",
  page3Headline: "Your documents. Protected by design.",
} as const;

function Page1HeroPreview({
  imageSrc,
  imageAlt,
  objectPosition,
}: {
  imageSrc: string;
  imageAlt: string;
  objectPosition: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface-page">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-surface-page px-4 py-3">
        <SmartArchiveWordmark variant="light" showMark />
        <div className="flex shrink-0 items-center gap-2">
          <Button type="button" variant="secondary" size="sm">
            {PAGE_COPY.signIn}
          </Button>
          <Button type="button" variant="primary" size="sm">
            {PAGE_COPY.startFree}
          </Button>
        </div>
      </div>
      <section className="bg-gradient-to-b from-surface-recessed/80 to-surface-page">
        <div className="px-4 pb-6 pt-6 sm:px-5">
          <h3 className="font-display text-heading-2 font-bold leading-tight text-[color:var(--esa-surface)] sm:text-heading-1">
            {PAGE_COPY.headline}
          </h3>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="button" variant="primary" size="sm">
              {PAGE_COPY.startFree}
            </Button>
          </div>
          <div className="relative mt-5 overflow-hidden rounded-lg border-2 border-[color:var(--esa-surface)]/25 shadow-3">
            <div className="relative min-h-[280px] w-full overflow-hidden bg-surface-recessed sm:min-h-[360px]">
              <img
                src={imageSrc}
                alt={imageAlt}
                className="h-full min-h-[280px] w-full object-cover sm:min-h-[360px]"
                style={{ objectPosition }}
              />
            </div>
            <div className="absolute bottom-4 right-3 z-10 w-64 max-w-[88%] rounded-lg border-2 border-accent-2 bg-surface-card p-3 shadow-3 sm:right-5">
              <div className="flex items-center gap-2 rounded-md bg-accent-2-tint px-2 py-1">
                <Icon name="spark" size={16} className="text-accent-2" />
                <p className="text-caption font-bold text-[color:var(--esa-surface)]">{PAGE_COPY.insightTitle}</p>
              </div>
              <p className="mt-2 font-display text-body-m font-bold text-accent-2">{PAGE_COPY.amountValue}</p>
              <p className="mt-2 border-t border-border pt-2 text-overline text-text-muted">{PAGE_COPY.demoLabel}</p>
            </div>
          </div>
          <p className="mt-2 text-caption text-text-muted">{PAGE_COPY.photoCaption}</p>
        </div>
      </section>
    </div>
  );
}

export default function FounderPageReview() {
  return (
    <div className="min-h-screen bg-surface-page text-text-primary">
      <div className="border-b-4 border-accent-2 bg-[color:var(--esa-surface)] text-esa-text">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <SmartArchiveWordmark variant="dark" showMark />
            <h1 className="mt-2 font-display text-heading-2 font-bold sm:text-heading-1">Founder visual comparison</h1>
            <p className="mt-1 max-w-3xl text-body-m text-esa-text-muted">
              Local development preview only. Current production photography is unchanged. Nothing on this page is
              Founder-approved. Public routes for Page 1 / 2 / 3 are not wired here.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <p className="rounded-pill bg-accent-2 px-3 py-1 text-overline font-bold uppercase tracking-wide text-[color:var(--esa-surface)]">
              Dev review — not production
            </p>
            <a
              className="rounded-pill bg-accent-2 px-4 py-2 text-body-m font-bold text-[color:var(--esa-surface)] no-underline"
              href="/dev/founder-page-review/website"
            >
              Open connected HSA website preview
            </a>
          </div>
        </div>
      </div>

      <nav
        className="sticky top-0 z-40 border-b border-border bg-surface-card/95 backdrop-blur"
        aria-label="Page comparison"
      >
        <div className="mx-auto flex max-w-7xl flex-wrap gap-2 px-4 py-3 sm:px-6">
          <a className="rounded-pill bg-[color:var(--esa-surface)] px-3 py-1.5 text-body-m font-bold text-esa-text no-underline" href="#page-1">
            Page 1
          </a>
          <a className="rounded-pill bg-[color:var(--esa-surface)] px-3 py-1.5 text-body-m font-bold text-esa-text no-underline" href="#page-2">
            Page 2 current
          </a>
          <a className="rounded-pill bg-accent-2 px-3 py-1.5 text-body-m font-bold text-[color:var(--esa-surface)] no-underline" href="#page-2-refined">
            Page 2 refined
          </a>
          <a className="rounded-pill bg-[color:var(--esa-surface)] px-3 py-1.5 text-body-m font-bold text-esa-text no-underline" href="#page-3">
            Page 3
          </a>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl space-y-16 px-4 py-8 sm:px-6 sm:py-10">
        <section id="page-1" className="scroll-mt-20">
          <h2 className="font-display text-display-l font-bold text-[color:var(--esa-surface)]">Page 1</h2>
          <p className="mt-2 max-w-3xl text-body-l text-text-secondary">
            Same SmartArchive composition, typography, Weave language, and copy. Only the primary human/document
            photograph changes in column B.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <article>
              <CompareLabel tone="current">A — Current</CompareLabel>
              <Page1HeroPreview
                imageSrc={CURRENT_PAGE1.hero}
                imageAlt="Current Page 1 hero: person with a document"
                objectPosition="center 30%"
              />
              <p className="mt-2 text-caption text-text-muted">Asset: page1_hero_human_document.png (untouched)</p>
            </article>
            <article>
              <CompareLabel tone="earlier">B — Earlier / original direction</CompareLabel>
              <Page1HeroPreview
                imageSrc={EARLIER_HSA_PHOTO}
                imageAlt="Recovered August 15 HSA photograph: person reading a document"
                objectPosition="center 28%"
              />
              <p className="mt-2 text-caption text-text-muted">
                Recovered standalone still: 15 Aug 2026, 1536×1024. Preview copy only — not a production swap.
              </p>
            </article>
          </div>

          <h3 className="mt-10 font-display text-heading-2 font-bold text-[color:var(--esa-surface)]">
            Remaining Page 1 photographic slots
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {(
              [
                ["for-your-life", "For your life"],
                ["understand", "Understand"],
                ["remember", "Remember"],
                ["automate", "Automate"],
                ["connect", "Connect"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="overflow-hidden rounded-lg border border-border bg-surface-card">
                <p className="border-b border-border px-3 py-2 text-caption font-bold uppercase tracking-wide text-text-muted">
                  Current — {label}
                </p>
                <img src={CURRENT_PAGE1[key]} alt={`Current Page 1 ${label}`} className="h-44 w-full object-cover" />
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {PAGE1_EARLIER_GAPS.map((gap) => (
              <MissingAsset key={gap.slot} title={gap.slot} detail={gap.reason} />
            ))}
          </div>
        </section>

        <section id="page-2" className="scroll-mt-20 border-t border-border pt-12">
          <h2 className="font-display text-display-l font-bold text-[color:var(--esa-surface)]">Page 2 — Current</h2>
          <p className="mt-2 max-w-3xl text-body-l text-text-secondary">
            Production Page 2 photography as it exists today. Not replaced by this preview.
          </p>
          <div className="mt-6">
            <article>
              <CompareLabel tone="current">PAGE 2 — CURRENT</CompareLabel>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {CURRENT_PAGE2.map((item) => (
                  <figure key={item.src} className="overflow-hidden rounded-lg border border-border bg-surface-card">
                    <img src={item.src} alt={`Current Page 2 ${item.slot}`} className="h-44 w-full object-cover" />
                    <figcaption className="px-3 py-2">
                      <p className="text-body-m font-bold">{item.slot}</p>
                      <p className="text-caption text-text-muted">{item.note}</p>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section id="page-2-refined" className="scroll-mt-20 border-t border-border pt-12">
          <h2 className="font-display text-display-l font-bold text-[color:var(--esa-surface)]">
            Page 2 — Refined old direction
          </h2>
          <p className="mt-2 max-w-3xl text-body-l text-text-secondary">
            One alternative for Founder review: How SmartArchive Works, told as Bring it in → We understand → You stay
            in control. Recovered boards stay design reference only. No new AI images.
          </p>
          <div className="mt-6">
            <CompareLabel tone="earlier">PAGE 2 — REFINED OLD DIRECTION</CompareLabel>
            <FounderPage2Refined />
          </div>
          <h3 className="mt-10 font-display text-heading-2 font-bold text-[color:var(--esa-surface)]">
            Recovered boards — reference only
          </h3>
          <p className="mt-2 max-w-3xl text-body-m text-text-secondary">
            These composites informed the three-stage story. They are not pasted into the prototype as production
            photography.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <figure className="overflow-hidden rounded-lg border-2 border-dashed border-[color:var(--esa-surface)]/40 bg-surface-card">
              <img
                src={REF_BOARD_WEBSITE}
                alt="August 11 SmartArchive website reference board"
                className="h-auto w-full bg-surface-recessed object-contain"
              />
              <figcaption className="px-4 py-3">
                <p className="font-display text-body-l font-bold text-[color:var(--esa-surface)]">
                  Reference board — not a production photograph
                </p>
              </figcaption>
            </figure>
            <figure className="overflow-hidden rounded-lg border-2 border-dashed border-[color:var(--esa-surface)]/40 bg-surface-card">
              <img
                src={REF_BOARD_SYSTEM}
                alt="August 11 SmartArchive system reference board"
                className="h-auto w-full bg-surface-recessed object-contain"
              />
              <figcaption className="px-4 py-3">
                <p className="font-display text-body-l font-bold text-[color:var(--esa-surface)]">
                  Reference board — not a production photograph
                </p>
              </figcaption>
            </figure>
          </div>
        </section>

        <section id="page-3" className="scroll-mt-20 border-t border-border pt-12">
          <h2 className="font-display text-display-l font-bold text-[color:var(--esa-surface)]">Page 3</h2>
          <p className="mt-2 max-w-3xl text-body-l text-text-secondary">
            Current Page 3 has no hero photograph. No new image was generated. The earlier board is direction only.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <article>
              <CompareLabel tone="current">A — Current</CompareLabel>
              <div className="rounded-lg border border-border bg-surface-page p-5 sm:p-6">
                <h3 className="font-display text-heading-1 font-bold leading-tight">{PAGE_COPY.page3Headline}</h3>
                <div className="mt-6 rounded-lg border border-border bg-surface-card p-5 shadow-2">
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
                  <p className="mt-2 text-overline text-text-muted">{PAGE_COPY.demoLabel}</p>
                </div>
                <p className="mt-3 text-caption text-text-muted">
                  Current implementation uses copy + a small real-UI card. There is no Page 3 production photo slot.
                </p>
              </div>
            </article>
            <article>
              <CompareLabel tone="earlier">B — Earlier security / privacy direction</CompareLabel>
              <figure className="overflow-hidden rounded-lg border-2 border-dashed border-accent/50 bg-surface-card">
                <img
                  src={REF_BOARD_WEBSITE}
                  alt="August 11 board including earlier ESA security and privacy panels"
                  className="h-auto w-full bg-surface-recessed object-contain"
                />
                <figcaption className="px-4 py-4">
                  <p className="font-display text-heading-3 font-bold text-accent">
                    REFERENCE ONLY — ORIGINAL STANDALONE HERO NOT FOUND
                  </p>
                  <p className="mt-2 text-body-m text-text-secondary">
                    The composite-board security panel is not a production hero. It is shown only so the earlier calm
                    trust/privacy direction can be judged.
                  </p>
                </figcaption>
              </figure>
              <div className="mt-4 rounded-lg border-2 border-dashed border-accent-2/70 bg-accent-2-tint/50 px-4 py-5">
                <p className="font-display text-body-l font-bold text-[color:var(--esa-surface)]">
                  Intended asset — not created in this preview
                </p>
                <p className="mt-2 font-display text-heading-3 font-bold">page3_hero_private_archive.png</p>
                <ul className="mt-2 list-disc space-y-1 ps-5 text-body-m text-text-secondary">
                  <li>16:9</li>
                  <li>Photo-first</li>
                  <li>Human / private-document / archive context</li>
                </ul>
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
