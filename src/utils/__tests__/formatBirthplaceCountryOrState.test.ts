import { describe, expect, it } from "vitest";
import { COUNTRIES } from "../../constants/countries";
import { JURISDICTIONS } from "../../constants/jurisdictions";
import { formatBirthplaceCountryOrState } from "../formatBirthplaceCountryOrState";

describe("formatBirthplaceCountryOrState", () => {
  it("returns state name when valid state is provided", () => {
    expect(formatBirthplaceCountryOrState(undefined, "CA")).toBe(
      JURISDICTIONS.CA,
    );
  });

  it("returns country name when country is provided and state is not", () => {
    expect(formatBirthplaceCountryOrState("FR", undefined)).toBe(COUNTRIES.FR);
  });

  it("returns empty string when no state or country is provided", () => {
    expect(formatBirthplaceCountryOrState(undefined, undefined)).toBe("");
  });

  it("returns state name when both country and state are provided and country is the US", () => {
    expect(formatBirthplaceCountryOrState("US", "NY")).toBe(JURISDICTIONS.NY);
  });
});
