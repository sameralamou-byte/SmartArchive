import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import en from "../locales/en.json";
import de from "../locales/de.json";
import ar from "../locales/ar.json";
import ru from "../locales/ru.json";
import uk from "../locales/uk.json";
import fr from "../locales/fr.json";
import es from "../locales/es.json";

export type Locale = "en" | "de" | "ar" | "ru" | "uk" | "fr" | "es";
export type Direction = "ltr" | "rtl";

const DICTIONARIES: Record<Locale, Record<string, string>> = { en, de, ar, ru, uk, fr, es };
const RTL_LOCALES: readonly Locale[] = ["ar"];
const STORAGE_KEY = "smartarchive.locale";

export const SUPPORTED_LOCALES: readonly { value: Locale; shortLabel: string; dir: Direction }[] = [
  { value: "en", shortLabel: "EN", dir: "ltr" },
  { value: "de", shortLabel: "DE", dir: "ltr" },
  { value: "ar", shortLabel: "AR", dir: "rtl" },
  { value: "ru", shortLabel: "RU", dir: "ltr" },
  { value: "uk", shortLabel: "UK", dir: "ltr" },
  { value: "fr", shortLabel: "FR", dir: "ltr" },
  { value: "es", shortLabel: "ES", dir: "ltr" },
] as const;

interface LocaleContextValue {
  locale: Locale;
  dir: Direction;
  setLocale: (locale: Locale) => void;
  /** Translate a key from the current locale's dictionary, falling back to English, then the key itself. */
  t: (key: string, vars?: Record<string, string>) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function directionFor(locale: Locale): Direction {
  return RTL_LOCALES.includes(locale) ? "rtl" : "ltr";
}

function isLocale(value: string | null): value is Locale {
  return value !== null && value in DICTIONARIES;
}

function readInitialLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (isLocale(stored)) return stored;
  const nav = window.navigator.language?.slice(0, 2);
  if (isLocale(nav)) return nav;
  return "en";
}

function interpolate(template: string, vars?: Record<string, string>): string {
  if (!vars) return template;
  return Object.entries(vars).reduce(
    (acc, [key, value]) => acc.replaceAll(`{${key}}`, value),
    template,
  );
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readInitialLocale);
  const dir = directionFor(locale);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string>) =>
      interpolate(DICTIONARIES[locale][key] ?? DICTIONARIES.en[key] ?? key, vars),
    [locale],
  );

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, dir, setLocale, t }),
    [locale, dir, setLocale, t],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}
