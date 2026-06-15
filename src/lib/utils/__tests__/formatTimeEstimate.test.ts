import { describe, expect, it } from "vitest";
import { formatTimeEstimate } from "../formatTimeEstimate";

describe("formatTimeEstimate", () => {
  it("formats time estimate range with default values", () => {
    expect(formatTimeEstimate(5)).toBe("2–4 minutes");
    expect(formatTimeEstimate(3)).toBe("1–3 minutes");
  });

  it("formats time estimate for a single step", () => {
    expect(formatTimeEstimate(1)).toBe("1 minute");
  });

  it("shows single value when min equals max", () => {
    expect(formatTimeEstimate(5, 2, 2)).toBe("10 minutes");
    expect(formatTimeEstimate(1, 1, 1)).toBe("1 minute");
    expect(formatTimeEstimate(3, 1.5, 1.5)).toBe("5 minutes");
  });

  it("uses singular 'minute' for exactly one minute when min equals max", () => {
    expect(formatTimeEstimate(1, 0.5, 0.5)).toBe("1 minute");
    expect(formatTimeEstimate(2, 0.4, 0.4)).toBe("1 minute");
  });

  it("rounds up fractional minutes for both min and max", () => {
    expect(formatTimeEstimate(3, 1.1, 2.1)).toBe("4–7 minutes");
    expect(formatTimeEstimate(5, 0.5, 1.5)).toBe("3–8 minutes");
  });

  it("accepts custom min and max minutes per step", () => {
    expect(formatTimeEstimate(5, 1, 3)).toBe("5–15 minutes");
    expect(formatTimeEstimate(10, 0.5, 1)).toBe("5–10 minutes");
    expect(formatTimeEstimate(4, 2, 4)).toBe("8–16 minutes");
  });

  it("handles zero steps", () => {
    expect(formatTimeEstimate(0)).toBe("0 minutes");
  });

  it("handles cases where rounding makes min equal max", () => {
    // Edge case: if both round to the same value, show single value
    expect(formatTimeEstimate(1, 1.4, 1.5)).toBe("2 minutes");
  });

  it("uses en dash (not hyphen) in range", () => {
    const result = formatTimeEstimate(5, 1, 2);
    expect(result).toContain("–"); // en dash
    expect(result).not.toContain("-"); // hyphen (at least not in the range part)
  });
});
