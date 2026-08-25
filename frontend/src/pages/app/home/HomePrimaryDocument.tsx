import { useRef } from "react";

import type { DocumentRead } from "../../../api/types";
import {
  Badge,
  Button,
  Card,
  CitationChip,
  DocumentMarginalia,
  Icon,
  SourceTraceView,
  WeaveThread,
} from "../../../components";
import { useLocale } from "../../../providers/LocaleProvider";
import { formatFileSize, formatReceived, mimeLabel } from "./homeFormat";
import HomeWhatsImportant from "./HomeWhatsImportant";

interface HomePrimaryDocumentProps {
  document: DocumentRead;
  onViewDocument: () => void;
  onOpenUnderstand: () => void;
}

/**
 * Document Hub primary area — real session document + What's Important tile.
 * No fabricated letter body, seals, or agency branding.
 */
export default function HomePrimaryDocument({
  document,
  onViewDocument,
  onOpenUnderstand,
}: HomePrimaryDocumentProps) {
  const { t, locale } = useLocale();
  const frameRef = useRef<HTMLDivElement>(null);
  const originRef = useRef<HTMLElement>(null);
  const nodeRef = useRef<HTMLSpanElement>(null);
  const originalRef = useRef<HTMLElement>(null);

  return (
    <section aria-labelledby="home-primary-title" className="mt-8">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <h2 id="home-primary-title" className="font-display text-heading-2 font-bold text-text-primary">
          {t("app.home.primaryTitle")}
        </h2>
        <Badge tone="info">{mimeLabel(document.mime_type)}</Badge>
      </div>

      <div ref={frameRef} className="relative overflow-visible">
        <WeaveThread frameRef={frameRef} originRef={originRef} nodeRef={nodeRef} />
        <SourceTraceView
          className="gap-5 md:gap-6"
          document={
            <Card elevation={2} className="h-full overflow-visible p-0">
              <article
                ref={originalRef}
                id={`home-document-${document.id}`}
                tabIndex={-1}
                className="min-w-0 p-5 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:p-6"
              >
                <div className="mb-5 flex min-h-[8rem] flex-col items-center justify-center rounded-md border border-dashed border-border bg-surface-recessed px-4 py-6 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-page text-accent">
                    <Icon name="document" size={24} />
                  </span>
                  <p className="mt-3 text-caption font-bold uppercase tracking-wide text-text-muted">
                    {t("hsa.document.originalLabel")}
                  </p>
                  <p className="mt-1 max-w-full break-all text-body-m font-medium text-text-primary">
                    <DocumentMarginalia ref={originRef} note={t("app.home.marginaliaFilename")}>
                      {document.original_filename}
                    </DocumentMarginalia>
                  </p>
                </div>

                <h3
                  aria-label={document.title}
                  className="font-display text-heading-2 font-bold leading-snug text-text-primary"
                >
                  {document.title}
                </h3>

                <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-md border border-border bg-surface-page px-3 py-2.5">
                    <dt className="text-caption text-text-muted">{t("app.home.sourceLabel")}</dt>
                    <dd className="mt-0.5 break-all text-body-m font-medium text-text-primary">
                      {document.original_filename}
                    </dd>
                  </div>
                  <div className="rounded-md border border-border bg-surface-page px-3 py-2.5">
                    <dt className="text-caption text-text-muted">{t("app.home.receivedLabel")}</dt>
                    <dd className="mt-0.5 text-body-m font-medium text-text-primary">
                      {formatReceived(document.created_at, locale)}
                    </dd>
                  </div>
                  <div className="rounded-md border border-border bg-surface-page px-3 py-2.5">
                    <dt className="text-caption text-text-muted">{t("app.home.fileSizeLabel")}</dt>
                    <dd className="mt-0.5 text-body-m font-medium text-text-primary">
                      {formatFileSize(document.size_bytes)}
                    </dd>
                  </div>
                  <div className="rounded-md border border-border bg-surface-page px-3 py-2.5">
                    <dt className="text-caption text-text-muted">{t("app.home.statusLabel")}</dt>
                    <dd className="mt-0.5 text-body-m font-medium capitalize text-text-primary">{document.status}</dd>
                  </div>
                </dl>

                <div className="mt-5 flex flex-wrap gap-2">
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
                  <Button type="button" size="sm" variant="ghost" onClick={onViewDocument}>
                    {t("app.home.viewDocument")}
                  </Button>
                </div>
              </article>
            </Card>
          }
          explanation={
            <Card elevation={2} className="h-full p-5 sm:p-6">
              <HomeWhatsImportant nodeRef={nodeRef} onOpenUnderstand={onOpenUnderstand} />
            </Card>
          }
        />
      </div>
    </section>
  );
}
