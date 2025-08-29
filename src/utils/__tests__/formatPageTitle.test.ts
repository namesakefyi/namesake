import { describe, expect, it } from "vitest";
import { formatPageTitle } from "../formatPageTitle";

describe("formatPageTitle", () => {
  it("renders the title correctly with default values", () => {
    expect(formatPageTitle("Court Order")).toEqual("Court Order · Namesake");
  });

  it("renders the title with custom divider", () => {
    expect(formatPageTitle("Court Order", " - ")).toEqual(
      "Court Order - Namesake",
    );
  });

  it("renders the title with custom site title", () => {
    expect(formatPageTitle("Test Page", " · ", "Namesake Beta")).toEqual(
      "Test Page · Namesake Beta",
    );
  });

  it("hides the divider when site title is not provided", () => {
    expect(formatPageTitle("Test Page", " · ", null)).toEqual("Test Page");
  });

  it("trims whitespace from title and site title", () => {
    expect(formatPageTitle("  Whitespace  ", " · ", "  Namesake  ")).toEqual(
      "Whitespace · Namesake",
    );
  });
});
