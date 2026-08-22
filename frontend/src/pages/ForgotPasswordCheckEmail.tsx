import { Link } from "react-router-dom";

import { useLocale } from "../providers/LocaleProvider";

export default function ForgotPasswordCheckEmail() {
  const { t } = useLocale();

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-page px-4">
      <div className="w-full max-w-sm rounded-lg border border-border bg-surface-card p-8 shadow-1">
        <h1 className="mb-4 font-display text-heading-1 font-bold text-text-primary">
          {t("app.forgot.checkTitle")}
        </h1>
        <p className="mb-6 text-body-m text-text-secondary">{t("app.forgot.checkBody")}</p>
        <p className="text-body-m text-text-muted">
          <Link to="/login" className="text-accent no-underline hover:underline">
            {t("app.forgot.backToLogin")}
          </Link>
        </p>
      </div>
    </div>
  );
}
