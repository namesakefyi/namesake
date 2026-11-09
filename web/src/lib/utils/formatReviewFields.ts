import { parseDate } from "@internationalized/date";
import { FIELD_DEFS, type FieldName } from "#constants/fields";
import { getOptionLabel } from "#lib/forms/optionLabels";
import type { OptionLabels } from "#lib/forms/types";
import { formatCurrency } from "./formatCurrency";

/**
 * Given a field name and value, return the formatted value for display in
 * the review table based on its type, or undefined if the field has no
 * response.
 *
 * @example
 * formatFieldValue("dateOfBirth", "1990-06-15")
 * // "June 15, 1990"
 *
 * Pass the step's `options` to label stored values, and `currency` to show
 * amounts as dollars.
 */
export function formatFieldValue(
  fieldName: FieldName,
  value: any,
  { options, currency }: { options?: OptionLabels; currency?: boolean } = {},
): string | undefined {
  // Get the field definition to determine the type
  const fieldDef = FIELD_DEFS.find(
    (definition) => definition.name === fieldName,
  );
  if (!fieldDef) {
    return String(value);
  }

  // Handle empty values - return undefined to trigger warning display
  // Exception: boolean fields treat undefined/null as false (unchecked checkbox)
  if (
    fieldDef.type !== "boolean" &&
    (value === null || value === undefined || value === "")
  ) {
    return undefined;
  }

  // Fields with labeled options show the label of each stored value
  const labelOf = (item: unknown) => {
    const option = options?.[String(item)];
    return option === undefined ? String(item) : getOptionLabel(option);
  };

  // Format based on type
  switch (fieldDef.type) {
    case "boolean":
      // Treat undefined/null as false for boolean fields (single checkboxes default to unchecked)
      return value === true ? "Yes" : "No";

    case "string[]":
      if (Array.isArray(value)) {
        const nonEmpty = value.filter(Boolean).map(labelOf);
        return nonEmpty.length > 0 ? nonEmpty.join(", ") : undefined;
      }
      return undefined;
    default: {
      if (options) return labelOf(value);

      // Currency fields: format as USD
      if (currency) return formatCurrency(value);

      // Phone number formatting
      if (fieldName === "phoneNumber") {
        return formatPhoneNumber(value);
      }

      // Date formatting
      if (fieldName === "dateOfBirth") {
        return formatDate(value);
      }

      return String(value);
    }
  }
}

function formatPhoneNumber(phone: string): string | undefined {
  if (!phone) return undefined;
  // Phone is already formatted by the mask, just return as-is
  return phone;
}

function formatDate(date: string): string | undefined {
  if (!date) return undefined;
  try {
    const calendarDate = parseDate(date);
    return calendarDate.toDate("UTC").toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  } catch {
    return date; // Return as-is if parsing fails
  }
}
