import { describe, expect, it } from "vitest";
import {
  derivePovertyComparison,
  INCOME_MULTIPLIERS,
} from "./IncomePovertyStep";

describe("INCOME_MULTIPLIERS", () => {
  it("annualizes weekly income by 52", () => {
    expect(1000 * INCOME_MULTIPLIERS.weekly).toBe(52000);
  });

  it("annualizes biweekly income by 26", () => {
    expect(1000 * INCOME_MULTIPLIERS.biweekly).toBe(26000);
  });

  it("annualizes monthly income by 12", () => {
    expect(1000 * INCOME_MULTIPLIERS.monthly).toBe(12000);
  });

  it("leaves yearly income unchanged", () => {
    expect(1000 * INCOME_MULTIPLIERS.yearly).toBe(1000);
  });
});

describe("derivePovertyComparison", () => {
  it("returns 'equal' when income exactly matches the threshold", () => {
    expect(derivePovertyComparison(30000, 30000)).toBe("equal");
  });

  it("returns 'below' when income is less than the threshold", () => {
    expect(derivePovertyComparison(25000, 30000)).toBe("below");
  });

  it("returns 'above' when income exceeds the threshold", () => {
    expect(derivePovertyComparison(35000, 30000)).toBe("above");
  });

  it("returns 'below' for income of 0 against any positive threshold", () => {
    expect(derivePovertyComparison(0, 30000)).toBe("below");
  });
});
