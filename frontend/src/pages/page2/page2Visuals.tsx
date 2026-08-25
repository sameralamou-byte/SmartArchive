import type { IconName } from "../../components";
import { Icon } from "../../components";

import { AuthorityLetterBody, HeroSceneFrame, type TranslateFn } from "./page2Shared";

const HERO_INSIGHTS = ["language", "source", "date", "action"] as const;

/** §1 Hero — APPROVED. Do not redesign. */
export function HeroDocumentAnalysisScene({ t }: { t: TranslateFn }) {
  return (
    <div>
      <HeroSceneFrame>
        <div className="relative z-10 flex h-full items-center p-5 sm:p-8 lg:p-10 lg:pe-[38%]">
          <div className="relative w-full max-w-lg">
            <div className="relative rounded-sm bg-surface-card shadow-2 ring-1 ring-border/70 lg:-rotate-[0.6deg]">
              <div className="flex items-start justify-between gap-3 border-b border-border/80 bg-surface-recessed/60 px-5 py-4 sm:px-6">
                <div>
                  <p className="font-display text-body-l font-bold text-[color:var(--esa-surface)]">{t("page2.hero.docSender")}</p>
                  <p className="mt-0.5 text-overline text-text-muted">
                    Amt für Beispiele · {t("page2.hero.docIllustrative")}
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-pill border border-esa-teal/50 bg-info-bg px-2.5 py-1 text-overline font-bold text-info">
                  <Icon name="link" size={16} />
                  {t("page2.hero.annotation.source.value")}
                </span>
              </div>
              <div className="px-5 py-5 sm:px-6 sm:py-6">
                <AuthorityLetterBody hero />
              </div>
              <div className="mx-5 mb-5 flex items-center gap-2 rounded-md border border-accent-2/40 bg-accent-2-tint/80 px-3 py-2 sm:mx-6">
                <Icon name="checklist" size={16} className="shrink-0 text-accent-2" />
                <p className="text-caption font-bold text-[color:var(--esa-surface)]">{t("page2.hero.annotation.action.value")}</p>
              </div>
            </div>
            <p className="absolute -bottom-2 start-6 hidden items-center gap-1.5 rounded-pill border border-esa-teal/40 bg-surface-card px-2.5 py-1 text-overline font-bold text-info shadow-1 sm:flex">
              <Icon name="link" size={16} />
              {t("page2.hero.annotation.source.label")}: {t("page2.hero.annotation.source.value")}
            </p>
          </div>
        </div>
        <svg className="pointer-events-none absolute inset-0 z-[15] hidden text-accent-2 lg:block" viewBox="0 0 800 500" preserveAspectRatio="none" aria-hidden>
          <path d="M 340 280 Q 520 260 620 380" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.55" />
          <circle cx="340" cy="280" r="4" fill="currentColor" opacity="0.8" />
        </svg>
        <div className="relative z-20 mx-5 mb-5 max-w-[85%] sm:absolute sm:bottom-6 sm:end-6 sm:mx-0 sm:mb-0 sm:w-72 lg:w-80">
          <div className="rounded-lg border-2 border-accent-2 bg-surface-card p-4 shadow-3 sm:p-5">
            <div className="flex items-center gap-2 rounded-md bg-accent-2-tint px-2.5 py-1.5">
              <Icon name="spark" size={16} className="text-accent-2" />
              <p className="font-display text-body-m font-bold text-[color:var(--esa-surface)]">{t("page2.hero.docDeadline")}</p>
            </div>
            <dl className="mt-3 space-y-2 text-caption">
              {HERO_INSIGHTS.map((key) => {
                const isGold = key === "date" || key === "action";
                const isTeal = key === "source";
                return (
                  <div key={key} className="flex items-center justify-between gap-3">
                    <dt className="text-text-muted">{t(`page2.hero.annotation.${key}.label`)}</dt>
                    <dd className={`font-display font-bold ${isGold ? "text-accent-2" : isTeal ? "text-info" : "text-text-primary"}`}>
                      {t(`page2.hero.annotation.${key}.value`)}
                    </dd>
                  </div>
                );
              })}
            </dl>
            <p className="mt-3 border-t border-border pt-2 text-overline text-text-muted">{t("page2.demoLabel")}</p>
          </div>
        </div>
      </HeroSceneFrame>
      <p className="mt-2 text-caption text-text-muted">{t("page2.demoLabel")}</p>
    </div>
  );
}

