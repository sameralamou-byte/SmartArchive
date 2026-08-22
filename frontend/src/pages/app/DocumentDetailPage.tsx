import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getApiErrorMessage, isForbidden } from "../../api/errors";
import { deleteFile, getDownloadUrl } from "../../api/files";
import { Alert, Button, Container } from "../../components";
import { useLocale } from "../../providers/LocaleProvider";
import { useSessionDocumentsStore } from "../../store/sessionDocuments";

export default function DocumentDetailPage() {
  const { t } = useLocale();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const document = useSessionDocumentsStore((state) => (id ? state.getById(id) : undefined));
  const remove = useSessionDocumentsStore((state) => state.remove);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onDownload() {
    if (!id) return;
    setBusy(true);
    setError(null);
    try {
      const url = await getDownloadUrl(id);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(
        isForbidden(err) ? t("app.forbidden") : getApiErrorMessage(err, t("app.networkError")),
      );
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!id) return;
    setBusy(true);
    setError(null);
    try {
      await deleteFile(id);
      remove(id);
      navigate("/app/documents", { replace: true });
    } catch (err) {
      setError(
        isForbidden(err) ? t("app.forbidden") : getApiErrorMessage(err, t("app.networkError")),
      );
      setBusy(false);
    }
  }

  if (!document) {
    return (
      <Container width="wide" className="py-8 sm:py-12">
        <h1 className="font-display text-heading-1 font-bold text-text-primary">
          {t("app.detail.unavailable")}
        </h1>
        <p className="mt-2 text-body-m text-text-muted">{t("app.detail.unavailableBody")}</p>
      </Container>
    );
  }

  return (
    <Container width="wide" className="py-8 sm:py-12">
      <h1 className="font-display text-heading-1 font-bold text-text-primary">{document.title}</h1>
      <p className="mt-1 text-body-m text-text-muted">{document.original_filename}</p>
      <p className="mt-1 text-caption text-text-muted">
        {document.mime_type} · {document.size_bytes} bytes
      </p>
      {error && (
        <Alert tone="critical" className="mt-4">
          {error}
        </Alert>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="button" disabled={busy} onClick={onDownload}>
          {t("app.detail.download")}
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={busy}
          onClick={() => navigate(`/app/understand?document=${document.id}`)}
        >
          {t("app.detail.understand")}
        </Button>
        {!confirmDelete ? (
          <Button type="button" variant="ghost" disabled={busy} onClick={() => setConfirmDelete(true)}>
            {t("app.detail.delete")}
          </Button>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-body-m text-text-primary">{t("app.detail.deleteConfirm")}</p>
            <Button type="button" disabled={busy} onClick={onDelete}>
              {busy ? t("app.detail.deleting") : t("app.detail.deleteConfirmAction")}
            </Button>
            <Button type="button" variant="ghost" disabled={busy} onClick={() => setConfirmDelete(false)}>
              {t("app.detail.cancel")}
            </Button>
          </div>
        )}
      </div>
    </Container>
  );
}
