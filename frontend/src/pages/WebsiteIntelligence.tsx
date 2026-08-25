import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, PublicSiteHeader } from "../components";
import { useLocale } from "../providers/LocaleProvider";
import {
  AssistanceWorkflowScene,
  ConnectedHistoryWeave,
  ContextDocumentStory,
  DocumentUnderstandingScene,
  HeroDocumentAnalysisScene,
  PreparationWorkflowScene,
  ReminderStorySequence,
  TranslationTransformationScene,
} from "./page2/page2Visuals";

/**
 * Public SmartArchive Website — Page 2, "See what SmartArchive understands".
 * Document-centered intelligence demonstration — visual storytelling rebuild.
 * Page 1 and Page 3 remain frozen. Page 2 is NOT approved until founder review.
 *
 * Two layers of honesty, applied per element:
 *  - "Demo data" = capability exists today, shown with fictional content.
 *  - "Concept visualization" = heading toward, not yet shipped.
 */

const LEGAL_CONTEXTS = new Set(["immigration", "tax", "court"]);

const CONTEXT_TABS = ["immigration", "tax", "court", "school", "bank", "housing", "driving", "insurance", "invoice"] as const;
type ContextKey = (typeof CONTEXT_TABS)[number];

const CONTEXT_FIELDS: Record<ContextKey, { understand: string[]; help: string[] }> = {
  immigration: { understand: ["a", "b", "c", "d"], help: ["a", "b", "c", "d", "e"] },
  tax: { understand: ["a", "b", "c"], help: ["a", "b", "c", "d", "e"] },
  court: { understand: ["a", "b", "c"], help: ["a", "b", "c", "d", "e"] },
  school: { understand: ["a", "b", "c"], help: ["a", "b", "c", "d"] },
  bank: { understand: ["a", "b"], help: ["a", "b"] },
  housing: { understand: ["a", "b"], help: ["a", "b"] },
  driving: { understand: ["a", "b"], help: ["a", "b"] },
  insurance: { understand: ["a", "b"], help: ["a", "b"] },
  invoice: { understand: ["a", "b"], help: ["a", "b"] },
};

const MOMENT_CHOICES = [
  { key: "understand", icon: "spark" as const, concept: false },
  { key: "translate", icon: "translate" as const, concept: true },
  { key: "prepare", icon: "checklist" as const, concept: true },
  { key: "respond", icon: "document" as const, concept: true },
  { key: "remember", icon: "bell" as const, concept: false },
  { key: "store", icon: "folder" as const, concept: false },
];

const HISTORY_STEPS = ["original", "translation", "explanation", "prepared", "drafted", "approved", "sent", "outcome"] as const;

function DemoTag({ t }: { t: (k: string) => string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-pill bg-accent-2-tint px-2.5 py-1 text-overline font-bold text-accent-2">
      {t("page2.demoLabel")}
    </span>
  );
}

function ConceptTag({ t }: { t: (k: string) => string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-pill border border-dashed border-concept bg-concept-bg px-2.5 py-1 text-overline font-bold text-concept">
      {t("page2.conceptLabel")}
    </span>
  );
}

