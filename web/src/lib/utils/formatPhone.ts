/**
 * Given a phone number with an optional extension, return a human readable string.
 *
 * @example
 * formatPhone("555-555-5555")
 * // "555-555-5555"
 *
 * @example
 * formatPhone("555-555-5555;1234")
 * // "555-555-5555 ext. 1234"
 */
export function formatPhone(phone: string): string {
  const [number, extension] = phone.split(";");

  return extension ? `${number} ext. ${extension}` : number;
}
