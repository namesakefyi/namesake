import { describe, expect, it } from "vitest";
import { joinParts } from "../joinParts";

describe("joinParts", () => {
  it("joins all parts with a comma", () => {
    expect(joinParts("Providence", "RI", "02903")).toBe(
      "Providence, RI, 02903",
    );
  });

  it("filters out undefined values", () => {
    expect(joinParts("Providence", undefined, "02903")).toBe(
      "Providence, 02903",
    );
  });

  it("returns undefined when all values are undefined", () => {
    expect(joinParts(undefined, undefined, undefined)).toBeUndefined();
  });

  it("returns undefined when called with no arguments", () => {
    expect(joinParts()).toBeUndefined();
  });

  it("returns a single value without a trailing comma", () => {
    expect(joinParts(undefined, "RI", undefined)).toBe("RI");
  });
});
