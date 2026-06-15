import { describe, expect, it } from "vitest";
import { formatCleanUrl } from "../formatCleanUrl";

describe("formatCleanUrl", () => {
  it("strips https, www, and trailing slash", () => {
    expect(formatCleanUrl("https://www.masstpc.org/")).toBe("masstpc.org");
  });

  it("strips http and optional www", () => {
    expect(formatCleanUrl("http://www.example.com")).toBe("example.com");
    expect(formatCleanUrl("http://example.com")).toBe("example.com");
  });

  it("strips https when www is absent", () => {
    expect(formatCleanUrl("https://namesake.fyi/")).toBe("namesake.fyi");
  });

  it("removes only a single trailing slash at the end", () => {
    expect(formatCleanUrl("https://example.com/path/")).toBe(
      "example.com/path",
    );
  });

  it("leaves host-only strings unchanged", () => {
    expect(formatCleanUrl("example.com")).toBe("example.com");
  });

  it("returns empty string for empty input", () => {
    expect(formatCleanUrl("")).toBe("");
  });
});
