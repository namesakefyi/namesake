import { describe, expect, it } from "vitest";
import { capitalizeFirstLetter } from "./capitalizeFirstLetter";

describe("capitalizeFirstLetter", () => {
  it("should capitalize the first letter of a string", () => {
    expect(capitalizeFirstLetter("hello")).toBe("Hello");
  });

  it("should capitalize the first letter of a string with a custom locale", () => {
    expect(capitalizeFirstLetter("hello", "fr")).toBe("Hello");
  });

  it("should properly uppercase other locales", () => {
    expect(capitalizeFirstLetter("italya", "tr")).toBe("İtalya");
  });

  it("should properly uppercase non-standard code units", () => {
    expect(capitalizeFirstLetter("𐐶𐐲𐑌𐐼𐐲𐑉")).toBe("𐐎𐐲𐑌𐐼𐐲𐑉");
  });

  it("should uppercase digraphs", () => {
    expect(capitalizeFirstLetter("ĳsselmeer", "nl")).toBe("Ĳsselmeer");
  });
});
