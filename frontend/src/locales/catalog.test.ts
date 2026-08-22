import { describe, expect, it } from "vitest";
import en from "./en.json";
import de from "./de.json";
import ar from "./ar.json";
import ru from "./ru.json";
import uk from "./uk.json";
import fr from "./fr.json";
import es from "./es.json";

const catalogs = { en, de, ar, ru, uk, fr, es } as const;

describe("locale catalogs", () => {
  it("keeps the same keys in every supported language", () => {
    const expected = Object.keys(en).sort();
    for (const [locale, catalog] of Object.entries(catalogs)) {
      expect(Object.keys(catalog).sort(), locale).toEqual(expected);
    }
  });

  it("does not leave English placeholders in non-English HSA strings", () => {
    for (const [locale, catalog] of Object.entries(catalogs)) {
      if (locale === "en") continue;
      expect(catalog["hsa.control.message"]).not.toBe(en["hsa.control.message"]);
      expect(catalog["confidence.high"]).not.toBe("");
    }
  });
});
