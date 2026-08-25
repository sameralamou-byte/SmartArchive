import type { DocumentRead } from "../../../api/types";
import { Badge, Button, Card, Icon, ThreadIndicator } from "../../../components";
import { useLocale } from "../../../providers/LocaleProvider";
import { formatFileSize, formatReceived, mimeLabel } from "../home/homeFormat";

interface DocumentCardProps {
  document: DocumentRead;
  onOpen: () => void;
  onUnderstand: () => void;
}

export default function DocumentCard({ document, onOpen, onUnderstand }: DocumentCardProps) {
  const { t, locale } = useLocale();

  return (
    <Card elevation={2} className="flex h-full flex-col p-0">
      <div className="border-b border-border px-4 py-4 sm:px-5">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-recessed text-accent">
            <Icon name="document" size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-body-l font-bold text-text-primary">{document.title}</h2>
              <Badge tone="info">{mimeLabel(document.mime_type)}</Badge>
            </div>
            <p className="mt-1 break-all text-body-m text-text-muted">{document.original_filename}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 py-4 sm:px-5">
        <dl className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-md bg-surface-recessed px-3 py-2">
            <dt className="text-caption text-text-muted">{t("app.documents.receivedLabel")}</dt>
            <dd className="mt-0.5 text-body-m font-medium text-text-primary">
              {formatReceived(document.created_at, locale)}
            </dd>
          </div>
          <div className="rounded-md bg-surface-recessed px-3 py-2">
            <dt className="text-caption text-text-muted">{t("app.documents.fileSizeLabel")}</dt>
            <dd className="mt-0.5 text-body-m font-medium text-text-primary">
              {formatFileSize(document.size_bytes)}
            </dd>
          </div>
          <div className="rounded-md bg-surface-recessed px-3 py-2 sm:col-span-2">
            <dt className="text-caption text-text-muted">{t("app.documents.statusLabel")}</dt>
            <dd className="mt-0.5 text-body-m font-medium capitalize text-text-primary">{document.status}</dd>
          </div>
        </dl>

        <div className="mt-4 rounded-md border border-border bg-surface-page px-3 py-3">
          <p className="text-caption font-bold uppercase tracking-wide text-text-muted">
            {t("app.documents.understandingLabel")}
          </p>
          <ThreadIndicator state="waiting" label={t("app.home.understandingPending")} className="mt-2" />
        </div>

        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          <Button type="button" size="sm" onClick={onOpen}>
            {t("app.documents.viewDetail")}
          </Button>
          <Button type="button" size="sm" variant="secondary" onClick={onUnderstand}>
            {t("app.documents.openUnderstand")}
          </Button>
        </div>
      </div>
    </Card>
  );
}
