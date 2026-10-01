import { describe, expect, it } from "vitest";
import { formatLanguage } from "#lib/utils/formatLanguage";
import { LANGUAGES } from "../languages";

describe("LANGUAGES", () => {
  it("has a display name for every code", () => {
    for (const code of LANGUAGES) {
      expect(formatLanguage(code)).toEqual(expect.any(String));
    }
  });

  it("has no duplicate codes", () => {
    expect(new Set(LANGUAGES).size).toBe(LANGUAGES.length);
  });

  it("lists English and Spanish first", () => {
    expect(LANGUAGES.slice(0, 2)).toEqual(["en", "es"]);
  });

  it("orders the remaining codes by display name", () => {
    const names = LANGUAGES.slice(2).map((code) => formatLanguage(code) ?? "");

    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });
});
