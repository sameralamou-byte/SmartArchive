import { type FormEvent, type ReactNode, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { resetPassword } from "../api/auth";
import { getApiErrorMessage, isRateLimited } from "../api/errors";
import { Alert, Button, PasswordInput } from "../components";
import { useLocale } from "../providers/LocaleProvider";

function RequiredFieldLabel({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1 flex items-baseline gap-1 text-body-m text-text-secondary">
      <span>{children}</span>
      <span aria-hidden="true" className="text-critical">
        *
      </span>
    </label>
  );
}

export default function ResetPassword() {
  const { t } = useLocale();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [token] = useState(() => searchParams.get("token") ?? "");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    navigate("/reset-password", { replace: true });
  }, [navigate]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (password !== passwordConfirm) {
      setError(t("app.reset.mismatch"));
      return;
    }
    if (!token) {
      setError(t("app.reset.invalid"));
      return;
    }
    setSubmitting(true);
    try {
      await resetPassword(token, password, passwordConfirm);
      setSuccess(true);
    } catch (err) {
      setError(
        isRateLimited(err) ? t("app.login.rateLimited") : getApiErrorMessage(err, t("app.reset.invalid")),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-page px-4">
      <div className="w-full max-w-sm rounded-lg border border-border bg-surface-card p-8 shadow-1">
        <h1 className="mb-6 font-display text-heading-1 font-bold text-text-primary">
          {t("app.reset.title")}
        </h1>
        {success ? (
          <>
            <Alert tone="success">{t("app.reset.success")}</Alert>
            <p className="mt-4 text-body-m text-text-secondary">{t("app.reset.unverifiedReminder")}</p>
            <Link to="/login" className="mt-6 block">
              <Button type="button" className="w-full">
                {t("app.verify.signIn")}
              </Button>
            </Link>
          </>
        ) : (
          <form className="space-y-4" onSubmit={onSubmit}>
            {error && <Alert tone="critical">{error}</Alert>}
            <div>
              <RequiredFieldLabel htmlFor="reset-password">{t("app.reset.password")}</RequiredFieldLabel>
              <PasswordInput
                id="reset-password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <div>
              <RequiredFieldLabel htmlFor="reset-password-confirm">
                {t("app.reset.passwordConfirm")}
              </RequiredFieldLabel>
              <PasswordInput
                id="reset-password-confirm"
                autoComplete="new-password"
                required
                value={passwordConfirm}
                onChange={(event) => setPasswordConfirm(event.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? t("app.reset.submitting") : t("app.reset.submit")}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
