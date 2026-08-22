import { SUPPORTED_LOCALES } from "../providers/LocaleProvider";
import { useLocale } from "../providers/LocaleProvider";

/**
 * Compact language control for HSA review/QA. Uses the existing locale
 * provider — not a second i18n system.
 */
export function LocaleSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale, t } = useLocale();

  return (
    <div
      role="group"
      aria-label={t("locale.switcher")}
      className={`flex flex-wrap gap-1 ${className}`}
    >
      {SUPPORTED_LOCALES.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => setLocale(item.value)}
          aria-pressed={locale === item.value}
          className={
            "min-h-8 min-w-8 rounded-sm px-1.5 text-caption " +
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 " +
            "focus-visible:outline-accent " +
            (locale === item.value ? "font-bold text-accent" : "text-text-muted")
          }
        >
          {item.shortLabel}
        </button>
      ))}
    </div>
  );
}
