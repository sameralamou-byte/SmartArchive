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
import {
  HSA_LANGUAGE_STORAGE_KEY,
  INTERFACE_LANGUAGES,
  LANGUAGE_OPTIONS,
  LEGACY_LANGUAGE_STORAGE_KEY,
  RTL_LANGUAGES,
  type Direction,
  type InterfaceLanguage,
} from "../i18n/languages";
import authEn from "../i18n/auth/en.json";
import authDe from "../i18n/auth/de.json";
import authAr from "../i18n/auth/ar.json";
import authEs from "../i18n/auth/es.json";
import authFr from "../i18n/auth/fr.json";
import authIt from "../i18n/auth/it.json";
import authNl from "../i18n/auth/nl.json";
import authPl from "../i18n/auth/pl.json";
import authPt from "../i18n/auth/pt.json";
import authRu from "../i18n/auth/ru.json";
import authTr from "../i18n/auth/tr.json";
import authUk from "../i18n/auth/uk.json";

export type Locale = InterfaceLanguage;
export type { Direction };

const APP_DICTIONARIES: Partial<Record<Locale, Record<string, string>>> = {
  en,
  de,
  ar,
  ru,
  uk,
  fr,
  es,
};

export const AUTH_DICTIONARIES: Record<Locale, Record<string, string>> = {
  en: authEn,
  de: authDe,
  ar: authAr,
  es: authEs,
  fr: authFr,
  it: authIt,
  nl: authNl,
  pl: authPl,
  pt: authPt,
  ru: authRu,
  tr: authTr,
  uk: authUk,
};

export const SUPPORTED_LOCALES = LANGUAGE_OPTIONS;

interface LocaleContextValue {
  locale: Locale;
  dir: Direction;
  setLocale: (locale: Locale) => void;
  t: (key: string, vars?: Record<string, string>) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function directionFor(locale: Locale): Direction {
  return RTL_LANGUAGES.has(locale) ? "rtl" : "ltr";
}

function isLocale(value: string | null): value is Locale {
  return value !== null && (INTERFACE_LANGUAGES as readonly string[]).includes(value);
}

function readInitialLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const stored =
    window.localStorage.getItem(HSA_LANGUAGE_STORAGE_KEY) ??
    window.localStorage.getItem(LEGACY_LANGUAGE_STORAGE_KEY);
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
    window.localStorage.setItem(HSA_LANGUAGE_STORAGE_KEY, next);
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string>) => {
      const auth = AUTH_DICTIONARIES[locale]?.[key] ?? AUTH_DICTIONARIES.en[key];
      const app = APP_DICTIONARIES[locale]?.[key] ?? APP_DICTIONARIES.en?.[key];
      return interpolate(auth ?? app ?? key, vars);
    },
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
