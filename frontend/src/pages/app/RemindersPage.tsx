import { Container } from "../../components";
import { useLocale } from "../../providers/LocaleProvider";

export default function RemindersPage() {
  const { t } = useLocale();
  return (
    <Container width="content" className="py-8 sm:py-12">
      <h1 className="font-display text-heading-1 font-bold text-text-primary">
        {t("app.reminders.title")}
      </h1>
      <p className="mt-2 text-body-m text-text-muted">{t("app.reminders.empty")}</p>
    </Container>
  );
}
