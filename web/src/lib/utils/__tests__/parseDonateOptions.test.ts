import { describe, expect, it } from "vitest";
import { parseDonateOptions } from "../parseDonateOptions";

describe("parseDonateOptions", () => {
  it("should read the amount and frequency", () => {
    expect(
      parseDonateOptions(new URLSearchParams("amount=25&frequency=monthly")),
    ).toEqual({ amount: 25, frequency: "monthly" });
  });

  it.each(["", "amount=-5&frequency=weekly", "amount=lots"])(
    "should ignore missing or invalid options in %j",
    (query) => {
      expect(parseDonateOptions(new URLSearchParams(query))).toEqual({
        amount: undefined,
        frequency: undefined,
      });
    },
  );
});
