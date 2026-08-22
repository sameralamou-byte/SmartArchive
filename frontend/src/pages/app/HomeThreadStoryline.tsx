import { useLocale } from "../../providers/LocaleProvider";

const STEP_KEYS = [
  "app.home.thread.document",
  "app.home.thread.understand",
  "app.home.thread.confidence",
  "app.home.thread.source",
  "app.home.thread.action",
  "app.home.thread.reminder",
  "app.home.thread.timeline",
] as const;

const STEP_CLASS =
  "inline-flex items-center rounded-pill bg-accent-tint px-2.5 py-1 text-caption font-bold text-accent";

export default function HomeThreadStoryline() {
  const { t } = useLocale();

  return (
    <section aria-label={t("app.home.threadTitle")} className="mt-10">
      <h2 className="font-display text-heading-3 font-bold text-text-primary">{t("app.home.threadTitle")}</h2>
      <ol className="mt-3 flex flex-wrap items-center gap-2">
        {STEP_KEYS.map((key, index) => (
          <li key={key} className="flex items-center gap-2">
            <span className={STEP_CLASS}>{t(key)}</span>
            {index < STEP_KEYS.length - 1 && (
              <span aria-hidden className="text-caption text-text-muted">
                →
              </span>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
