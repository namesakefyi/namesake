import { parsePhoneNumberWithError } from "libphonenumber-js";

export function splitPhoneNumber(phoneNumber?: string): {
  countryCode?: string;
  areaCode?: string;
  localNumber?: string;
} {
  if (!phoneNumber) return {};

  try {
    const parsed = parsePhoneNumberWithError(phoneNumber, "US");
    if (!parsed?.isValid()) return {};

    const nationalNumber = parsed.nationalNumber;
    const areaCode = nationalNumber.slice(0, 3);
    const local = nationalNumber.slice(3);
    const localFormatted = `${local.slice(0, 3)}-${local.slice(3)}`;

    return {
      countryCode: parsed.countryCallingCode,
      areaCode,
      localNumber: localFormatted,
    };
  } catch {
    return {};
  }
}
