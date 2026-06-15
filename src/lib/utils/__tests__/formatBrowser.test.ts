import { describe, expect, it } from "vitest";
import { formatBrowser } from "../formatBrowser";

describe("formatBrowser", () => {
  it("should return the browser name when available", () => {
    expect(formatBrowser({ name: "Chrome" })).toBe("Chrome");
    expect(formatBrowser({ name: "Firefox" })).toBe("Firefox");
    expect(formatBrowser({ name: "Safari" })).toBe("Safari");
  });

  it("should return 'this browser' when null is provided", () => {
    expect(formatBrowser(null)).toBe("this browser");
  });

  it("should return 'this browser' when name is undefined", () => {
    expect(formatBrowser({})).toBe("this browser");
    expect(formatBrowser({ name: undefined })).toBe("this browser");
  });

  it("should return 'this browser' when name is empty string", () => {
    expect(formatBrowser({ name: "" })).toBe("this browser");
  });
});
