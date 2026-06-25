import { COUNTRIES } from "#constants/countries";
import { JURISDICTIONS, type JurisdictionId } from "#constants/jurisdictions";

/**
 * Given a birthplace country and/or state, return the country name
 * if born outside the US, or the state name otherwise.
 *
 * @example
 * formatBirthplaceCountryOrState("MX")
 * // "Mexico"
 * formatBirthplaceCountryOrState("US", "MA")
 * // "Massachusetts"
 */
export const formatBirthplaceCountryOrState = (
  birthplaceCountry?: string,
  birthplaceState?: string,
) => {
  if (birthplaceCountry && birthplaceCountry !== "US") {
    return COUNTRIES[birthplaceCountry];
  }
  if (birthplaceState) {
    return JURISDICTIONS[birthplaceState.toLowerCase() as JurisdictionId]?.name;
  }
  return "";
};
