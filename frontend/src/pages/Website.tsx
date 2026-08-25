import { useNavigate } from "react-router-dom";

import { Button, Icon, PublicSiteHeader, WeaveMark } from "../components";
import { useLocale } from "../providers/LocaleProvider";

/**
 * Public SmartArchive Website — Home (Page 1).
 * "A document, understood" — Founder-approved, FROZEN 2026-08-23 (final
 * round, ESA constellation direction). Implements the approved 7-section
 * visual exactly: Hero → Transformation → Document Hub → Real-life
 * situations (2 HSA + 2 ESA) → Trust → Two product verticals → Final CTA.
 * Do not redesign, reinterpret, simplify, or add sections without a new
 * approval round.
 *
 * Photography note: approved Page 1 visual assets live under /assets/page1/.
 * Each slot keeps a stable data-image-slot identifier for future swaps.
 *
 * ESA visual note: the constellation/knowledge-graph and processing-pipeline
 * panel are explicitly labeled "Illustrative example · Concept visualization"
 * — a picture of where ESA is going, not a shipped feature. HSA and ESA
 * document types are never mixed in one visual (see
 * docs on smartarchive_hsa_esa_vertical_separation).
 */

type ImageSlotName = "hero" | "for-your-life" | "story-understand" | "story-remember" | "story-automate" | "story-connect";

const PAGE1_ASSETS: Record<ImageSlotName, string> = {
  hero: "/assets/page1/page1_hero_human_document.png",
  "for-your-life": "/assets/page1/page1_for_your_life_document_ecosystem.png",
  "story-understand": "/assets/page1/page1_understand_hands_document.png",
  "story-remember": "/assets/page1/page1_remember_phone_deadline.png",
  "story-automate": "/assets/page1/page1_automate_invoice_workflow.png",
  "story-connect": "/assets/page1/page1_connect_weave.png",
};

/** Accessible alt text — concise descriptions, not photography-direction briefs. */
const PAGE1_ALT: Record<ImageSlotName, string> = {
  hero: "A person reading an important letter at home beside a document",
  "for-your-life": "A personal document ecosystem with letters, bills, insurance, school papers, and reminders",
  "story-understand": "Hands holding a letter with a moment of attention and puzzlement",
  "story-remember": "A phone showing a due-soon notification beside a calendar deadline",
  "story-automate": "An invoice moving through a business document workflow",
  "story-connect": "A Weave-style diagram connecting document and record nodes",
};

/** Approved Page 1 asset slot — real image, stable data-image-slot for swaps. */
function ImageSlot({ slot, className = "", objectPosition = "center" }: { slot: ImageSlotName; className?: string; objectPosition?: string }) {
  return (
    <div data-image-slot={slot} className={`relative overflow-hidden bg-surface-recessed ${className}`}>
      <img
        src={PAGE1_ASSETS[slot]}
        alt={PAGE1_ALT[slot]}
        className="h-full w-full object-cover"
        style={{ objectPosition }}
        loading={slot === "hero" ? "eager" : "lazy"}
        decoding="async"
      />
    </div>
  );
}

/** Sparse constellation dot-and-line texture — subtle shared-DNA background for dark sections. */
function ConstellationTexture({ dense = false, className = "" }: { dense?: boolean; className?: string }) {
  const dots = dense
    ? [
        [8, 12], [20, 6], [34, 18], [12, 30], [28, 34], [45, 10], [50, 28], [16, 45], [38, 46], [58, 40],
        [62, 14], [70, 30], [80, 8], [85, 24], [92, 42],
      ]
    : [[6, 14], [22, 8], [40, 20], [58, 12], [76, 24], [90, 10]];
  return (
    <svg
      viewBox="0 0 100 50"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-0 h-full w-full opacity-40 ${className}`}
      aria-hidden
    >
      {dots.map(([x1, y1], i) => {
        const [x2, y2] = dots[(i + 1) % dots.length];
        return <line key={`l${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--esa-teal)" strokeWidth="0.15" />;
      })}
      {dots.map(([x, y], i) => (
        <circle key={`d${i}`} cx={x} cy={y} r={dense ? 0.6 : 0.5} fill="var(--esa-teal)" />
      ))}
    </svg>
  );
}

const TRANSFORM_STEPS = [
  { key: "document", icon: "document" as const },
  { key: "question", icon: "question" as const },
  { key: "explain", icon: "spark" as const },
  { key: "todo", icon: "checklist" as const },
  { key: "decision", icon: "person" as const },
];

