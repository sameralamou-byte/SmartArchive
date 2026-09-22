import { describe, expect, it } from "vitest";

import { AUTH_DICTIONARIES } from "../providers/LocaleProvider";
import { INTERFACE_LANGUAGES } from "./languages";
import authEn from "./auth/en.json";

function placeholders(value: string): string[] {
  return [...value.matchAll(/\{[^}]+\}/g)].map((match) => match[0]).sort();
}

describe("HSA auth locale parity", () => {
  const english = authEn as Record<string, string>;
  const keys = Object.keys(english);

  it("covers the Founder-approved 12-language set", () => {
    expect([...INTERFACE_LANGUAGES]).toEqual([
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
    ]);
    expect(Object.keys(AUTH_DICTIONARIES).sort()).toEqual([...INTERFACE_LANGUAGES].sort());
  });

  it("keeps every auth key translated and non-empty in all 12 languages", () => {
    for (const language of INTERFACE_LANGUAGES) {
      const catalog = AUTH_DICTIONARIES[language];
      for (const key of keys) {
        const translated = catalog[key];
        expect(translated, `${language}:${key}`).toEqual(expect.any(String));
        expect(translated.trim(), `${language}:${key}`).not.toBe("");
        expect(placeholders(translated ?? "")).toEqual(placeholders(english[key]));
      }
      if (language === "en") continue;
      const differing = keys.filter((key) => catalog[key] !== english[key]);
      expect(differing.length / keys.length, language).toBeGreaterThan(0.8);
    }
  });
});
