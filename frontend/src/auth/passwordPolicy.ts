/**
 * Centralized frontend password policy.
 * Must match backend app.security.password_policy.missing_registration_password_requirements.
 */
export const PASSWORD_MIN_LENGTH = 8;

export interface PasswordRule {
  key: "minLength" | "uppercase" | "lowercase" | "number" | "symbol";
  test: (password: string) => boolean;
}

export const PASSWORD_RULES: PasswordRule[] = [
  { key: "minLength", test: (password) => password.length >= PASSWORD_MIN_LENGTH },
  { key: "uppercase", test: (password) => /[A-Z]/.test(password) },
  { key: "lowercase", test: (password) => /[a-z]/.test(password) },
  { key: "number", test: (password) => /\d/.test(password) },
  { key: "symbol", test: (password) => /[^A-Za-z0-9]/.test(password) },
];

export function unmetPasswordRules(password: string): PasswordRule[] {
  return PASSWORD_RULES.filter((rule) => !rule.test(password));
}
