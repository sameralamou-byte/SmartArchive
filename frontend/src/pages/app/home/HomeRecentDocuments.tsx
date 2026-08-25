import type { DocumentRead } from "../../../api/types";
import { Badge, Card, DocumentListItem } from "../../../components";
import { useLocale } from "../../../providers/LocaleProvider";
import { formatReceived } from "./homeFormat";

interface HomeRecentDocumentsProps {
  documents: DocumentRead[];
  connectedDocuments: DocumentRead[];
  primaryDocumentId: string | null;
  onOpenDocument: (id: string) => void;
  onOpenDocuments: () => void;
}

export default function HomeRecentDocuments({
  documents,
  connectedDocuments,
  primaryDocumentId,
  onOpenDocument,
  onOpenDocuments,
}: HomeRecentDocumentsProps) {
  const { t, locale } = useLocale();
  const connectedIds = new Set(connectedDocuments.map((doc) => doc.id));
  const recentDocuments = documents.filter(
    (doc) => doc.id === primaryDocumentId || !connectedIds.has(doc.id),
  );

  return (
    <section aria-labelledby="home-recent-title" className="mt-10">
      <h2 id="home-recent-title" className="font-display text-heading-3 font-bold text-text-primary">
        {t("app.home.recentTitle")}
      </h2>
      {recentDocuments.length === 0 ? (
        <Card recessed className="mt-3 p-4">
          <p className="text-body-m text-text-muted">{t("app.home.recentEmpty")}</p>
        </Card>
      ) : (
        <Card className="mt-3 p-2">
          <div className="divide-y divide-border px-2">
            {recentDocuments.slice(0, 5).map((doc) => (
              <DocumentListItem
                key={doc.id}
                icon="document"
                title={doc.title}
                subtitle={formatReceived(doc.created_at, locale)}
                trailing={
                  doc.id === primaryDocumentId ? (
                    <Badge tone="info">{t("app.home.focusBadge")}</Badge>
                  ) : (
                    <Badge tone="neutral">{t("app.home.sessionBadge")}</Badge>
                  )
                }
                onClick={() => onOpenDocument(doc.id)}
              />
            ))}
          </div>
        </Card>
      )}
      {recentDocuments.length > 0 && (
        <button
          type="button"
          onClick={onOpenDocuments}
          className="mt-2 text-body-m font-bold text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {t("app.home.viewDocuments")}
        </button>
      )}
    </section>
  );
}
