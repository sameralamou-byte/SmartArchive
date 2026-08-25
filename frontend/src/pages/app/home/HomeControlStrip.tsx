import { Icon } from "../../../components";
import { useLocale } from "../../../providers/LocaleProvider";

export default function HomeControlStrip() {
  const { t } = useLocale();

  const pillars = [
    { icon: "shield" as const, title: t("hsa.control.message"), body: t("app.home.controlNote") },
    { icon: "spark" as const, title: t("app.home.privacyTitle"), body: t("app.home.privacyNote") },
    { icon: "workflow" as const, title: t("app.home.builtForTitle"), body: t("app.home.builtForNote") },
  ];

  return (
    <footer className="mt-12 rounded-md border border-border bg-surface-recessed px-5 py-5">
      <div className="grid gap-4 sm:grid-cols-3">
        {pillars.map((pillar) => (
          <div key={pillar.title} className="flex gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-page text-accent">
              <Icon name={pillar.icon} size={20} />
            </span>
            <div>
              <p className="font-display text-body-l font-bold text-text-primary">{pillar.title}</p>
              <p className="mt-1 text-body-m text-text-muted">{pillar.body}</p>
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
}
