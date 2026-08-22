import { useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import type { DocumentRead } from "../../api/types";
import {
  Alert,
  Badge,
  Button,
  Card,
  CitationChip,
  Container,
  DocumentListItem,
  SourceTraceView,
  ThreadIndicator,
  UnderstandBar,
} from "../../components";
import { useLocale } from "../../providers/LocaleProvider";
import { useAuthStore } from "../../store/authStore";
import { useSessionDocumentsStore } from "../../store/sessionDocuments";
import HomeThreadStoryline from "./HomeThreadStoryline";

function greetingKey(hour: number): "app.home.greetingMorning" | "app.home.greetingAfternoon" | "app.home.greetingEvening" {
  if (hour < 12) return "app.home.greetingMorning";
  if (hour < 18) return "app.home.greetingAfternoon";
  return "app.home.greetingEvening";
}

function formatReceived(iso: string, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function PrimaryDocumentFocus({ document }: { document: DocumentRead }) {
  const { t, locale } = useLocale();
  const navigate = useNavigate();
  const originalRef = useRef<HTMLElement>(null);

  return (
    <section aria-labelledby="home-primary-title" className="mt-10">
      <h2 id="home-primary-title" className="font-display text-heading-3 font-bold text-text-primary">
        {t("app.home.primaryTitle")}
      </h2>

      <div className="mt-4">
        <SourceTraceView
          document={
            <article
              ref={originalRef}
              id={`home-document-${document.id}`}
              tabIndex={-1}
              className="min-w-0 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <h3 className="font-display text-heading-3 font-bold text-text-primary">{document.title}</h3>
              <dl className="mt-3 space-y-2 text-body-m">
                <div className="flex flex-wrap gap-x-2">
                  <dt className="text-text-muted">{t("app.home.sourceLabel")}</dt>
                  <dd className="text-text-primary">{document.original_filename}</dd>
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <dt className="text-text-muted">{t("app.home.receivedLabel")}</dt>
                  <dd className="text-text-primary">{formatReceived(document.created_at, locale)}</dd>
                </div>
              </dl>
              <div className="mt-4">
                <CitationChip
                  href={`#home-document-${document.id}`}
                  onClick={(event) => {
                    event.preventDefault();
                    originalRef.current?.focus();
                    originalRef.current?.scrollIntoView({ block: "nearest" });
                  }}
                >
                  {t("hsa.document.viewOriginal")}
                </CitationChip>
              </div>
            </article>
          }
          explanation={
            <div className="flex min-w-0 flex-col gap-4">
              <h3 className="font-display text-heading-3 font-bold text-text-primary">{t("app.home.whatThisMeans")}</h3>
              <ThreadIndicator state="waiting" label={t("app.home.understandingPending")} />
              <p className="text-body-m text-text-muted">{t("hsa.document.languageNote")}</p>
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" onClick={() => navigate(`/app/documents/${document.id}`)}>
                  {t("app.home.viewDocument")}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => navigate(`/app/understand?document=${document.id}`)}
                >
                  {t("app.home.openUnderstand")}
                </Button>
              </div>
            </div>
          }
        />
      </div>
    </section>
  );
}

export default function HomePage() {
  const { t, locale } = useLocale();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const documents = useSessionDocumentsStore((state) => state.documents);
  const name = user?.full_name ?? "";
  const greeting = useMemo(
    () => t(greetingKey(new Date().getHours()), { name }),
    [t, name],
  );
  const primaryDocument = documents[0];
  const connectedDocuments = documents.slice(1, 4);

  return (
    <Container width="wide" className="py-8 sm:py-12">
      <header className="max-w-prose">
        <h1 className="font-display text-display-l font-bold text-text-primary">{greeting}</h1>
        <p className="mt-1 text-body-l text-text-muted">{t("app.home.tagline")}</p>
      </header>

      {documents.length > 0 && (
        <Alert tone="info" className="mt-6">
          {t("app.home.attentionBanner", { count: String(documents.length) })}
        </Alert>
      )}

      <div
        className="mt-6 max-w-lg cursor-pointer"
        role="link"
        tabIndex={0}
        onClick={() => navigate("/app/understand")}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            navigate("/app/understand");
          }
        }}
        aria-label={t("app.home.askTitle")}
      >
        <UnderstandBar density="home" onUpload={() => navigate("/app/documents")} readOnly tabIndex={-1} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)] lg:gap-8">
        <div className="min-w-0">
          <section aria-labelledby="home-attention-title">
            <h2 id="home-attention-title" className="font-display text-heading-3 font-bold text-text-primary">
              {t("app.home.attentionTitle")}
            </h2>
            {documents.length === 0 ? (
              <p className="mt-2 text-body-m text-text-muted">{t("app.home.attentionEmpty")}</p>
            ) : (
              <div className="mt-2 divide-y divide-border">
                {documents.slice(0, 3).map((doc) => (
                  <DocumentListItem
                    key={doc.id}
                    icon="document"
                    title={doc.title}
                    subtitle={t("app.home.attentionReview")}
                    trailing={<Badge tone="warning">{t("app.home.attentionBadge")}</Badge>}
                    onClick={() => navigate(`/app/documents/${doc.id}`)}
                  />
                ))}
              </div>
            )}
          </section>

          {primaryDocument ? (
            <PrimaryDocumentFocus document={primaryDocument} />
          ) : (
            <Card className="mt-10">
              <h2 className="font-display text-heading-3 font-bold text-text-primary">{t("app.home.primaryEmptyTitle")}</h2>
              <p className="mt-2 text-body-m text-text-muted">{t("app.home.primaryEmptyBody")}</p>
              <Button type="button" className="mt-4" onClick={() => navigate("/app/documents")}>
                {t("app.home.primaryUpload")}
              </Button>
            </Card>
          )}

          <HomeThreadStoryline />

          <p className="mt-6 text-body-m text-text-muted">{t("hsa.control.message")}</p>
        </div>

        <aside className="min-w-0 space-y-10 lg:pt-0">
          <section aria-labelledby="home-connected-title">
            <h2 id="home-connected-title" className="font-display text-heading-3 font-bold text-text-primary">
              {t("app.home.connectedTitle")}
            </h2>
            {connectedDocuments.length === 0 ? (
              <p className="mt-2 text-body-m text-text-muted">{t("app.home.recentEmpty")}</p>
            ) : (
              <div className="mt-2 divide-y divide-border">
                {connectedDocuments.map((doc) => (
                  <DocumentListItem
                    key={doc.id}
                    icon="document"
                    title={doc.title}
                    subtitle={formatReceived(doc.created_at, locale)}
                    onClick={() => navigate(`/app/documents/${doc.id}`)}
                  />
                ))}
              </div>
            )}
            <Button variant="ghost" size="sm" className="mt-2" onClick={() => navigate("/app/documents")}>
              {t("app.home.viewDocuments")}
            </Button>
          </section>

          <section aria-labelledby="home-coming-title">
            <h2 id="home-coming-title" className="font-display text-heading-3 font-bold text-text-primary">
              {t("app.home.comingTitle")}
            </h2>
            <p className="mt-2 text-body-m text-text-muted">{t("app.home.comingEmpty")}</p>
          </section>

          <section aria-labelledby="home-ask-title">
            <h2 id="home-ask-title" className="font-display text-heading-3 font-bold text-text-primary">
              {t("app.home.askTitle")}
            </h2>
            <p className="mt-2 text-body-m text-text-muted">{t("app.understand.notConnected")}</p>
            <Link
              to="/app/understand"
              className="mt-2 inline-block text-body-m text-accent no-underline hover:underline"
            >
              {t("app.home.openUnderstand")}
            </Link>
          </section>
        </aside>
      </div>
    </Container>
  );
}
