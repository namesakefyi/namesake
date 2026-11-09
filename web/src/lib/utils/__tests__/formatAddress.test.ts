import { describe, expect, it } from "vitest";
import { formatAddress } from "../formatAddress";

describe("formatAddress", () => {
  it("joins all parts when present", () => {
    expect(
      formatAddress({
        street: "100 Main St",
        city: "Providence",
        state: "RI",
        zip: "02903",
      }),
    ).toBe("100 Main St, Providence, RI, 02903");
  });

  it("omits missing city", () => {
    expect(
      formatAddress({ street: "100 Main St", state: "RI", zip: "02903" }),
    ).toBe("100 Main St, RI, 02903");
  });

  it("omits missing state", () => {
    expect(
      formatAddress({
        street: "100 Main St",
        city: "Providence",
        zip: "02903",
      }),
    ).toBe("100 Main St, Providence, 02903");
  });

  it("omits missing zip", () => {
    expect(
      formatAddress({ street: "100 Main St", city: "Providence", state: "RI" }),
    ).toBe("100 Main St, Providence, RI");
  });

  it("includes the second street line after the first", () => {
    expect(
      formatAddress({
        street: "100 Main St",
        street2: "Apt 2",
        city: "Providence",
        state: "RI",
      }),
    ).toBe("100 Main St, Apt 2, Providence, RI");
  });

  it("uppercases the state code", () => {
    expect(formatAddress({ city: "Albany", state: "ny" })).toBe("Albany, NY");
  });

  it("keeps a region as written and appends the country", () => {
    expect(
      formatAddress({ city: "Toronto", region: "Ontario", country: "Canada" }),
    ).toBe("Toronto, Ontario, Canada");
  });
});
