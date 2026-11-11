import { parseDate } from "@internationalized/date";
import { EXTRA_CHOICE_LABELS, type FieldTypeName } from "#constants/fields";
import type { OptionLabels } from "#lib/forms/questions";
import { formatCurrency } from "./formatCurrency";

/**
 * Given a field's type and value, return the formatted value for display in
 * the review table, or undefined if the field has no response.
 *
 * @example
 * formatFieldValue("date", "1990-06-15")
 * // "June 15, 1990"
 *
 * Pass the step's `options` to label stored values, and `currency` to show
 * amounts as dollars.
 */
export function formatFieldValue(
  type: FieldTypeName,
  value: any,
  { options, currency }: { options?: OptionLabels; currency?: boolean } = {},
): string | undefined {
  // Handle empty values - return undefined to trigger warning display
  // Exception: boolean fields treat undefined/null as false (unchecked checkbox)
  if (
    type !== "bool" &&
    (value === null || value === undefined || value === "")
  ) {
    return undefined;
  }

  const labelOf = (item: unknown) => {
    const option = options?.[String(item)] ?? EXTRA_CHOICE_LABELS[String(item)];
    if (option === undefined) return String(item);
    return typeof option === "string" ? option : option.label;
  };

  // Format based on type
  switch (type) {
    case "bool":
      // Treat undefined/null as false for boolean fields (single checkboxes default to unchecked)
      if (typeof value === "string") return labelOf(value); // An extra choice
      return value === true ? "Yes" : "No";

    case "list":
      if (Array.isArray(value)) {
        const nonEmpty = value.filter(Boolean).map(labelOf);
        return nonEmpty.length > 0 ? nonEmpty.join(", ") : undefined;
      }
      return undefined;
    default: {
      if (options) return labelOf(value);

      // Number questions store their answer as a string.
      if (currency) return formatCurrency(Number(value));

      if (type === "date") return formatDate(value);

      return String(value);
    }
  }
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
