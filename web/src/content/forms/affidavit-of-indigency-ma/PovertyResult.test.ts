import { describe, expect, it } from "vitest";
import { derivePovertyComparison } from "./PovertyResult";

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
