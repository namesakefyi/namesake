import { afterEach, describe, expect, it, vi } from "vitest";
import { formatDateMMDDYYYY } from "../formatDateMMDDYYYY";

describe("formatDateMMDDYYYY", () => {
  it("formats date correctly", () => {
    expect(formatDateMMDDYYYY("2021-01-01")).toBe("01/01/2021");
  });

  it("returns empty string when date is undefined", () => {
    expect(formatDateMMDDYYYY(undefined)).toBe("");
  });

  it("handles malformed dates", () => {
    expect(formatDateMMDDYYYY("invalid-date")).toBe("");
    expect(formatDateMMDDYYYY("2021-1-1-1")).toBe("");
    expect(formatDateMMDDYYYY("2021-13-40")).toBe("");
  });

  it("returns empty string and logs when toLocaleDateString throws", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(Date.prototype, "toLocaleDateString").mockImplementationOnce(
      () => {
        throw new Error("locale error");
      },
    );

    expect(formatDateMMDDYYYY("2021-01-01")).toBe("");
    expect(console.error).toHaveBeenCalledWith(
      "Error formatting date",
      expect.any(Error),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
});
