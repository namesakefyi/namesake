import { parseDate } from "@internationalized/date";
import { FIELD_DEFS, type FieldName } from "../constants/fields";

/**
 * Formats a field value for display in the review table based on its type
 * from FIELD_DEFS.
 * @returns The formatted value, or undefined if the field has no response
 */
export function formatFieldValue(
  fieldName: FieldName,
  value: any,
): string | undefined {
  // Get the field definition to determine the type
  const fieldDef = FIELD_DEFS.find((def) => def.name === fieldName);
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

  // Format based on type
  switch (fieldDef.type) {
    case "boolean":
      // Treat undefined/null as false for boolean fields (single checkboxes default to unchecked)
      return value === true ? "Yes" : "No";

    case "string[]":
      if (Array.isArray(value)) {
        return value.length > 0 ? value.join(", ") : undefined;
      }
      return undefined;
    default:
      // Handle special formatting for certain field name patterns

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

/**
 * Gets the label for a field from FIELD_DEFS
 */
export function getFieldLabel(fieldName: FieldName): string {
  const fieldDef = FIELD_DEFS.find((def) => def.name === fieldName);
  return fieldDef?.label || fieldName;
}
