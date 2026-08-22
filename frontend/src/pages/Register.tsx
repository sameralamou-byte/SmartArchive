import { type FormEvent, type ReactNode, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerAccount } from "../api/auth";
import { getApiErrorMessage, isConflict, isRateLimited } from "../api/errors";
import { Alert, Button, Input, PasswordInput } from "../components";
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

export default function Register() {
  const { t } = useLocale();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [emailConfirm, setEmailConfirm] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [archiveName, setArchiveName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (email.trim().toLowerCase() !== emailConfirm.trim().toLowerCase()) {
      setError(t("app.register.emailMismatch"));
      return;
    }
    if (password !== passwordConfirm) {
      setError(t("app.register.passwordMismatch"));
      return;
    }
    setSubmitting(true);
    try {
      await registerAccount({
        email: email.trim(),
        password,
        full_name: fullName,
        organization_name: archiveName,
      });
      navigate("/register/check-email", { replace: true, state: { email: email.trim() } });
    } catch (err) {
      setError(
        isConflict(err)
          ? t("app.register.conflict")
          : isRateLimited(err)
            ? t("app.login.rateLimited")
            : getApiErrorMessage(err, t("app.register.error")),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-page px-4">
      <div className="w-full max-w-sm rounded-lg border border-border bg-surface-card p-8 shadow-1">
        <h1 className="mb-6 font-display text-heading-1 font-bold text-text-primary">
          {t("app.register.title")}
        </h1>
        <form className="space-y-4" onSubmit={onSubmit}>
          {error && <Alert tone="critical">{error}</Alert>}
          <div>
            <RequiredFieldLabel htmlFor="register-name">{t("app.register.fullName")}</RequiredFieldLabel>
            <Input
              id="register-name"
              type="text"
              autoComplete="name"
              required
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
          </div>
          <div>
            <RequiredFieldLabel htmlFor="register-email">{t("app.register.email")}</RequiredFieldLabel>
            <Input
              id="register-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div>
            <RequiredFieldLabel htmlFor="register-email-confirm">{t("app.register.emailConfirm")}</RequiredFieldLabel>
            <Input
              id="register-email-confirm"
              type="email"
              autoComplete="email"
              required
              value={emailConfirm}
              onChange={(event) => setEmailConfirm(event.target.value)}
            />
          </div>
          <div>
            <RequiredFieldLabel htmlFor="register-password">{t("app.register.password")}</RequiredFieldLabel>
            <PasswordInput
              id="register-password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <div>
            <RequiredFieldLabel htmlFor="register-password-confirm">
              {t("app.register.passwordConfirm")}
            </RequiredFieldLabel>
            <PasswordInput
              id="register-password-confirm"
              autoComplete="new-password"
              required
              minLength={8}
              value={passwordConfirm}
              onChange={(event) => setPasswordConfirm(event.target.value)}
            />
          </div>
          <div>
            <RequiredFieldLabel htmlFor="register-archive">{t("app.register.archiveName")}</RequiredFieldLabel>
            <Input
              id="register-archive"
              type="text"
              required
              value={archiveName}
              onChange={(event) => setArchiveName(event.target.value)}
            />
            <p className="mt-1 text-caption text-text-muted">{t("app.register.archiveHint")}</p>
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? t("app.register.submitting") : t("app.register.submit")}
          </Button>
        </form>
        <p className="mt-4 text-body-m text-text-muted">
          <Link to="/login" className="text-accent no-underline hover:underline">
            {t("app.register.loginLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
