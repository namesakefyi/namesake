import { describe, expect, it } from "vitest";
import { formatStateList } from "../formatStateList";

describe("formatStateList", () => {
  it("returns an empty string for an empty array", () => {
    expect(formatStateList([])).toBe("");
  });

  it("returns a single state name unchanged", () => {
    expect(formatStateList(["California"])).toBe("California");
  });

  it("joins two states with 'and'", () => {
    expect(formatStateList(["California", "Texas"])).toBe(
      "California and Texas",
    );
  });

  it("joins three or more states with commas and 'and'", () => {
    expect(formatStateList(["California", "Texas", "Florida"])).toBe(
      "California, Texas, and Florida",
    );
    expect(
      formatStateList(["California", "Texas", "Florida", "New York"]),
    ).toBe("California, Texas, Florida, and New York");
  });

  it("handles multi-word state names", () => {
    expect(formatStateList(["New York", "New Jersey"])).toBe(
      "New York and New Jersey",
    );
    expect(formatStateList(["New York", "New Jersey", "New Mexico"])).toBe(
      "New York, New Jersey, and New Mexico",
    );
  });
});