export default function WebsiteIntelligence() {
  const { t } = useLocale();
  const navigate = useNavigate();
  const [activeContext, setActiveContext] = useState<ContextKey>("immigration");
  const fields = CONTEXT_FIELDS[activeContext];

  return (
    <div className="bg-surface-page text-text-primary">
      <PublicSiteHeader>
        <Button type="button" variant="secondary" size="sm" onClick={() => navigate("/")}>
          {t("page2.nav.backHome")}
        </Button>
        <Button type="button" variant="primary" size="sm" onClick={() => navigate("/register")}>
          {t("website.nav.startFree")}
        </Button>
      </PublicSiteHeader>

      {/* ---------- Hero ---------- */}
      <section className="border-b border-[color:var(--esa-surface)]/20 bg-gradient-to-b from-surface-recessed/80 to-surface-page py-8 sm:py-10 lg:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="inline-block rounded-pill bg-[color:var(--esa-surface)] px-3 py-1 text-overline font-bold uppercase tracking-wide text-esa-text">
            {t("page2.hero.eyebrow")}
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-display-l font-bold leading-tight text-[color:var(--esa-surface)]">
            {t("page2.hero.headline")}
          </h1>
          <p className="mt-3 max-w-xl text-body-l text-text-secondary">{t("page2.hero.sub")}</p>
          <div className="relative mt-6 sm:mt-8">
            <HeroDocumentAnalysisScene t={t} />
          </div>
        </div>
      </section>

      {/* ---------- SmartArchive sees more than text (§2) ---------- */}
      <section className="-mt-2 border-t border-border bg-surface-page pb-12 pt-6 sm:pb-14 sm:pt-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <DocumentUnderstandingScene t={t} />
        </div>
      </section>

      {/* ---------- Would you like help with this? ---------- */}
      <section data-header-theme="dark" className="relative overflow-hidden bg-esa-midnight py-16 sm:py-20">
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-center font-display text-heading-1 font-bold text-esa-text sm:text-display-l">{t("page2.moment.question")}</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-body-l text-esa-text-muted">{t("page2.moment.principle")}</p>
          <AssistanceWorkflowScene t={t} choices={MOMENT_CHOICES} />
        </div>
      </section>

      {/* ---------- Context selector ---------- */}
      <section className="border-t border-border bg-surface-recessed py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-center font-display text-heading-1 font-bold">{t("page2.context.title")}</h2>

          <div className="mt-6 flex flex-wrap justify-center gap-1.5 opacity-90">
            {CONTEXT_TABS.map((ctx) => (
              <button
                key={ctx}
                type="button"
                onClick={() => setActiveContext(ctx)}
                aria-pressed={activeContext === ctx}
                className={`rounded-pill border px-3 py-1 text-overline font-bold ${
                  activeContext === ctx
                    ? "border-[color:var(--esa-surface)]/50 bg-[color:var(--esa-surface)]/10 text-[color:var(--esa-surface)]"
                    : "border-border/50 bg-transparent text-text-muted"
                }`}
              >
                {t(`page2.context.tab.${ctx}`)}
              </button>
            ))}
          </div>

          <ContextDocumentStory
            t={t}
            activeContext={activeContext}
            understandKeys={fields.understand}
            helpKeys={fields.help}
            showLegal={LEGAL_CONTEXTS.has(activeContext)}
          />
          <p className="mt-4 text-center text-caption text-text-muted">{t("page2.context.note")}</p>
        </div>
      </section>

      {/* ---------- Translation ---------- */}
      <section className="border-y border-border bg-surface-page py-14 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="font-display text-heading-1 font-bold">{t("page2.translation.title")}</h2>
            <div className="mt-3 flex justify-center">
              <ConceptTag t={t} />
            </div>
            <p className="mx-auto mt-4 max-w-lg text-body-m font-bold text-[color:var(--esa-surface)]">Translation ≠ Understanding</p>
          </div>
          <TranslationTransformationScene t={t} />
          <p className="mt-6 text-center text-body-m text-text-secondary">{t("page2.translation.note")}</p>
        </div>
      </section>

      {/* ---------- Preparation ---------- */}
      <section className="border-t border-border bg-surface-recessed py-14 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="font-display text-heading-1 font-bold">{t("page2.advice.title")}</h2>
            <div className="mt-3 flex justify-center">
              <ConceptTag t={t} />
            </div>
          </div>
          <PreparationWorkflowScene t={t} />
          <p className="mt-6 rounded-md bg-warning-bg px-3 py-2 text-center text-caption text-warning">{t("page2.principleNote")}</p>
        </div>
      </section>

      {/* ---------- Reminders ---------- */}
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="font-display text-heading-1 font-bold">{t("page2.reminders.title")}</h2>
            <div className="mt-3 flex justify-center">
              <DemoTag t={t} />
            </div>
          </div>
          <ReminderStorySequence t={t} />
          <p className="mt-8 text-center text-body-m text-text-secondary">{t("page2.reminders.note")}</p>
        </div>
      </section>

      {/* ---------- Connected history ---------- */}
      <section className="border-t border-border bg-esa-midnight/5 py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="font-display text-heading-1 font-bold">{t("page2.history.title")}</h2>
            <div className="mt-3 flex justify-center">
              <ConceptTag t={t} />
            </div>
          </div>
          <ConnectedHistoryWeave t={t} steps={HISTORY_STEPS} />
        </div>
      </section>

      {/* ---------- Final CTA ---------- */}
      <section data-header-theme="dark" className="bg-esa-midnight py-14 text-center text-esa-text">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="font-display text-heading-1 font-bold">{t("page2.cta.headline")}</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button type="button" variant="primary" onClick={() => navigate("/register")}>
              {t("website.nav.startFree")}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="!border-white/40 !text-white hover:!bg-white/10"
              onClick={() => navigate("/")}
            >
              {t("page2.nav.backHome")}
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-caption text-text-muted">© SmartArchive</footer>
    </div>
  );
}
