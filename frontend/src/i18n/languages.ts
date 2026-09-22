export const INTERFACE_LANGUAGES = [
  "en",
  "de",
  "ar",
  "es",
  "fr",
  "it",
  "nl",
  "pl",
  "pt",
  "ru",
  "tr",
  "uk",
] as const;

export type InterfaceLanguage = (typeof INTERFACE_LANGUAGES)[number];
export type Direction = "ltr" | "rtl";

export const RTL_LANGUAGES = new Set<InterfaceLanguage>(["ar"]);

export const LANGUAGE_OPTIONS: readonly { value: InterfaceLanguage; shortLabel: string; dir: Direction }[] = [
  { value: "en", shortLabel: "EN", dir: "ltr" },
  { value: "de", shortLabel: "DE", dir: "ltr" },
  { value: "ar", shortLabel: "AR", dir: "rtl" },
  { value: "es", shortLabel: "ES", dir: "ltr" },
  { value: "fr", shortLabel: "FR", dir: "ltr" },
  { value: "it", shortLabel: "IT", dir: "ltr" },
  { value: "nl", shortLabel: "NL", dir: "ltr" },
  { value: "pl", shortLabel: "PL", dir: "ltr" },
  { value: "pt", shortLabel: "PT", dir: "ltr" },
  { value: "ru", shortLabel: "RU", dir: "ltr" },
  { value: "tr", shortLabel: "TR", dir: "ltr" },
  { value: "uk", shortLabel: "UK", dir: "ltr" },
] as const;

export const HSA_LANGUAGE_STORAGE_KEY = "hsa.language";
export const LEGACY_LANGUAGE_STORAGE_KEY = "smartarchive.locale";
