import { Container, LocaleSwitcher, Toggle } from "../../components";
import { useLocale } from "../../providers/LocaleProvider";
import { useTheme } from "../../providers/ThemeProvider";

export default function SettingsPage() {
  const { t } = useLocale();
  const { theme, setTheme } = useTheme();

  return (
    <Container width="content" className="py-8 sm:py-12">
      <h1 className="font-display text-heading-1 font-bold text-text-primary">
        {t("app.settings.title")}
      </h1>
      <section className="mt-8">
        <h2 className="font-display text-heading-3 font-bold text-text-primary">
          {t("app.settings.appearance")}
        </h2>
        <div className="mt-3 flex items-center gap-3">
          <Toggle
            checked={theme === "dark"}
            onChange={(checked) => setTheme(checked ? "dark" : "light")}
            label={t("app.settings.themeDark")}
          />
          <span className="text-body-m text-text-primary">
            {theme === "dark" ? t("app.settings.themeDark") : t("app.settings.themeLight")}
          </span>
        </div>
      </section>
      <section className="mt-8">
        <h2 className="mb-3 font-display text-heading-3 font-bold text-text-primary">
          {t("app.settings.language")}
        </h2>
        <LocaleSwitcher />
      </section>
    </Container>
  );
}
