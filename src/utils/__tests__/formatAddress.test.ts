import { describe, expect, it } from "vitest";
import { formatAddress } from "../formatAddress";

describe("formatAddress", () => {
  it("joins all parts when present", () => {
    expect(formatAddress("100 Main St", "Providence", "RI", "02903")).toBe(
      "100 Main St, Providence, RI, 02903",
    );
  });

  it("omits missing city", () => {
    expect(formatAddress("100 Main St", undefined, "RI", "02903")).toBe(
      "100 Main St, RI, 02903",
    );
  });

  it("omits missing state", () => {
    expect(formatAddress("100 Main St", "Providence", undefined, "02903")).toBe(
      "100 Main St, Providence, 02903",
    );
  });

  it("omits missing zip", () => {
    expect(formatAddress("100 Main St", "Providence", "RI", undefined)).toBe(
      "100 Main St, Providence, RI",
    );
  });

  it("returns empty string when all parts are undefined", () => {
    expect(formatAddress()).toBe("");
  });
});
