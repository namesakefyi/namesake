import { afterEach, describe, expect, it, vi } from "vitest";
import { deriveCurrentAge } from "../deriveCurrentAge";

describe("deriveCurrentAge", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns -1 for undefined or empty string", () => {
    expect(deriveCurrentAge(undefined)).toBe(-1);
    expect(deriveCurrentAge("")).toBe(-1);
  });

  it("returns -1 for non-string input", () => {
    expect(deriveCurrentAge(null as unknown as string)).toBe(-1);
    expect(deriveCurrentAge(123 as unknown as string)).toBe(-1);
  });

  it("returns 0 for invalid date string", () => {
    expect(deriveCurrentAge("not-a-date")).toBe(-1);
  });

  it("returns 0 until birthday has occurred", () => {
    vi.setSystemTime(new Date(2025, 0, 1)); // Jan 1, 2025
    // Born Dec 31, 2024 — not yet 1 year old until 2025-12-31
    expect(deriveCurrentAge("2024-12-31")).toBe(0);
  });

  it("returns the correct age after birthday", () => {
    vi.setSystemTime(new Date(2025, 0, 1)); // Jan 1, 2025
    // Born Jan 1, 2024 — 1 year old as of 2025-01-01
    expect(deriveCurrentAge("2024-01-01")).toBe(1);
  });
});
