import type { FieldValue } from "#lib/forms/questions";

/** A text answer, or undefined when the answer isn't text. */
export const asText = (value: FieldValue | undefined) =>
  typeof value === "string" ? value : undefined;

/** A list answer, or undefined when the answer isn't a list. */
export const asList = (value: FieldValue | undefined) =>
  Array.isArray(value) ? value : undefined;
