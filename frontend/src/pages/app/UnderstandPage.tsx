import { Link, useSearchParams } from "react-router-dom";

import { Container } from "../../components";
import { useLocale } from "../../providers/LocaleProvider";
import { useSessionDocumentsStore } from "../../store/sessionDocuments";

export default function UnderstandPage() {
  const { t } = useLocale();
  const [params] = useSearchParams();
  const documentId = params.get("document");
  const selected = useSessionDocumentsStore((state) =>
    documentId ? state.getById(documentId) : undefined,
  );

  return (
    <Container width="content" className="py-8 sm:py-12">
      <h1 className="font-display text-heading-1 font-bold text-text-primary">
        {t("app.understand.title")}
      </h1>
      {selected ? (
        <p className="mt-2 text-body-m text-text-primary">
          {t("app.understand.selected", { title: selected.title })}
        </p>
      ) : (
        <p className="mt-2 text-body-m text-text-muted">{t("app.understand.noDocument")}</p>
      )}
      <p className="mt-4 text-body-m text-text-muted">{t("app.understand.notConnected")}</p>
      <p className="mt-6 text-body-m text-text-muted">{t("app.understand.devPreviewNote")}</p>
      <Link
        to="/dev/hsa-understanding"
        className="mt-2 inline-block text-body-m text-accent no-underline hover:underline"
      >
        {t("app.understand.devPreview")}
      </Link>
    </Container>
  );
}
