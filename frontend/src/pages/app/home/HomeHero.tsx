import { useMemo } from "react";

import { useLocale } from "../../../providers/LocaleProvider";

function greetingKey(hour: number): "app.home.greetingMorning" | "app.home.greetingAfternoon" | "app.home.greetingEvening" {
  if (hour < 12) return "app.home.greetingMorning";
  if (hour < 18) return "app.home.greetingAfternoon";
  return "app.home.greetingEvening";
}

/** Document Hub hero — time-based greeting only. No personal name (Final Concept). */
export default function HomeHero() {
  const { t } = useLocale();
  const greeting = useMemo(() => t(greetingKey(new Date().getHours())), [t]);

  return (
    <header className="max-w-3xl border-b border-border pb-8">
      <p className="text-caption font-bold uppercase tracking-wide text-accent">{t("app.home.hubLabel")}</p>
      <h1 className="mt-2 font-display text-display-l font-bold text-text-primary">{greeting}</h1>
      <p className="mt-2 text-body-l text-text-muted">{t("app.home.tagline")}</p>
    </header>
  );
}
