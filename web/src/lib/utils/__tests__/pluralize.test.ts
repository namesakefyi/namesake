import { describe, expect, it } from "vitest";
import { pluralize } from "../pluralize";

describe("pluralize", () => {
  it("should return the singular form when count is 1", () => {
    expect(pluralize(1, "document")).toBe("document");
  });

  it("should return the plural form when count is not 1", () => {
    expect(pluralize(0, "document")).toBe("documents");
    expect(pluralize(2, "document")).toBe("documents");
    expect(pluralize(100, "document")).toBe("documents");
  });

  it("should default to adding an 's' for the plural form", () => {
    expect(pluralize(2, "response")).toBe("responses");
  });

  it("should use an explicit irregular plural form when provided", () => {
    expect(pluralize(1, "person", "people")).toBe("person");
    expect(pluralize(3, "person", "people")).toBe("people");
  });

  it("should handle fractional counts", () => {
    expect(pluralize(1.5, "document")).toBe("documents");
  });

  it("should handle negative counts", () => {
    expect(pluralize(-1, "document")).toBe("document");
    expect(pluralize(-2, "document")).toBe("documents");
  });
});
