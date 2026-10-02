import { describe, expect, it } from "vitest";
import { formatLanguage } from "#lib/utils/formatLanguage";
import { DIRECTORY_LANGUAGES } from "../languages";

describe("DIRECTORY_LANGUAGES", () => {
  it("has a display name for every code", () => {
    for (const code of DIRECTORY_LANGUAGES) {
      expect(formatLanguage(code)).toEqual(expect.any(String));
    }
  });

  it("has no duplicate codes", () => {
    expect(new Set(DIRECTORY_LANGUAGES).size).toBe(DIRECTORY_LANGUAGES.length);
  });

  it("lists English and Spanish first", () => {
    expect(DIRECTORY_LANGUAGES.slice(0, 2)).toEqual(["en", "es"]);
  });

  it("orders the remaining codes by display name", () => {
    const names = DIRECTORY_LANGUAGES.slice(2).map(
      (code) => formatLanguage(code) ?? "",
    );

    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });
});
