import type { DocumentRead } from "../../../api/types";
import { Badge, Card, DocumentListItem } from "../../../components";
import { useLocale } from "../../../providers/LocaleProvider";
import { formatReceived } from "./homeFormat";

interface HomeAttentionSectionProps {
  documents: DocumentRead[];
  attentionDocuments: DocumentRead[];
  onOpenDocument: (id: string) => void;
}

export default function HomeAttentionSection({
  documents,
  attentionDocuments,
  onOpenDocument,
}: HomeAttentionSectionProps) {
  const { t, locale } = useLocale();

  if (documents.length === 0) {
    return (
      <section aria-labelledby="home-attention-title" className="mt-10">
        <h2 id="home-attention-title" className="font-display text-heading-3 font-bold text-text-primary">
          {t("app.home.attentionTitle")}
        </h2>
        <Card recessed className="mt-3 p-4">
          <p className="text-body-m text-text-muted">{t("app.home.attentionEmpty")}</p>
        </Card>
      </section>
    );
  }

  return (
    <section aria-labelledby="home-attention-title" className="mt-10">
      <h2 id="home-attention-title" className="font-display text-heading-3 font-bold text-text-primary">
        {t("app.home.attentionTitle")}
      </h2>
      {attentionDocuments.length === 0 ? (
        <Card recessed className="mt-3 p-4">
          <p className="text-body-m text-text-muted">{t("app.home.attentionPrimaryOnly")}</p>
        </Card>
      ) : (
        <Card className="mt-3 p-2">
          <div className="divide-y divide-border px-2">
            {attentionDocuments.map((doc) => (
              <DocumentListItem
                key={doc.id}
                icon="document"
                title={doc.title}
                subtitle={formatReceived(doc.created_at, locale)}
                trailing={<Badge tone="info">{t("app.home.attentionBadge")}</Badge>}
                onClick={() => onOpenDocument(doc.id)}
              />
            ))}
          </div>
        </Card>
      )}
    </section>
  );
}
