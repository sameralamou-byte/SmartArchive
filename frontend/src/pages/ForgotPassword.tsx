import { type FormEvent, type ReactNode, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { forgotPassword } from "../api/auth";
import { Alert, Button, Input } from "../components";
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

export default function ForgotPassword() {
  const { t } = useLocale();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await forgotPassword(email.trim());
      navigate("/forgot-password/check-email", { replace: true });
    } catch {
      setError(t("app.networkError"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-page px-4">
      <div className="w-full max-w-sm rounded-lg border border-border bg-surface-card p-8 shadow-1">
        <h1 className="mb-6 font-display text-heading-1 font-bold text-text-primary">
          {t("app.forgot.title")}
        </h1>
        <form className="space-y-4" onSubmit={onSubmit}>
          {error && <Alert tone="critical">{error}</Alert>}
          <div>
            <RequiredFieldLabel htmlFor="forgot-email">{t("app.login.email")}</RequiredFieldLabel>
            <Input
              id="forgot-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? t("app.forgot.submitting") : t("app.forgot.submit")}
          </Button>
        </form>
        <p className="mt-4 text-body-m text-text-muted">
          <Link to="/login" className="text-accent no-underline hover:underline">
            {t("app.forgot.backToLogin")}
          </Link>
        </p>
      </div>
    </div>
  );
}
