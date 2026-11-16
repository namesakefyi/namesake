import { describe, expect, it } from "vitest";
import { buildDonatePath } from "../buildDonatePath";

describe("buildDonatePath", () => {
  it("should link to the donate page without options", () => {
    expect(buildDonatePath()).toBe("/donate");
  });

  it("should add the amount and frequency to the query string", () => {
    expect(buildDonatePath({ amount: 25 })).toBe("/donate?amount=25");
    expect(buildDonatePath({ amount: 25, frequency: "monthly" })).toBe(
      "/donate?amount=25&frequency=monthly",
    );
  });
});
