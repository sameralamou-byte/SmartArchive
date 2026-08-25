import { Button, Card, Icon } from "../../../components";
import { useLocale } from "../../../providers/LocaleProvider";

interface HomeEmptyArchiveProps {
  onUpload: () => void;
}

/** Calm empty Document Hub — single upload prompt, no dimmed fake-preview tiles. */
export default function HomeEmptyArchive({ onUpload }: HomeEmptyArchiveProps) {
  const { t } = useLocale();

  return (
    <Card elevation={2} className="mt-8 overflow-hidden p-0">
      <div className="px-6 py-10 sm:px-10 sm:py-12">
        <div className="mx-auto flex max-w-lg flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-tint text-accent">
            <Icon name="document" size={24} />
          </span>
          <h2 className="mt-5 font-display text-heading-2 font-bold text-text-primary">
            {t("app.home.primaryEmptyHeadline")}
          </h2>
          <p className="mt-3 text-body-m text-text-muted">{t("app.home.primaryEmptyBody")}</p>
          <Button type="button" className="mt-6" onClick={onUpload}>
            {t("app.home.primaryUpload")}
          </Button>
        </div>
      </div>
    </Card>
  );
}
