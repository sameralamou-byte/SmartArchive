import { Button, Card, Icon } from "../../../components";
import { useLocale } from "../../../providers/LocaleProvider";

interface DocumentsEmptyStateProps {
  uploading: boolean;
  onUpload: () => void;
}

export default function DocumentsEmptyState({ uploading, onUpload }: DocumentsEmptyStateProps) {
  const { t } = useLocale();

  return (
    <Card elevation={3} className="mt-10 overflow-hidden p-0">
      <div className="border-b border-border bg-surface-card px-6 py-5">
        <p className="text-caption font-bold uppercase tracking-wide text-accent">{t("app.documents.emptyTitle")}</p>
        <h2 className="mt-2 font-display text-heading-2 font-bold text-text-primary">{t("app.documents.empty")}</h2>
      </div>
      <div className="px-6 py-8">
        <div className="flex min-h-[12rem] flex-col items-center justify-center rounded-md border border-dashed border-border bg-surface-recessed px-6 py-10 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-page text-text-muted">
            <Icon name="document" size={32} />
          </span>
          <p className="mt-4 max-w-prose text-body-m text-text-muted">{t("app.documents.emptyBody")}</p>
          <p className="mt-2 max-w-prose text-body-m text-text-secondary">{t("app.documents.uploadPrompt")}</p>
        </div>
        <Button type="button" className="mt-5" disabled={uploading} onClick={onUpload}>
          {uploading ? t("app.documents.uploading") : t("app.documents.upload")}
        </Button>
      </div>
    </Card>
  );
}
