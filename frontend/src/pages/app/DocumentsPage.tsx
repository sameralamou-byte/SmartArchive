import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getApiErrorMessage, isForbidden } from "../../api/errors";
import { uploadFile } from "../../api/files";
import { Alert, Button, Container, DocumentListItem } from "../../components";
import { useLocale } from "../../providers/LocaleProvider";
import { useSessionDocumentsStore } from "../../store/sessionDocuments";

export default function DocumentsPage() {
  const { t } = useLocale();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const documents = useSessionDocumentsStore((state) => state.documents);
  const addDocument = useSessionDocumentsStore((state) => state.add);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFileChange(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const uploaded = await uploadFile(file);
      addDocument(uploaded);
    } catch (err) {
      setError(
        isForbidden(err) ? t("app.forbidden") : getApiErrorMessage(err, t("app.documents.uploadError")),
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <Container width="wide" className="py-8 sm:py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-heading-1 font-bold text-text-primary">
          {t("app.documents.title")}
        </h1>
        <Button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? t("app.documents.uploading") : t("app.documents.upload")}
        </Button>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={(event) => onFileChange(event.target.files?.[0])}
        />
      </div>
      {error && (
        <Alert tone="critical" className="mt-4">
          {error}
        </Alert>
      )}
      {documents.length === 0 ? (
        <p className="mt-6 text-body-m text-text-muted">{t("app.documents.empty")}</p>
      ) : (
        <div className="mt-6 divide-y divide-border">
          {documents.map((doc) => (
            <DocumentListItem
              key={doc.id}
              icon="document"
              title={doc.title}
              subtitle={t("app.documents.justUploaded")}
              onClick={() => navigate(`/app/documents/${doc.id}`)}
            />
          ))}
        </div>
      )}
    </Container>
  );
}
