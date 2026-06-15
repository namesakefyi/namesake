import { describe, expect, it } from "vitest";
import { smartquotes } from "../smartquotes";

describe("smartquotes", () => {
  it("should convert straight single quotes to smart quotes", () => {
    expect(smartquotes("It's a test")).toBe("It\u2019s a test");
    expect(smartquotes("'Hello'")).toBe("\u2018Hello\u2019");
  });

  it("should convert straight double quotes to smart quotes", () => {
    expect(smartquotes('"Hello World"')).toBe("\u201cHello World\u201d");
    expect(smartquotes('He said, "Good morning!"')).toBe(
      "He said, \u201cGood morning!\u201d",
    );
  });

  it("should handle opening quotes at the start of a string", () => {
    expect(smartquotes('"Start of string')).toBe("\u201cStart of string");
    expect(smartquotes("'Start of string")).toBe("\u2018Start of string");
  });

  it("should convert double hyphens to em-dashes", () => {
    expect(smartquotes("Hello -- World")).toBe("Hello \u2014 World");
  });

  it("should convert three dots to ellipsis", () => {
    expect(smartquotes("Wait...")).toBe("Wait\u2026");
  });

  it("should handle multiple transformations in a single string", () => {
    expect(smartquotes("It's a 'great' day -- isn't it...")).toBe(
      "It\u2019s a \u2018great\u2019 day \u2014 isn\u2019t it\u2026",
    );
  });

  it("should not modify strings without quotes or special characters", () => {
    const plainText = "Hello World";
    expect(smartquotes(plainText)).toBe(plainText);
  });
});
