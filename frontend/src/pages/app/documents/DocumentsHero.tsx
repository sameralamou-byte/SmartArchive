import { useLocale } from "../../../providers/LocaleProvider";

interface DocumentsHeroProps {
  documentCount: number;
  uploading: boolean;
  onUpload: () => void;
}

export default function DocumentsHero({ documentCount, uploading, onUpload }: DocumentsHeroProps) {
  const { t } = useLocale();

  return (
    <header className="border-b border-border pb-8">
      <p className="text-caption font-bold uppercase tracking-wide text-accent">{t("app.nav.documents")}</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="font-display text-display-l font-bold text-text-primary">{t("app.documents.title")}</h1>
          <p className="mt-2 text-body-l text-text-muted">{t("app.documents.subtitle")}</p>
          <p className="mt-1 text-body-m text-text-secondary">{t("app.documents.sessionNote")}</p>
        </div>
        <button
          type="button"
          disabled={uploading}
          onClick={onUpload}
          className="inline-flex items-center gap-2 rounded-pill bg-accent px-5 py-3 text-body-m font-bold text-on-accent shadow-1 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60"
        >
          {uploading ? t("app.documents.uploading") : t("app.documents.upload")}
        </button>
      </div>
      {documentCount > 0 && (
        <p className="mt-4 text-body-m text-text-muted">{t("app.documents.count", { count: String(documentCount) })}</p>
      )}
    </header>
  );
}
