import { describe, expect, it } from "vitest";
import type { FormCost } from "#constants/forms";
import { formatTotalCosts } from "../formatTotalCosts";

describe("formatTotalCosts", () => {
  it("should return 'Free' when costs array is empty", () => {
    expect(formatTotalCosts([])).toBe("Free");
  });

  it("should return 'Free' when costs array is undefined", () => {
    expect(formatTotalCosts(undefined)).toBe("Free");
  });

  it("should return 'Free' when costs is null", () => {
    expect(formatTotalCosts(null)).toBe("Free");
  });

  it("should return 'Free' when all costs are 0", () => {
    const costs: FormCost[] = [
      { amount: 0, title: "Free item 1", required: "required" },
      { amount: 0, title: "Free item 2", required: "notRequired" },
    ];
    expect(formatTotalCosts(costs)).toBe("Free");
  });

  it("should return formatted currency when all costs are required", () => {
    const costs: FormCost[] = [
      { amount: 1000, title: "Required item 1", required: "required" },
      { amount: 2000, title: "Required item 2", required: "required" },
    ];
    expect(formatTotalCosts(costs)).toBe("$3,000");
  });

  it("should return formatted currency range when there are optional costs", () => {
    const costs: FormCost[] = [
      { amount: 1000, title: "Required item", required: "required" },
      { amount: 2000, title: "Optional item", required: "notRequired" },
    ];
    expect(formatTotalCosts(costs)).toBe("$1,000–$3,000");
  });

  it("should treat omitted required as required for totals", () => {
    const costs: FormCost[] = [
      { amount: 1000, title: "Default required item", required: "required" },
      { amount: 2000, title: "Optional item", required: "notRequired" },
    ];
    expect(formatTotalCosts(costs)).toBe("$1,000–$3,000");
  });
});
