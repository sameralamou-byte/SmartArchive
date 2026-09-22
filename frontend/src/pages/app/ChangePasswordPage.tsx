import { type FormEvent, type ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";

import { unmetPasswordRules } from "../../auth/passwordPolicy";
import { changePassword, logoutAccount } from "../../api/auth";
import { getApiErrorMessage, isRateLimited, isUnauthorized } from "../../api/errors";
import { Alert, Button, Container, PasswordInput } from "../../components";
import { PasswordRules } from "../../components/PasswordRules";
import { useLocale } from "../../providers/LocaleProvider";
import { useAuthStore } from "../../store/authStore";

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

export default function ChangePasswordPage() {
  const { t } = useLocale();
  const navigate = useNavigate();
  const clear = useAuthStore((state) => state.clear);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (newPassword !== newPasswordConfirm) {
      setError(t("app.changePassword.mismatch"));
      return;
    }
    if (unmetPasswordRules(newPassword).length > 0) {
      setError(t("app.register.requirementsNotMet"));
      return;
    }
    setSubmitting(true);
    try {
      await changePassword(currentPassword, newPassword, newPasswordConfirm);
      try {
        await logoutAccount();
      } catch {
        /* cookie already cleared by change-password */
      }
      clear();
      navigate("/login", { replace: true });
    } catch (err) {
      setError(
        isUnauthorized(err)
          ? t("app.login.error")
          : isRateLimited(err)
            ? t("app.login.rateLimited")
            : getApiErrorMessage(err, t("app.changePassword.error")),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container width="content" className="py-8 sm:py-12">
      <h1 className="font-display text-heading-1 font-bold text-text-primary">
        {t("app.changePassword.title")}
      </h1>
      <form className="mt-6 max-w-sm space-y-4" onSubmit={onSubmit}>
        {error && <Alert tone="critical">{error}</Alert>}
        <div>
          <RequiredFieldLabel htmlFor="change-current">{t("app.changePassword.current")}</RequiredFieldLabel>
          <PasswordInput
            id="change-current"
            autoComplete="current-password"
            required
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
          />
        </div>
        <div>
          <RequiredFieldLabel htmlFor="change-new">{t("app.changePassword.next")}</RequiredFieldLabel>
          <PasswordInput
            id="change-new"
            autoComplete="new-password"
            required
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />
          <PasswordRules password={newPassword} />
        </div>
        <div>
          <RequiredFieldLabel htmlFor="change-confirm">{t("app.changePassword.confirm")}</RequiredFieldLabel>
          <PasswordInput
            id="change-confirm"
            autoComplete="new-password"
            required
            value={newPasswordConfirm}
            onChange={(event) => setNewPasswordConfirm(event.target.value)}
          />
        </div>
        <Button type="submit" disabled={submitting}>
          {submitting ? t("app.changePassword.submitting") : t("app.changePassword.submit")}
        </Button>
      </form>
    </Container>
  );
}
