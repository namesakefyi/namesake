import { describe, expect, it } from "vitest";
import { allOf, anyOf, is, isFalse, isTrue, not } from "../conditions";

describe("conditions", () => {
  it("combines conditions with allOf, anyOf and not", () => {
    const married = isTrue("isCurrentlyMarried");
    const divorced = isTrue("wasPreviouslyMarried");
    expect(allOf(married, divorced)({ isCurrentlyMarried: true })).toBe(false);
    expect(anyOf(married, divorced)({ wasPreviouslyMarried: true })).toBe(true);
    expect(not(married)({})).toBe(true);
    expect(not(married)({ isCurrentlyMarried: true })).toBe(false);
    expect(not(anyOf(married, divorced)).deps).toEqual([
      "isCurrentlyMarried",
      "wasPreviouslyMarried",
    ]);
  });

  it("compares fields exactly", () => {
    expect(
      isTrue("hasPreviousNameChange")({ hasPreviousNameChange: true }),
    ).toBe(true);
    expect(isFalse("hasPreviousNameChange")({})).toBe(false);
    expect(
      isFalse("hasPreviousNameChange")({ hasPreviousNameChange: false }),
    ).toBe(true);
    expect(
      is("incomePeriod", "weekly", "monthly")({ incomePeriod: "monthly" }),
    ).toBe(true);
    expect(is("incomePeriod", "weekly")({ incomePeriod: "yearly" })).toBe(
      false,
    );
  });
});
