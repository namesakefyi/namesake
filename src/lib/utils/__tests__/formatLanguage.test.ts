import { describe, expect, it } from "vitest";
import { formatLanguage } from "../formatLanguage";

describe("formatLanguage", () => {
  it("returns undefined when code is undefined", () => {
    expect(formatLanguage()).toBeUndefined();
    expect(formatLanguage(undefined)).toBeUndefined();
  });

  it("returns undefined when code is empty", () => {
    expect(formatLanguage("")).toBeUndefined();
  });

  it("returns the English language name by default", () => {
    expect(formatLanguage("en")).toBe("English");
    expect(formatLanguage("es")).toBe("Spanish");
    expect(formatLanguage("fr")).toBe("French");
  });

  it("returns the native language name when native is true", () => {
    expect(formatLanguage("es", true)).toBe("Español");
    expect(formatLanguage("fr", true)).toBe("Français");
  });

  it("returns the English name when native is false", () => {
    expect(formatLanguage("es", false)).toBe("Spanish");
  });
});
