import { type FormEvent, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { resendVerification } from "../api/auth";
import { Alert, Button, Input } from "../components";
import { useLocale } from "../providers/LocaleProvider";
import { HsaAuthLayout } from "./HsaAuthLayout";

export default function CheckEmail() {
  const { t } = useLocale();
  const location = useLocation();
  const stateEmail = (location.state as { email?: string } | null)?.email ?? "";
  const [email, setEmail] = useState(stateEmail);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const canResend = useMemo(() => email.trim().length > 0, [email]);

  async function onResend(event: FormEvent) {
    event.preventDefault();
    if (!canResend) return;
    setSubmitting(true);
    try {
      await resendVerification(email.trim());
      setNotice(t("app.verify.resendAccepted"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <HsaAuthLayout>
        <h1 className="mb-4 font-display text-heading-1 font-bold text-text-primary">
          {t("app.verify.checkTitle")}
        </h1>
        <p className="mb-6 text-body-m text-text-secondary">
          {stateEmail
            ? t("app.verify.checkBody", { email: stateEmail })
            : t("app.verify.checkBodyUnknown")}
        </p>
        {notice && <Alert tone="success">{notice}</Alert>}
        <form className="mt-4 space-y-4" onSubmit={onResend}>
          {!stateEmail && (
            <div>
              <label htmlFor="resend-email" className="mb-1 block text-body-m text-text-secondary">
                {t("app.login.email")}
              </label>
              <Input
                id="resend-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          )}
          <Button type="submit" className="w-full" disabled={submitting || !canResend}>
            {submitting ? t("app.verify.resending") : t("app.verify.resend")}
          </Button>
        </form>
        <p className="mt-4 text-body-m text-text-muted">
          <Link to="/login" className="text-accent no-underline hover:underline">
            {t("app.verify.alreadyConfirmed")}
          </Link>
        </p>
    </HsaAuthLayout>
  );
}