const HUB_NAV = [
  { key: "dashboard", icon: "dashboard" as const },
  { key: "documents", icon: "document" as const },
  { key: "folders", icon: "folder" as const },
  { key: "weave", icon: "spark" as const },
  { key: "reminders", icon: "bell" as const },
  { key: "trash", icon: "trash" as const },
  { key: "settings", icon: "settings" as const },
  { key: "help", icon: "question" as const },
];

const HUB_DOCS = ["bill", "insurance", "rental", "bank", "tax"] as const;

const STORIES = [
  { key: "understand", vertical: "hsa" as const },
  { key: "remember", vertical: "hsa" as const },
  { key: "automate", vertical: "esa" as const },
  { key: "connect", vertical: "esa" as const },
];

const TRUST_ITEMS = ["private", "secure", "transparent", "control"] as const;

const ORG_LEFT_NODES = ["supplier", "department", "purchaseOrder"] as const;
const ORG_RIGHT_NODES = ["employee", "customer", "accounting"] as const;
const ORG_PIPELINE = ["received", "classified", "extracted", "approval", "archived"] as const;

export default function Website() {
  const { t } = useLocale();
  const navigate = useNavigate();

  return (
    <div className="bg-surface-page text-text-primary">
      <PublicSiteHeader
        showMark
        nav={
          <nav className="hidden items-center gap-7 text-body-m md:flex" aria-label={t("website.nav.primary")}>
            <a className="no-underline" href="#for-your-life">{t("website.nav.individuals")}</a>
            <a className="no-underline" href="#for-your-organization">{t("website.nav.enterprise")}</a>
            <a className="no-underline" href="#transformation">{t("website.nav.howItWorks")}</a>
            <a className="no-underline" href="#trust">{t("website.nav.security")}</a>
          </nav>
        }
      >
        <Button type="button" variant="secondary" size="sm" onClick={() => navigate("/login")}>
          {t("website.nav.signIn")}
        </Button>
        <Button type="button" variant="primary" size="sm" onClick={() => navigate("/register")}>
          {t("website.nav.startFree")}
        </Button>
      </PublicSiteHeader>

      {/* ---------- 1. Hero ---------- */}
      <section className="border-b border-[color:var(--esa-surface)]/20 bg-gradient-to-b from-surface-recessed/80 to-surface-page">
        <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8 lg:pb-10">
        <h1 className="font-display text-display-l font-bold leading-tight text-[color:var(--esa-surface)]">
          {t("website.hero.headline")}
        </h1>
        <p className="mt-3 max-w-xl text-body-l text-text-secondary">{t("website.hero.sub")}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button type="button" variant="primary" onClick={() => navigate("/register")}>
            {t("website.nav.startFree")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => document.getElementById("transformation")?.scrollIntoView({ behavior: "smooth" })}
          >
            {t("website.hero.seeHow")}
          </Button>
        </div>

        <div className="relative mt-6 overflow-hidden rounded-lg border-2 border-[color:var(--esa-surface)]/25 shadow-3">
          <ImageSlot slot="hero" className="min-h-[320px] w-full sm:min-h-[400px]" objectPosition="center 30%" />

          <div className="absolute bottom-6 right-4 z-20 w-72 max-w-[85%] rounded-lg border-2 border-accent-2 bg-surface-card p-4 shadow-3 sm:right-8">
            <div className="flex items-center gap-2 rounded-md bg-accent-2-tint px-2 py-1">
              <Icon name="spark" size={16} className="text-accent-2" />
              <p className="text-body-m font-bold text-[color:var(--esa-surface)]">{t("website.hero.insightTitle")}</p>
            </div>
            <dl className="mt-3 space-y-1.5 text-caption">
              <div className="flex items-center justify-between gap-2">
                <dt className="text-text-muted">{t("website.hero.insight.amountLabel")}</dt>
                <dd className="font-bold text-accent-2">{t("website.hero.insight.amountValue")}</dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-text-muted">{t("website.hero.insight.dueLabel")}</dt>
                <dd className="font-bold text-accent-2">{t("website.hero.insight.dueValue")}</dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-text-muted">{t("website.hero.insight.todoLabel")}</dt>
                <dd className="font-bold text-accent-2">{t("website.hero.insight.todoValue")}</dd>
              </div>
            </dl>
            <p className="mt-3 border-t border-border pt-2 text-overline text-text-muted">
              {t("website.hero.insight.demoLabel")}
            </p>
          </div>
        </div>
        <p className="mt-2 text-caption text-text-muted">{t("website.hero.photoCaption")}</p>
        </div>
      </section>

      {/* ---------- 2. Transformation ---------- */}
      <section id="transformation" data-header-theme="dark" className="relative mt-14 overflow-hidden py-14" style={{ background: "var(--esa-midnight)" }}>
        <ConstellationTexture />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-center font-display text-heading-1 font-bold text-esa-text">{t("website.transform.title")}</h2>
          <div className="mt-10 overflow-x-auto">
            <div className="flex min-w-max items-center justify-center gap-3 sm:gap-5">
              {TRANSFORM_STEPS.map((step, i) => (
                <div key={step.key} className="flex items-center gap-3 sm:gap-5">
                  <div className="flex w-28 flex-col items-center gap-2 text-center">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-full border ${
                        i === TRANSFORM_STEPS.length - 1 ? "border-esa-teal text-esa-teal" : "border-esa-border text-esa-text"
                      }`}
                    >
                      <Icon name={step.icon} size={24} />
                    </div>
                    <p className="text-caption font-bold text-esa-text">{t(`website.transform.step.${step.key}.label`)}</p>
                    <p className="text-overline text-esa-text-muted">{t(`website.transform.step.${step.key}.caption`)}</p>
                  </div>
                  {i < TRANSFORM_STEPS.length - 1 && (
                    <span aria-hidden className="text-heading-3 text-esa-teal">
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 3. Document Hub ---------- */}
      <section className="border-y border-border bg-surface-card/60 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-heading-1 font-bold">{t("website.hub.title")}</h2>
          <p className="mt-3 max-w-xl text-body-l text-text-secondary">{t("website.hub.sub")}</p>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-caption text-text-secondary">
            {(["private", "control", "access"] as const).map((k) => (
              <span key={k} className="flex items-center gap-1.5">
                <Icon name="checklist" size={16} className="text-accent" />
                {t(`website.hub.badge.${k}`)}
              </span>
            ))}
          </div>

          <div className="mt-6 overflow-hidden rounded-lg border border-border bg-surface-card shadow-3" aria-hidden>
            <div className="grid grid-cols-1 lg:grid-cols-[13rem_1fr]">
              {/* Sidebar */}
              <div className="flex flex-row gap-1 overflow-x-auto border-b border-border bg-surface-recessed p-3 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:border-b-0 lg:border-r">
                <div className="hidden items-center gap-2 px-2 pb-3 font-display text-body-m font-bold lg:flex">
                  <WeaveMark className="h-5 w-5 shrink-0" />
                  SmartArchive
                </div>
                {HUB_NAV.map((item, i) => (
                  <div
                    key={item.key}
                    className={`flex shrink-0 items-center gap-2 rounded-md px-2.5 py-1.5 text-caption ${
                      i === 0 ? "bg-accent-tint font-bold text-accent" : "text-text-secondary"
                    }`}
                  >
                    <Icon name={item.icon} size={16} />
                    <span className="hidden lg:inline">{t(`website.hub.nav.${item.key}`)}</span>
                  </div>
                ))}
              </div>

              {/* Main */}
              <div className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <p className="font-display text-body-l font-bold">{t("website.hub.documentsTitle")}</p>
                    <span className="rounded-pill bg-accent-2-tint px-2 py-0.5 text-overline font-bold text-accent-2">
                      {t("website.hub.demoLabel")}
                    </span>
                  </div>
                  <span className="flex items-center gap-2 rounded-pill bg-accent-tint px-2 py-1 text-caption font-bold text-accent">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-overline text-on-accent">
                      A
                    </span>
                    {t("website.hub.user")} · {t("website.hub.userTag")}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-caption">
                  <span className="flex flex-1 min-w-[10rem] items-center gap-2 rounded-pill border border-border bg-surface-page px-3 py-1.5 text-text-muted">
                    <Icon name="search" size={16} />
                    {t("website.hub.search")}
                  </span>
                  <span className="rounded-pill border border-border px-2.5 py-1.5 text-text-secondary">{t("website.hub.filterTypes")}</span>
                  <span className="rounded-pill border border-border px-2.5 py-1.5 text-text-secondary">{t("website.hub.filterDates")}</span>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_14rem]">
                  <div className="rounded-md border border-border">
                    <table className="w-full text-left text-caption">
                      <tbody>
                        {HUB_DOCS.map((doc) => (
                          <tr key={doc} className="border-b border-border last:border-0">
                            <td className="flex items-center gap-2 px-3 py-2 font-bold">
                              <Icon name="document" size={16} className="shrink-0 text-text-muted" />
                              {t(`website.hub.doc.${doc}.title`)}
                            </td>
                            <td className="px-3 py-2 text-text-muted">{t(`website.hub.doc.${doc}.date`)}</td>
                            <td className="hidden px-3 py-2 text-text-muted sm:table-cell">{t(`website.hub.doc.${doc}.type`)}</td>
                            <td className="hidden px-3 py-2 text-text-muted sm:table-cell">{t(`website.hub.doc.${doc}.category`)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="rounded-md border border-border bg-surface-page p-3">
                    <p className="text-caption font-bold">{t("website.hub.insightsTitle")}</p>
                    <p className="mt-0.5 text-overline text-text-muted">{t("website.hub.insightsFound")}</p>
                    <svg viewBox="0 0 100 60" className="mt-2 h-16 w-full" aria-hidden>
                      {[[20, 40], [45, 15], [70, 35], [85, 12]].map(([x1, y1], i, arr) => {
                        const next = arr[(i + 1) % arr.length];
                        return <line key={i} x1={x1} y1={y1} x2={next[0]} y2={next[1]} stroke="var(--border)" strokeWidth="1" />;
                      })}
                      {[[20, 40], [45, 15], [70, 35], [85, 12]].map(([x, y], i) => (
                        <circle key={i} cx={x} cy={y} r={i === 1 ? 4 : 3} fill="var(--accent-2)" />
                      ))}
                    </svg>
                    <p className="mt-1 text-overline font-bold text-accent">{t("website.hub.insightsCta")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 4. Real-life situations ---------- */}
      <section className="border-t border-border bg-surface-recessed py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center font-display text-heading-1 font-bold">{t("website.stories.title")}</h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {STORIES.map((story) => (
              <button
                key={story.key}
                type="button"
                onClick={() => navigate("/register")}
                className={`flex flex-col overflow-hidden rounded-lg border text-start transition-colors ${
                  story.vertical === "esa"
                    ? "border-esa-border bg-esa-surface hover:border-esa-teal"
                    : "border-border bg-surface-card hover:border-accent"
                }`}
              >
                <ImageSlot slot={`story-${story.key}` as ImageSlotName} className="h-44 w-full sm:h-48" />
                <div className="p-4">
                  <span
                    className={`rounded-pill px-2 py-0.5 text-overline font-bold ${
                      story.vertical === "esa" ? "bg-esa-violet-tint text-esa-violet" : "bg-accent-2-tint text-accent-2"
                    }`}
                  >
                    {t(story.vertical === "esa" ? "website.stories.esaTag" : "website.stories.hsaTag")}
                  </span>
                  <p className={`mt-2 font-display text-body-l font-bold ${story.vertical === "esa" ? "text-esa-text" : ""}`}>
                    {t(`website.stories.${story.key}.title`)}
                  </p>
                  <p className={`mt-1 text-caption ${story.vertical === "esa" ? "text-esa-text-muted" : "text-text-muted"}`}>
                    {t(`website.stories.${story.key}.reaction`)}
                  </p>
                  <p className={`mt-2 text-body-m font-bold ${story.vertical === "esa" ? "text-esa-teal" : "text-accent"}`}>
                    {t(`website.stories.${story.key}.cta`)} →
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 5. Trust ---------- */}
      <section id="trust" data-header-theme="dark" className="relative overflow-hidden py-16" style={{ background: "var(--esa-midnight)" }}>
        <ConstellationTexture />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Icon name="shield" size={24} className="text-esa-teal" />
          <h2 className="mt-3 font-display text-heading-1 font-bold text-esa-text">{t("website.trust.title")}</h2>
          <p className="mt-2 text-body-l text-esa-text-muted">{t("website.trust.sub")}</p>
          {/* Deliberately quiet — the four points support the headline above,
              they don't compete with it: no icons, no bold, one muted row. */}
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-1.5">
            {TRUST_ITEMS.map((item) => (
              <p key={item} className="text-caption text-esa-text-muted" title={t(`website.trust.item.${item}.desc`)}>
                {t(`website.trust.item.${item}.title`)}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 6. Two product verticals ---------- */}
      <section className="py-14">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-2">
          {/* HSA */}
          <div id="for-your-life" className="overflow-hidden rounded-lg border border-border border-t-4 border-t-[color:var(--esa-surface)] bg-surface-card">
            <ImageSlot slot="for-your-life" className="h-64 w-full sm:h-72" objectPosition="center top" />
            <div className="p-6">
              <p className="font-display text-heading-3 font-bold">{t("website.life.eyebrow")}</p>
              <p className="mt-1 text-body-m text-text-secondary">{t("website.life.tagline")}</p>
              <p className="mt-1 text-caption text-text-muted">{t("website.life.examples")}</p>
              <Button type="button" variant="primary" size="sm" className="mt-4" onClick={() => navigate("/register")}>
                {t("website.life.cta")}
              </Button>
            </div>
          </div>

          {/* ESA */}
          <div id="for-your-organization" className="relative overflow-hidden rounded-lg border border-esa-border">
            <div className="relative p-6" style={{ background: "var(--esa-midnight)" }}>
              <ConstellationTexture dense />
              <div className="relative">
                <p className="font-display text-heading-3 font-bold text-esa-text">{t("website.org.eyebrow")}</p>
                <p className="mt-1 text-body-m text-esa-text-muted">{t("website.org.tagline")}</p>
                <p className="mt-1 text-caption text-esa-text-muted">{t("website.org.examples")}</p>

                {/* Constellation nodes + processing pipeline — its own vertical
                    composition on mobile (wrapped node chips above/below a
                    full-width pipeline), a 3-column layout at lg+. */}
                <div className="mt-5 flex flex-col gap-3 lg:grid lg:grid-cols-[auto_1fr_auto] lg:items-center">
                  <div className="flex flex-wrap gap-2 lg:flex-col">
                    {ORG_LEFT_NODES.map((node) => (
                      <span
                        key={node}
                        className="flex items-center gap-1.5 rounded-pill border border-esa-border bg-esa-surface px-2.5 py-1 text-overline text-esa-text"
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-esa-teal" />
                        {t(`website.org.node.${node}`)}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-col gap-1.5 lg:min-w-[10rem]">
                    {ORG_PIPELINE.map((step) => (
                      <div
                        key={step}
                        className="rounded-sm border border-esa-border bg-esa-surface px-3 py-1.5 text-center text-overline font-bold text-esa-text"
                      >
                        {t(`website.org.pipeline.${step}`)}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 lg:flex-col">
                    {ORG_RIGHT_NODES.map((node) => (
                      <span
                        key={node}
                        className="flex items-center gap-1.5 rounded-pill border border-esa-border bg-esa-surface px-2.5 py-1 text-overline text-esa-text"
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-esa-violet" />
                        {t(`website.org.node.${node}`)}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="mt-4 text-overline text-esa-text-muted">{t("website.org.demoLabel")}</p>
                <Button
                  type="button"
                  size="sm"
                  className="mt-4 !border-esa-teal !bg-transparent !text-esa-teal hover:!text-esa-teal-hover"
                  variant="secondary"
                  onClick={() => navigate("/register")}
                >
                  {t("website.org.cta")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 7. Final CTA ---------- */}
      <section data-header-theme="dark" className="bg-esa-midnight py-14 text-center text-esa-text">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="font-display text-heading-1 font-bold">{t("website.cta.line1")}</h2>
          <p className="mt-1 font-display text-heading-2 font-bold text-white/85">{t("website.cta.line2")}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button type="button" variant="primary" onClick={() => navigate("/register")}>
              {t("website.nav.startFree")}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="!border-white/40 !text-white hover:!bg-white/10"
              onClick={() => document.getElementById("transformation")?.scrollIntoView({ behavior: "smooth" })}
            >
              {t("website.hero.seeHow")}
            </Button>
          </div>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 text-caption text-text-muted sm:px-6">
          <span>© SmartArchive</span>
          <nav className="flex flex-wrap gap-4" aria-label={t("website.nav.primary")}>
            <a className="no-underline hover:text-accent" href="#for-your-life">{t("website.nav.individuals")}</a>
            <a className="no-underline hover:text-accent" href="#for-your-organization">{t("website.nav.enterprise")}</a>
            <a className="no-underline hover:text-accent" href="#transformation">{t("website.nav.howItWorks")}</a>
            <a className="no-underline hover:text-accent" href="#trust">{t("website.nav.security")}</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
