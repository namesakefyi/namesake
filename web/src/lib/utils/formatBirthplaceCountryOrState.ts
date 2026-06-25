import { COUNTRIES } from "#constants/countries";
import { isJurisdictionId, JURISDICTIONS } from "#constants/jurisdictions";

/**
 * Given a birthplace country and/or state, return the country name
 * if born outside the US, or the state name otherwise.
 *
 * @example
 * formatBirthplaceCountryOrState("MX")
 * // "Mexico"
 * formatBirthplaceCountryOrState("US", "ma")
 * // "Massachusetts"
 */
export const formatBirthplaceCountryOrState = (
  birthplaceCountry?: string,
  birthplaceState?: string,
) => {
  if (birthplaceCountry && birthplaceCountry !== "US") {
    return COUNTRIES[birthplaceCountry];
  }
  if (birthplaceState && isJurisdictionId(birthplaceState)) {
    return JURISDICTIONS[birthplaceState].name;
  }
  return "";
};
