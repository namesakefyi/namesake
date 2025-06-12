import type { Cost } from "@/constants/quests";
import { describe, expect, it } from "vitest";
import { getTotalCosts } from "../getTotalCosts";

describe("getTotalCosts", () => {
  it("should return 'Free' when costs array is empty", () => {
    expect(getTotalCosts([])).toBe("Free");
  });

  it("should return 'Free' when costs array is undefined", () => {
    expect(getTotalCosts(undefined)).toBe("Free");
  });

  it("should return 'Free' when all costs are 0", () => {
    const costs: Cost[] = [
      { cost: 0, description: "Free item 1", isRequired: true },
      { cost: 0, description: "Free item 2", isRequired: false },
    ];
    expect(getTotalCosts(costs)).toBe("Free");
  });

  it("should return formatted currency when all costs are required", () => {
    const costs: Cost[] = [
      { cost: 1000, description: "Required item 1", isRequired: true },
      { cost: 2000, description: "Required item 2", isRequired: true },
    ];
    expect(getTotalCosts(costs)).toBe("$3,000");
  });

  it("should return formatted currency range when there are optional costs", () => {
    const costs: Cost[] = [
      { cost: 1000, description: "Required item", isRequired: true },
      { cost: 2000, description: "Optional item", isRequired: false },
    ];
    expect(getTotalCosts(costs)).toBe("$1,000–$3,000");
  });

  it("should handle costs without isRequired property (defaulting to required)", () => {
    const costs: Cost[] = [
      { cost: 1000, description: "Default required item" },
      { cost: 2000, description: "Optional item", isRequired: false },
    ];
    expect(getTotalCosts(costs)).toBe("$1,000–$3,000");
  });

  it("should format currency without decimal places", () => {
    const costs: Cost[] = [
      {
        cost: 1000.99,
        description: "Required item with decimals",
        isRequired: true,
      },
      {
        cost: 2000.5,
        description: "Optional item with decimals",
        isRequired: false,
      },
    ];
    expect(getTotalCosts(costs)).toBe("$1,001–$3,001");
  });
});
