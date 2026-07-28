import { describe, expect, it } from "vitest";
import { formatPhone } from "../formatPhone";

describe("formatPhone", () => {
  it("returns the number unchanged when there is no extension", () => {
    expect(formatPhone("555-555-5555")).toBe("555-555-5555");
  });

  it("appends the extension when present", () => {
    expect(formatPhone("555-555-5555;1234")).toBe("555-555-5555 ext. 1234");
  });

  it("handles extensions shorter than 4 digits", () => {
    expect(formatPhone("555-555-5555;1")).toBe("555-555-5555 ext. 1");
  });
});
