import { describe, expect, it } from "vitest";
import { parseContentPath, rejectJurisdictionKey } from "../parseContentPath";

describe("parseContentPath", () => {
  const jurisdictions = ["ma", "ri"];

  it("returns undefined for root-level entries", () => {
    expect(parseContentPath("passport", "guides", jurisdictions)).toBe(
      undefined,
    );
  });

  it("returns the folder name for entries in a jurisdiction folder", () => {
    expect(parseContentPath("ma/court-order", "forms", jurisdictions)).toBe(
      "ma",
    );
  });

  it("throws for unknown jurisdiction folders", () => {
    expect(() =>
      parseContentPath("zz/court-order", "forms", jurisdictions),
    ).toThrow(/unknown jurisdiction folder "zz"/);
  });

  it("throws for entries nested more than one folder deep", () => {
    expect(() =>
      parseContentPath("ma/extra/court-order", "guides", jurisdictions),
    ).toThrow(/nested too deeply/);
  });
});

describe("rejectJurisdictionKey", () => {
  it("throws when the data sets jurisdiction", () => {
    expect(() =>
      rejectJurisdictionKey({ jurisdiction: "ri" }, "ma/cjp25", "pdfs"),
    ).toThrow("sets `jurisdiction`");
  });

  it("allows data without jurisdiction", () => {
    expect(() =>
      rejectJurisdictionKey({ title: "Test" }, "ma/cjp25", "pdfs"),
    ).not.toThrow();
  });
});
