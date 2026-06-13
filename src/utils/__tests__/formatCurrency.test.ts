import { describe, expect, it } from "vitest";
import { formatCurrency } from "../formatCurrency";

describe("formatCurrency", () => {
  it("should format basic numbers as USD currency", () => {
    expect(formatCurrency(100)).toBe("$100");
    expect(formatCurrency(50)).toBe("$50");
    expect(formatCurrency(1)).toBe("$1");
  });

  it("should format large numbers with commas", () => {
    expect(formatCurrency(1000)).toBe("$1,000");
    expect(formatCurrency(10000)).toBe("$10,000");
    expect(formatCurrency(1000000)).toBe("$1,000,000");
  });

  it("should handle zero", () => {
    expect(formatCurrency(0)).toBe("$0");
  });

  it("should handle cents", () => {
    expect(formatCurrency(1.25)).toBe("$1.25");
    expect(formatCurrency(9.99)).toBe("$9.99");

    // always include two digits when cents are present
    expect(formatCurrency(1.5)).toBe("$1.50");
    expect(formatCurrency(1.5)).not.toBe("$1.5");

    // exclude cents when zero
    expect(formatCurrency(1.0)).toBe("$1");
    expect(formatCurrency(1.0)).not.toBe("$1.00");
  });
});
