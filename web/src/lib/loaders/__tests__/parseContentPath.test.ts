import { describe, expect, it } from "vitest";
import { parseContentPath } from "../parseContentPath";

describe("parseContentPath", () => {
  it("returns undefined for root-level entries", () => {
    expect(parseContentPath("passport", "guides", {})).toBe(undefined);
  });

  it("returns the folder name for entries in a jurisdiction folder", () => {
    expect(parseContentPath("ma/court-order", "forms", {})).toBe("ma");
  });

  it("throws for unknown jurisdiction folders", () => {
    expect(() => parseContentPath("zz/court-order", "forms", {})).toThrow(
      /unknown jurisdiction folder "zz"/,
    );
  });

  it("throws for entries nested more than one folder deep", () => {
    expect(() =>
      parseContentPath("ma/extra/court-order", "guides", {}),
    ).toThrow(/nested too deeply/);
  });

  it("throws when the entry sets jurisdiction", () => {
    expect(() =>
      parseContentPath("ma/cjp25", "pdfs", { jurisdiction: "ri" }),
    ).toThrow("sets `jurisdiction`");
  });
});
