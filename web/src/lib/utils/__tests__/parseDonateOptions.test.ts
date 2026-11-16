import { describe, expect, it } from "vitest";
import { parseDonateOptions } from "../parseDonateOptions";

describe("parseDonateOptions", () => {
  it("should read the amount and frequency", () => {
    expect(
      parseDonateOptions(new URLSearchParams("amount=25&frequency=monthly")),
    ).toEqual({ amount: 25, frequency: "monthly" });
  });

  it("should leave out missing options", () => {
    expect(parseDonateOptions(new URLSearchParams())).toEqual({
      amount: undefined,
      frequency: undefined,
    });
  });

  it("should ignore invalid amounts and frequencies", () => {
    expect(
      parseDonateOptions(new URLSearchParams("amount=-5&frequency=weekly")),
    ).toEqual({ amount: undefined, frequency: undefined });
    expect(
      parseDonateOptions(new URLSearchParams("amount=lots")).amount,
    ).toBeUndefined();
  });
});