/** §2 A closer look — editorial photographic scene with annotations and Meaning panel. */
export function DocumentUnderstandingScene({ t }: { t: TranslateFn }) {
  return (
    <div>
      <header className="text-center">
        <h2 className="font-display text-heading-1 font-bold text-[color:var(--esa-surface)]">{t("page2.analysis.title")}</h2>
        <p className="mt-2 font-display text-body-m font-bold uppercase tracking-[0.2em] text-[color:var(--esa-surface)]/80">
          A closer look
        </p>
        <div className="mx-auto mt-3 h-0.5 w-20 bg-accent-2/70" aria-hidden />
      </header>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:mt-7 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:gap-7 lg:items-stretch">
        {/* Photographic scene — document protagonist */}
        <div
          className="relative min-h-[360px] overflow-hidden rounded-lg border-2 border-[color:var(--esa-surface)]/20 shadow-2 sm:min-h-[440px] lg:min-h-[500px]"
          data-image-slot="page2-closer-look"
        >
          <img
            src="/assets/page2/page2_closer_look.png"
            alt="Person reviewing an official letter at a warm home desk"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "45% 30%" }}
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-surface-page/10 via-transparent to-[color:var(--esa-surface)]/15" aria-hidden />

          {/* Closer-reading document crop — fictional content only */}
          <div className="absolute inset-y-[14%] start-[5%] end-[8%] sm:inset-y-[12%] sm:start-[7%] sm:end-[10%] lg:end-[12%]">
            <div className="relative h-full">
              <div className="relative rounded-sm bg-surface-card/97 p-4 shadow-3 ring-1 ring-border/50 backdrop-blur-[2px] sm:p-5 lg:max-w-[92%]">
                <div className="border-b border-border/70 pb-2">
                  <p className="font-display text-body-m font-bold text-[color:var(--esa-surface)] sm:text-body-l">
                    {t("page2.hero.docSender")}
                  </p>
                  <p className="text-overline text-text-muted">Amt für Beispiele · {t("page2.hero.docIllustrative")}</p>
                </div>
                <div className="mt-3 space-y-2 text-body-m leading-relaxed text-text-secondary sm:mt-4">
                  <p className="text-text-muted line-through decoration-border/70">Sehr geehrte Damen und Herren,</p>
                  <p className="text-text-primary">…wir bitten Sie, die angeforderten Unterlagen bis spätestens</p>
                  <p>
                    <mark
                      id="p2-deadline-mark"
                      className="rounded-sm bg-accent-2-tint px-1.5 py-0.5 font-display font-bold text-accent-2 no-underline"
                    >
                      {t("page2.analysis.date.value")}
                    </mark>{" "}
                    einzureichen.
                  </p>
                  <p>
                    Bitte verwenden Sie{" "}
                    <mark id="p2-form-mark" className="rounded-sm bg-info-bg/80 px-1 font-bold text-info">
                      das beigefügte Formular
                    </mark>
                    .
                  </p>
                </div>
              </div>

              {/* Gold dashed connectors + annotation callouts */}
              <svg
                className="pointer-events-none absolute inset-0 z-10 hidden overflow-visible sm:block"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  d="M 58 46 Q 72 38 86 28"
                  fill="none"
                  stroke="var(--accent-2)"
                  strokeWidth="0.6"
                  strokeDasharray="2.5 2"
                  opacity="0.85"
                />
                <path
                  d="M 52 68 Q 70 66 88 58"
                  fill="none"
                  stroke="var(--accent-2)"
                  strokeWidth="0.6"
                  strokeDasharray="2.5 2"
                  opacity="0.85"
                />
                <circle cx="58" cy="46" r="1.2" fill="var(--accent-2)" />
                <circle cx="52" cy="68" r="1.2" fill="var(--accent-2)" />
              </svg>

              <div className="absolute -end-1 top-[22%] z-20 hidden max-w-[7.5rem] sm:block lg:-end-20 lg:max-w-[8.5rem]">
                <p className="rounded-sm bg-surface-card/95 px-2 py-1 text-end text-overline font-bold leading-snug text-accent-2 shadow-1 ring-1 ring-accent-2/40">
                  Deadline detected
                </p>
              </div>
              <div className="absolute -end-1 bottom-[24%] z-20 hidden max-w-[7.5rem] sm:block lg:-end-20 lg:max-w-[8.5rem]">
                <p className="rounded-sm bg-surface-card/95 px-2 py-1 text-end text-overline font-bold leading-snug text-info shadow-1 ring-1 ring-esa-teal/30">
                  Required document
                </p>
              </div>
            </div>
          </div>

          {/* Mobile annotation labels — inline, readable */}
          <div className="absolute bottom-3 start-3 end-3 flex flex-wrap gap-2 sm:hidden">
            <span className="rounded-pill bg-surface-card/95 px-2.5 py-1 text-overline font-bold text-accent-2 ring-1 ring-accent-2/40">
              Deadline detected
            </span>
            <span className="rounded-pill bg-surface-card/95 px-2.5 py-1 text-overline font-bold text-info ring-1 ring-esa-teal/30">
              Required document
            </span>
          </div>
        </div>

        {/* Meaning panel — SmartArchive interpretation */}
        <div className="relative flex flex-col justify-center border-t-2 border-accent-2/35 bg-surface-card/95 p-5 shadow-1 sm:p-6 lg:border-s-2 lg:border-t-0 lg:ps-8">
          <svg
            className="pointer-events-none absolute -start-px top-1/4 hidden h-16 w-8 -translate-x-full text-accent-2 lg:block"
            viewBox="0 0 32 64"
            aria-hidden
          >
            <path d="M 30 32 Q 12 28 4 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
            <circle cx="30" cy="32" r="2.5" fill="currentColor" />
          </svg>

          <p className="text-overline font-bold uppercase tracking-wide text-info">{t("page2.context.understandsHeading")}</p>
          <p className="mt-2 font-display text-heading-2 font-bold text-[color:var(--esa-surface)]">{t("page2.analysis.docType.value")}</p>

          <div className="mt-6 space-y-5 border-t border-border/60 pt-5">
            <div>
              <p className="text-overline font-bold uppercase tracking-wide text-text-muted">{t("page2.analysis.date.label")}</p>
              <p className="mt-1 font-display text-display-l font-bold text-accent-2">{t("page2.analysis.date.value")}</p>
            </div>
            <div>
              <p className="text-overline font-bold uppercase tracking-wide text-text-muted">{t("page2.analysis.action.label")}</p>
              <p className="mt-2 text-body-l font-bold leading-snug text-text-primary">{t("page2.analysis.action.value")}</p>
            </div>
          </div>

          <p className="mt-6 text-caption text-text-muted">{t("page2.demoLabel")}</p>
        </div>
      </div>

      {/* Restrained closing — not a feature grid */}
      <p className="mt-6 text-center font-display text-body-m text-text-secondary lg:mt-7">
        <span className="font-bold text-accent-2">Detected</span>
        <span className="mx-2 text-text-muted" aria-hidden>
          →
        </span>
        <span className="font-bold text-[color:var(--esa-surface)]">Understood</span>
        <span className="mx-2 text-text-muted" aria-hidden>
          →
        </span>
        <span className="font-bold text-info">Ready for your attention</span>
      </p>
    </div>
  );
}

