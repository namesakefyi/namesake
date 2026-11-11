import { NAME_FIELDS, type NameType } from "#constants/fieldGroups";
import type { FormData } from "#lib/forms/questions";
import { joinNames } from "./joinNames";

/**
 * Joins a name group's first, middle and last names.
 *
 * @example
 * fullName({ oldFirstName: "Marsha", oldLastName: "Johnson" }, "oldName")
 * // "Marsha Johnson"
 */
export function fullName(data: FormData, type: NameType): string {
  const { first, middle, last } = NAME_FIELDS[type];
  return joinNames(data[first], data[middle], data[last]);
}
