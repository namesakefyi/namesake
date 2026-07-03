import { describe, expect, it } from "vitest";
import { splitPhoneNumber } from "../splitPhoneNumber";

describe("splitPhoneNumber", () => {
  it("splits a 10-digit hyphenated US number", () => {
    expect(splitPhoneNumber("212-867-5309")).toEqual({
      countryCode: "1",
      areaCode: "212",
      localNumber: "867-5309",
    });
  });

  it("splits a 10-digit unformatted US number", () => {
    expect(splitPhoneNumber("2128675309")).toEqual({
      countryCode: "1",
      areaCode: "212",
      localNumber: "867-5309",
    });
  });

  it("splits a number with explicit +1 country code", () => {
    expect(splitPhoneNumber("+1 (617) 267-9300")).toEqual({
      countryCode: "1",
      areaCode: "617",
      localNumber: "267-9300",
    });
  });

  it("returns empty object for a number that fails validation", () => {
    expect(splitPhoneNumber("867-5309")).toEqual({});
  });

  it("returns empty object for input that throws during parsing", () => {
    expect(splitPhoneNumber("not-a-phone-number")).toEqual({});
  });

  it("returns empty object for undefined input", () => {
    expect(splitPhoneNumber(undefined)).toEqual({});
  });
});
