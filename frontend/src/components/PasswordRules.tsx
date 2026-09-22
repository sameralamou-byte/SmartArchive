import { PASSWORD_MIN_LENGTH, PASSWORD_RULES } from "../auth/passwordPolicy";
import { useLocale } from "../providers/LocaleProvider";

export function PasswordRules({ password }: { password: string }) {
  const { t } = useLocale();
  return (
    <ul className="mt-2 space-y-1 text-caption text-text-secondary">
      {PASSWORD_RULES.map((rule) => {
        const met = rule.test(password);
        const label =
          rule.key === "minLength"
            ? t("app.register.rule.minLength", { count: String(PASSWORD_MIN_LENGTH) })
            : t(`app.register.rule.${rule.key}`);
        return (
          <li key={rule.key} className={met ? "text-success" : undefined}>
            {met ? "✓" : "•"} {label}
          </li>
        );
      })}
    </ul>
  );
}
