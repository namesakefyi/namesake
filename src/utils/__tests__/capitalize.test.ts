import { describe, expect, it } from "vitest";
import { capitalize } from "../capitalize";

describe("capitalize", () => {
  it("should capitalize the first letter of a string", () => {
    expect(capitalize("hello")).toBe("Hello");
  });

  it("should capitalize the first letter of a string with a custom locale", () => {
    expect(capitalize("hello", "fr")).toBe("Hello");
  });

  it("should properly uppercase other locales", () => {
    expect(capitalize("italya", "tr")).toBe("İtalya");
  });

  it("should properly uppercase non-standard code units", () => {
    expect(capitalize("𐐶𐐲𐑌𐐼𐐲𐑉")).toBe("𐐎𐐲𐑌𐐼𐐲𐑉");
  });

  it("should uppercase digraphs", () => {
    expect(capitalize("ĳsselmeer", "nl")).toBe("Ĳsselmeer");
  });
});
