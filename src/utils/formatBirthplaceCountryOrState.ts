import { COUNTRIES } from "../constants/countries";
import { JURISDICTIONS } from "../constants/jurisdictions";

export const formatBirthplaceCountryOrState = (
  birthplaceCountry?: string,
  birthplaceState?: string,
) => {
  if (birthplaceCountry && birthplaceCountry !== "US") {
    return COUNTRIES[birthplaceCountry];
  }
  if (birthplaceState) {
    return JURISDICTIONS[birthplaceState];
  }
  return "";
};
