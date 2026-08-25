import type { DocumentRead } from "../../../api/types";
import { Button, Card, DocumentListItem, Icon } from "../../../components";
import { useLocale } from "../../../providers/LocaleProvider";
import { formatReceived } from "./homeFormat";
import HomeThreadStoryline from "./HomeThreadStoryline";

interface HomeSidebarProps {
  threadActiveIndex: number;
  connectedDocuments: DocumentRead[];
  onOpenDocuments: () => void;
  onOpenDocument: (id: string) => void;
  onOpenUnderstand: () => void;
  onOpenReminders: () => void;
}

export default function HomeSidebar({
  threadActiveIndex,
  connectedDocuments,
  onOpenDocuments,
  onOpenDocument,
  onOpenUnderstand,
  onOpenReminders,
}: HomeSidebarProps) {
  const { t, locale } = useLocale();

  return (
    <aside className="min-w-0 space-y-6 lg:sticky lg:top-8 lg:self-start">
      <Card elevation={2} className="p-4">
        <HomeThreadStoryline activeIndex={threadActiveIndex} />
      </Card>

      <Card elevation={2} className="p-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-tint text-accent">
            <Icon name="document" size={16} />
          </span>
          <h2 className="font-display text-heading-3 font-bold text-text-primary">{t("app.home.connectedTitle")}</h2>
        </div>
        {connectedDocuments.length === 0 ? (
          <p className="mt-3 text-body-m text-text-muted">{t("app.home.connectedEmpty")}</p>
        ) : (
          <div className="mt-2 divide-y divide-border">
            {connectedDocuments.map((doc) => (
              <DocumentListItem
                key={doc.id}
                icon="document"
                title={doc.title}
                subtitle={formatReceived(doc.created_at, locale)}
                onClick={() => onOpenDocument(doc.id)}
              />
            ))}
          </div>
        )}
        <Button variant="ghost" size="sm" className="mt-2" onClick={onOpenDocuments}>
          {t("app.home.viewDocuments")}
        </Button>
      </Card>

      <Card recessed elevation={1} className="p-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-page text-text-muted">
            <Icon name="workflow" size={16} />
          </span>
          <h2 className="font-display text-heading-3 font-bold text-text-primary">{t("app.home.comingTitle")}</h2>
        </div>
        <p className="mt-3 text-body-m text-text-muted">{t("app.home.comingEmpty")}</p>
        <p className="mt-2 text-caption text-text-muted">{t("app.home.comingHint")}</p>
        <Button variant="ghost" size="sm" className="mt-3" onClick={onOpenReminders}>
          {t("app.home.openReminders")}
        </Button>
      </Card>

      <Card elevation={2} className="border border-accent/20 p-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-tint text-accent">
            <Icon name="spark" size={16} />
          </span>
          <h2 className="font-display text-heading-3 font-bold text-text-primary">{t("app.home.askTitle")}</h2>
        </div>
        <p className="mt-2 text-body-m text-text-muted">{t("app.understand.notConnected")}</p>
        <Button variant="secondary" size="sm" className="mt-3 w-full sm:w-auto" onClick={onOpenUnderstand}>
          {t("app.home.openUnderstand")}
        </Button>
      </Card>
    </aside>
  );
}
