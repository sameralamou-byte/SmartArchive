import { useLocale } from "../../../providers/LocaleProvider";

const STEP_KEYS = [
  { key: "app.home.thread.document", desc: "app.home.thread.documentDesc" },
  { key: "app.home.thread.understand", desc: "app.home.thread.understandDesc" },
  { key: "app.home.thread.confidence", desc: "app.home.thread.confidenceDesc" },
  { key: "app.home.thread.source", desc: "app.home.thread.sourceDesc" },
  { key: "app.home.thread.action", desc: "app.home.thread.actionDesc" },
  { key: "app.home.thread.reminder", desc: "app.home.thread.reminderDesc" },
  { key: "app.home.thread.timeline", desc: "app.home.thread.timelineDesc" },
] as const;

interface HomeThreadStorylineProps {
  /**
   * Index of the current real progress step (0–6).
   * 0 = no document yet (Document active)
   * 1 = document uploaded (Document complete, Understand active) — production ceiling
   */
  activeIndex: number;
  className?: string;
}

/**
 * Canonical seven-stage Thread stepper for the Document Hub sidebar.
 * Document may be complete when an upload exists; Understand is active until
 * understanding connects; later stages stay explicitly waiting.
 */
export default function HomeThreadStoryline({ activeIndex, className = "" }: HomeThreadStorylineProps) {
  const { t } = useLocale();

  return (
    <section aria-label={t("app.home.threadTitle")} className={className}>
      <h2 className="font-display text-heading-3 font-bold text-text-primary">{t("app.home.threadTitle")}</h2>
      <p className="mt-1 text-body-m text-text-muted">{t("app.home.threadHint")}</p>
      <ol className="relative mt-5 space-y-0">
        {STEP_KEYS.map(({ key, desc }, index) => {
          const isActive = index === activeIndex;
          const isComplete = index < activeIndex;
          const isWaiting = index > activeIndex;
          const isLast = index === STEP_KEYS.length - 1;
          return (
            <li key={key} className="relative flex gap-3 pb-5 last:pb-0">
              {!isLast && (
                <span
                  aria-hidden
                  className={
                    "absolute start-[0.4375rem] top-3 bottom-0 w-px " +
                    (isComplete ? "bg-info/50" : "bg-border")
                  }
                />
              )}
              <span
                aria-hidden
                className={
                  "relative z-10 mt-1 block h-3.5 w-3.5 shrink-0 rounded-full border-2 " +
                  (isActive
                    ? "border-accent bg-accent shadow-[0_0_0_4px_var(--accent-tint)]"
                    : isComplete
                      ? "border-accent-2 bg-accent-2"
                      : "border-border bg-surface-recessed")
                }
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={
                      "inline-flex items-center rounded-pill px-2.5 py-0.5 text-caption font-bold " +
                      (isActive
                        ? "bg-accent text-on-accent"
                        : isComplete
                          ? "bg-accent-tint text-accent"
                          : "bg-surface-recessed text-text-muted")
                    }
                    aria-current={isActive ? "step" : undefined}
                  >
                    {t(key)}
                  </span>
                  {isComplete && (
                    <span className="text-caption font-bold text-success">{t("app.home.threadStepComplete")}</span>
                  )}
                  {isWaiting && (
                    <span className="text-caption text-text-muted">{t("app.home.threadStepWaiting")}</span>
                  )}
                </div>
                <p className="mt-1 text-body-m text-text-secondary">{t(desc)}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