type MomentChoice = { key: string; icon: IconName; concept: boolean };

/**
 * §3 Quiet offer — photo primary, soft caption flex row under photo, funnel, gold decision.
 * Absolute-positioned whisper/diamond layout is permanently retired.
 */
export function AssistanceWorkflowScene({ t, choices }: { t: TranslateFn; choices: MomentChoice[] }) {
  return (
    <div className="relative mx-auto mt-10 max-w-5xl">
      <div className="overflow-hidden rounded-sm" data-image-slot="page2-quiet-offer">
        <img
          src="/assets/page2/page2_quiet_offer.png"
          alt="Quiet desk moment — reviewing a document with help available"
          className="block h-[200px] w-full object-cover sm:h-[240px] lg:h-[280px]"
          style={{ objectPosition: "45% 55%" }}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="mt-5 flex flex-wrap items-start justify-center gap-x-5 gap-y-3 px-1 sm:gap-x-7">
        {choices.map((choice) => (
          <div key={choice.key} className="min-w-0 max-w-[6.5rem] text-center opacity-80">
            <p className={`text-caption font-bold ${choice.concept ? "text-concept" : "text-accent-2"}`}>
              {t(`page2.moment.choice.${choice.key}.title`)}
            </p>
            <p className={`mt-0.5 text-overline ${choice.concept ? "text-concept" : "text-esa-text-muted"}`}>
              {choice.concept ? t("page2.tag.concept") : t("page2.tag.demo")}
            </p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-sm text-center">
        <p className="text-overline font-bold uppercase tracking-[0.25em] text-esa-text-muted">SmartArchive can help</p>
        <div className="mx-auto my-5 h-10 w-px bg-esa-teal/50" aria-hidden />
        <p className="text-overline font-bold uppercase tracking-wide text-esa-text-muted">User review</p>
        <p className="mt-2 font-display text-body-m text-esa-text">You choose what happens next</p>
        <div className="mx-auto my-7 h-10 w-px bg-accent-2/60" aria-hidden />
        <div className="border-2 border-accent-2 bg-accent-2 px-6 py-8 shadow-3">
          <Icon name="person" size={32} className="mx-auto text-esa-midnight" />
          <p className="mt-3 font-display text-heading-2 font-bold text-esa-midnight">Your decision</p>
          <p className="mt-2 text-body-m font-bold text-esa-midnight/85">Nothing is sent without your confirmation</p>
        </div>
      </div>
    </div>
  );
}

const CONTEXT_ACCENT: Record<string, string> = {
  immigration: "border-l-accent-2",
  tax: "border-l-[color:var(--esa-surface)]",
  court: "border-l-concept",
  school: "border-l-esa-teal",
  bank: "border-l-border",
  housing: "border-l-accent-2",
  driving: "border-l-esa-teal",
  insurance: "border-l-[color:var(--esa-surface)]",
  invoice: "border-l-accent-2",
};

/** §4 Tabletop of situations — editorial, not database table. */
export function ContextDocumentStory({
  t,
  activeContext,
  understandKeys,
  helpKeys,
  showLegal,
}: {
  t: TranslateFn;
  activeContext: string;
  understandKeys: string[];
  helpKeys: string[];
  showLegal: boolean;
}) {
  const accent = CONTEXT_ACCENT[activeContext] ?? "border-l-border";

  return (
    <div className="relative mt-10 min-h-[340px] overflow-hidden bg-surface-recessed/70 px-4 py-10 sm:px-8">
      <img
        src="/assets/page2/page2_situations_tabletop.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.28]"
        style={{ objectPosition: "50% 50%" }}
        loading="lazy"
        decoding="async"
      />
      <div className="pointer-events-none absolute inset-0 bg-surface-recessed/55" aria-hidden />

      <div className="relative mx-auto max-w-xl" data-image-slot="page2-situations-tabletop">
        <div className={`relative border-s-4 bg-surface-card px-6 py-8 shadow-2 ${accent}`}>
          <div className="absolute -top-2 left-8 h-4 w-16 bg-surface-recessed" aria-hidden />
          <p className="text-overline font-bold uppercase tracking-wide text-text-muted">{t("page2.context.docHeading")}</p>
          <p className="mt-2 font-display text-heading-2 font-bold text-[color:var(--esa-surface)]">
            {t(`page2.context.${activeContext}.doc`)}
          </p>

          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <div>
              <p className="text-overline font-bold text-text-muted">{t("page2.context.understandsHeading")}</p>
              <p className="mt-1 text-overline text-accent-2">{t("page2.demoLabel")}</p>
              <ul className="mt-3 space-y-2">
                {understandKeys.map((k) => (
                  <li key={k} className="border-s-2 border-accent-2/50 ps-3 text-body-m text-text-primary">
                    {t(`page2.context.${activeContext}.understand.${k}`)}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-overline font-bold text-text-muted">{t("page2.context.helpHeading")}</p>
              <p className="mt-1 text-overline text-concept">{t("page2.conceptLabel")}</p>
              <ul className="mt-3 space-y-2">
                {helpKeys.map((k) => (
                  <li key={k} className="border-s-2 border-concept/40 ps-3 text-body-m text-text-secondary">
                    {t(`page2.context.${activeContext}.help.${k}`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {showLegal && (
            <p className="mt-6 border-t border-dashed border-border pt-4 text-caption text-warning">{t("page2.legalNote")}</p>
          )}
        </div>
      </div>
    </div>
  );
}

const TRANSLATION_PASSAGES = {
  original:
    "Sehr geehrte Damen und Herren, wir bitten Sie, die angeforderten Unterlagen bis spätestens 31 October einzureichen.",
  translation: "Dear Sir or Madam, we ask you to submit the requested documents by 31 October at the latest.",
  meaning:
    "This is an official request to send specific documents to the authority before the deadline. Missing the date may affect your case.",
};

/** §5 Translation → understanding — escalating typography, not three equal cards. */
export function TranslationTransformationScene({ t }: { t: TranslateFn }) {
  return (
    <div className="mx-auto mt-10 max-w-3xl space-y-0">
      <div className="py-6">
        <p className="text-overline font-bold uppercase tracking-wide text-text-muted">{t("page2.translation.original.label")}</p>
        <p className="mt-3 text-body-m leading-relaxed text-text-secondary opacity-90">
          {TRANSLATION_PASSAGES.original.split("31 October")[0]}
          <span className="text-text-primary">31 October</span>
          {TRANSLATION_PASSAGES.original.split("31 October")[1]}
        </p>
      </div>

      <div className="flex items-center gap-3 py-2">
        <div className="h-px flex-1 bg-esa-teal/40" />
        <span className="text-esa-teal">↓</span>
        <div className="h-px flex-1 bg-esa-teal/40" />
      </div>

      <div className="border-s-2 border-esa-teal py-6 ps-5">
        <p className="text-overline font-bold uppercase tracking-wide text-info">{t("page2.translation.translation.label")}</p>
        <p className="mt-3 text-body-l leading-relaxed text-text-primary">
          {TRANSLATION_PASSAGES.translation.split("31 October")[0]}
          <span className="font-bold text-info">31 October</span>
          {TRANSLATION_PASSAGES.translation.split("31 October")[1]}
        </p>
      </div>

      <div className="flex items-center gap-3 py-4">
        <div className="h-px flex-1 bg-accent-2/50" />
        <span className="font-bold text-accent-2">↓</span>
        <div className="h-px flex-1 bg-accent-2/50" />
      </div>

      <div className="border border-accent-2/50 bg-accent-2-tint/50 py-10 ps-6 pe-4 sm:ps-10 sm:pe-8">
        <p className="text-overline font-bold uppercase tracking-wide text-accent-2">{t("page2.translation.meaning.label")}</p>
        <p className="mt-4 font-display text-heading-1 font-bold leading-snug text-[color:var(--esa-surface)] sm:text-display-l">
          {TRANSLATION_PASSAGES.meaning}
        </p>
        <p className="mt-6 inline-flex items-center gap-1.5 text-overline font-bold text-accent-2">
          <Icon name="spark" size={16} /> SmartArchive insight
        </p>
      </div>
    </div>
  );
}

/** §6 Preparation — photo + physical checklist. Concept. No dashboard chrome. */
export function PreparationWorkflowScene({ t }: { t: TranslateFn }) {
  return (
    <div className="mx-auto mt-10 max-w-4xl">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-10">
        <div className="overflow-hidden rounded-sm shadow-1 ring-1 ring-border/40" data-image-slot="page2-preparation">
          <img
            src="/assets/page2/page2_preparation.png"
            alt="Hands preparing checklist papers and a form on a wooden desk"
            className="block aspect-[4/3] w-full object-cover"
            style={{ objectPosition: "40% 50%" }}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div>
          <p className="font-display text-body-m font-bold text-[color:var(--esa-surface)]">{t("page2.advice.deadline")}</p>
          <p className="mt-1 text-body-m text-text-secondary">{t("page2.advice.prompt")}</p>

          <div
            className="mt-6 bg-surface-card px-5 py-6 shadow-1 ring-1 ring-border/50"
            style={{
              backgroundImage: "repeating-linear-gradient(transparent, transparent 27px, var(--border) 28px)",
              backgroundSize: "100% 28px",
            }}
          >
            <p className="mb-5 font-display text-body-m font-bold text-[color:var(--esa-surface)]">{t("page2.advice.docsTitle")}</p>
            {(["a", "b", "c"] as const).map((k) => (
              <div key={k} className="mb-3 flex items-center gap-3">
                <span className="h-4 w-4 shrink-0 border-2 border-[color:var(--esa-surface)]/40" />
                <span className="text-body-m text-text-primary">{t(`page2.advice.doc.${k}`)}</span>
              </div>
            ))}
            <p className="mt-6 font-display text-body-m font-bold text-[color:var(--esa-surface)]">{t("page2.advice.stepsTitle")}</p>
            <ol className="mt-3 space-y-2 ps-4 text-body-m text-text-secondary">
              {(["a", "b", "c", "d"] as const).map((k) => (
                <li key={k} className="list-decimal">
                  {t(`page2.advice.step.${k}`)}
                </li>
              ))}
            </ol>
          </div>

          <p className="mt-8 border-t-2 border-accent-2 pt-5 text-center font-display text-body-l font-bold text-[color:var(--esa-surface)] lg:text-start">
            {t("page2.advice.decide")}
          </p>
        </div>
      </div>
    </div>
  );
}

/** §7 Reminder — photo + calm gold date sequence. */
export function ReminderStorySequence({ t }: { t: TranslateFn }) {
  return (
    <div className="mx-auto mt-10 max-w-4xl">
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-10">
        <div className="overflow-hidden rounded-sm shadow-1 ring-1 ring-border/40" data-image-slot="page2-reminder">
          <img
            src="/assets/page2/page2_reminder.png"
            alt="Hands holding a calm calendar reminder slip for 31 October"
            className="block aspect-[4/3] w-full object-cover"
            style={{ objectPosition: "50% 50%" }}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="text-center lg:text-start">
          <p className="text-overline text-text-muted">{t("page2.reminders.step.received")}</p>
          <div className="my-6">
            <p className="text-overline font-bold uppercase tracking-wide text-text-muted">One important date</p>
            <p className="mt-2 font-display text-display-l font-bold text-accent-2">{t("page2.hero.annotation.date.value")}</p>
          </div>

          <div className="flex items-center justify-center gap-2 py-2 text-overline text-text-muted lg:justify-start" aria-hidden>
            <span>·</span>
            <span>·</span>
            <span className="text-accent-2">·</span>
            <span>·</span>
            <span>·</span>
          </div>

          <div className="py-3">
            <Icon name="bell" size={24} className="mx-auto text-accent-2 lg:mx-0" />
            <p className="mt-2 font-display text-body-m font-bold text-[color:var(--esa-surface)]">{t("page2.reminders.step.reminder")}</p>
            <p className="text-body-m font-bold text-accent-2">{t("page2.reminders.step.reminderSub")}</p>
            <p className="mt-1 text-caption text-text-muted">{t("page2.reminders.control")}</p>
          </div>

          <div className="mt-6 border-t border-border pt-5">
            <p className="font-display text-body-m font-bold text-[color:var(--esa-surface)]">User decision</p>
            <p className="mt-1 text-caption text-text-secondary">{t("page2.advice.decide")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const HISTORY_META: Record<string, { icon: IconName }> = {
  original: { icon: "document" },
  translation: { icon: "translate" },
  explanation: { icon: "spark" },
  prepared: { icon: "folder" },
  drafted: { icon: "document" },
  approved: { icon: "person" },
  sent: { icon: "checklist" },
  outcome: { icon: "link" },
};

/** §8 Weave — illustrative SVG/type only. Horizontal desktop, vertical mobile. No overflow scroll. */
export function ConnectedHistoryWeave({ t, steps }: { t: TranslateFn; steps: readonly string[] }) {
  return (
    <div className="relative mt-10 overflow-hidden pb-2">
      <svg
        className="pointer-events-none absolute inset-x-6 top-[1.35rem] hidden h-1 text-esa-teal lg:block"
        viewBox="0 0 100 2"
        preserveAspectRatio="none"
        aria-hidden
      >
        <line x1="2" y1="1" x2="98" y2="1" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" />
      </svg>
      <div className="flex flex-col items-stretch gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-1">
        {steps.map((step, i) => (
          <div key={step} className="flex flex-col items-center lg:min-w-0 lg:flex-1">
            {i > 0 && (
              <span className="mb-1 text-esa-teal lg:hidden" aria-hidden>
                ↓
              </span>
            )}
            <span
              className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                i === 0 || i === steps.length - 1
                  ? "bg-esa-teal text-esa-midnight"
                  : "border-2 border-esa-teal bg-surface-page text-esa-teal"
              }`}
            >
              <Icon name={HISTORY_META[step]?.icon ?? "link"} size={16} />
            </span>
            <p className="mt-2 max-w-[7.5rem] text-center text-[0.65rem] font-bold leading-tight text-[color:var(--esa-surface)] sm:text-overline">
              {t(`page2.history.step.${step}`)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export type { TranslateFn };
