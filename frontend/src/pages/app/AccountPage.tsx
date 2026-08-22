import { Link, useNavigate } from "react-router-dom";

import { logoutAccount } from "../../api/auth";
import { Button, Container } from "../../components";
import { useLocale } from "../../providers/LocaleProvider";
import { useAuthStore } from "../../store/authStore";

export default function AccountPage() {
  const { t } = useLocale();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const clear = useAuthStore((state) => state.clear);

  async function logout() {
    try {
      await logoutAccount();
    } catch {
      /* still sign out locally */
    }
    clear();
    navigate("/login", { replace: true });
  }

  return (
    <Container width="content" className="py-8 sm:py-12">
      <h1 className="font-display text-heading-1 font-bold text-text-primary">
        {t("app.account.title")}
      </h1>
      <p className="mt-1 text-body-m text-text-muted">{t("app.account.archive")}</p>
      <dl className="mt-6 space-y-4">
        <div>
          <dt className="text-caption text-text-muted">{t("app.account.name")}</dt>
          <dd className="text-body-l text-text-primary">{user?.full_name}</dd>
        </div>
        <div>
          <dt className="text-caption text-text-muted">{t("app.account.email")}</dt>
          <dd className="text-body-l text-text-primary">{user?.email}</dd>
        </div>
        <div>
          <dt className="text-caption text-text-muted">{t("app.account.emailStatus")}</dt>
          <dd className="text-body-l text-text-primary">{t("app.account.emailConfirmed")}</dd>
        </div>
      </dl>
      <Link
        to="/app/account/security"
        className="mt-8 inline-block text-body-m text-accent no-underline hover:underline"
      >
        {t("app.account.security")}
      </Link>
      <div>
        <Button type="button" variant="secondary" className="mt-8" onClick={() => void logout()}>
          {t("app.account.logout")}
        </Button>
      </div>
    </Container>
  );
}
