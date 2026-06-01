import { describe, expect, it } from "vitest";
import { formatAddress } from "../formatAddress";

describe("formatAddress", () => {
  it("joins all parts when present", () => {
    expect(
      formatAddress({ street: "100 Main St", city: "Providence", state: "RI", zip: "02903" }),
    ).toBe("100 Main St, Providence, RI, 02903");
  });

  it("omits missing city", () => {
    expect(formatAddress({ street: "100 Main St", state: "RI", zip: "02903" })).toBe(
      "100 Main St, RI, 02903",
    );
  });

  it("omits missing state", () => {
    expect(
      formatAddress({ street: "100 Main St", city: "Providence", zip: "02903" }),
    ).toBe("100 Main St, Providence, 02903");
  });

  it("omits missing zip", () => {
    expect(
      formatAddress({ street: "100 Main St", city: "Providence", state: "RI" }),
    ).toBe("100 Main St, Providence, RI");
  });

  it("returns empty string when all parts are undefined", () => {
    expect(formatAddress()).toBe("");
  });
});
