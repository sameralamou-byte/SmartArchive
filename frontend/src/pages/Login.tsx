import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { fetchCurrentUser, login, resendVerification } from "../api/auth";
import { getApiErrorMessage, isEmailNotVerified, isRateLimited, isUnauthorized } from "../api/errors";
import { Alert, Button, Checkbox, Input, PasswordInput } from "../components";
import { useLocale } from "../providers/LocaleProvider";
import { useAuthStore } from "../store/authStore";

export default function Login() {
  const { t } = useLocale();
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUser = useAuthStore((state) => state.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unverified, setUnverified] = useState(false);
  const [resendNotice, setResendNotice] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setUnverified(false);
    setResendNotice(null);
    try {
      const tokens = await login(email, password, rememberMe);
      setAccessToken(tokens.access_token);
      const profile = await fetchCurrentUser();
      setUser({
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        is_active: profile.is_active,
        email_verified: profile.email_verified,
      });
      navigate("/app", { replace: true });
    } catch (err) {
      if (isEmailNotVerified(err)) {
        setUnverified(true);
        setError(t("app.login.unverified"));
      } else {
        setError(
          isUnauthorized(err)
            ? t("app.login.error")
            : isRateLimited(err)
              ? t("app.login.rateLimited")
              : getApiErrorMessage(err, t("app.networkError")),
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function onResend() {
    await resendVerification(email.trim());
    setResendNotice(t("app.verify.resendAccepted"));
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-page px-4">
      <div className="w-full max-w-sm rounded-lg border border-border bg-surface-card p-8 shadow-1">
        <h1 className="mb-6 font-display text-heading-1 font-bold text-text-primary">
          {t("app.login.title")}
        </h1>
        <form className="space-y-4" onSubmit={onSubmit}>
          {error && <Alert tone={unverified ? "warning" : "critical"}>{error}</Alert>}
          {resendNotice && <Alert tone="success">{resendNotice}</Alert>}
          <div>
            <label htmlFor="login-email" className="mb-1 block text-body-m text-text-secondary">
              {t("app.login.email")}
            </label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="login-password" className="mb-1 block text-body-m text-text-secondary">
              {t("app.login.password")}
            </label>
            <PasswordInput
              id="login-password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <label htmlFor="login-remember" className="flex items-center gap-2 text-body-m text-text-secondary">
            <Checkbox
              id="login-remember"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
            />
            {t("app.login.rememberMe")}
          </label>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? t("app.login.submitting") : t("app.login.submit")}
          </Button>
        </form>
        {unverified && (
          <div className="mt-4 space-y-2">
            <Button type="button" variant="secondary" className="w-full" onClick={onResend}>
              {t("app.verify.resend")}
            </Button>
            <p className="text-body-m text-text-muted">
              <Link
                to="/register/check-email"
                state={{ email: email.trim() }}
                className="text-accent no-underline hover:underline"
              >
                {t("app.verify.checkTitle")}
              </Link>
            </p>
          </div>
        )}
        <p className="mt-4 text-body-m text-text-muted">
          <Link to="/forgot-password" className="text-accent no-underline hover:underline">
            {t("app.login.forgotPassword")}
          </Link>
        </p>
        <p className="mt-2 text-body-m text-text-muted">
          <Link to="/register" className="text-accent no-underline hover:underline">
            {t("app.login.registerLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
