import { useLocale } from "../providers/LocaleProvider";
import { useAuthStore } from "../store/authStore";

export default function NotFound() {
  const { t } = useLocale();
  const accessToken = useAuthStore((state) => state.accessToken);
  return (
    <div
      className={
        accessToken
          ? "px-4 py-16 text-center"
          : "flex min-h-screen items-center justify-center bg-surface-page px-4"
      }
    >
      <p className="text-body-m text-text-muted">{t("app.notFound")}</p>
    </div>
  );
}
