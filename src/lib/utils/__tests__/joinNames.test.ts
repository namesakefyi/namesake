import { describe, expect, it } from "vitest";
import { joinNames } from "../joinNames";

describe("joinNames", () => {
  it("joins all name parts when present", () => {
    expect(joinNames("John", "Robert", "Doe")).toBe("John Robert Doe");
  });

  it("handles missing middle name", () => {
    expect(joinNames("John", undefined, "Doe")).toBe("John Doe");
  });

  it("handles missing first name", () => {
    expect(joinNames(undefined, "Robert", "Doe")).toBe("Robert Doe");
  });

  it("handles missing last name", () => {
    expect(joinNames("John", "Robert", undefined)).toBe("John Robert");
  });

  it("handles only first name", () => {
    expect(joinNames("John", undefined, undefined)).toBe("John");
  });

  it("handles only middle name", () => {
    expect(joinNames(undefined, "Robert", undefined)).toBe("Robert");
  });

  it("handles only last name", () => {
    expect(joinNames(undefined, undefined, "Doe")).toBe("Doe");
  });

  it("handles all undefined values", () => {
    expect(joinNames(undefined, undefined, undefined)).toBe("");
  });
});
