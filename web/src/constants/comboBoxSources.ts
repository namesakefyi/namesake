import { COUNTRY_OPTIONS } from "#constants/countries";
import { JURISDICTION_OPTIONS } from "#constants/jurisdictions";

interface ComboBoxOption {
  label: string;
  value: string;
}

export const COMBO_BOX_SOURCES = {
  countries: COUNTRY_OPTIONS,
  jurisdictions: JURISDICTION_OPTIONS,
  maritalStatus: [
    { label: "Single", value: "Single" },
    { label: "Married", value: "Married" },
    { label: "Divorced", value: "Divorced" },
    { label: "Widowed", value: "Widowed" },
  ],
} as const satisfies Record<string, readonly ComboBoxOption[]>;

export type ComboBoxSource = keyof typeof COMBO_BOX_SOURCES;
