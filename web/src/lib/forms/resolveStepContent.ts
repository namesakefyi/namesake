import type { FormData } from "#lib/forms/questions";

/**
 * Returns the subject's first name from form data, or the fallback when empty.
 * Useful for dynamic step titles and descriptions (e.g., "Where do Erika's parents live?").
 */
export function nameOrFallback(data: FormData, fallback: string): string {
  const name = data.newFirstName;
  return (typeof name === "string" && name.trim()) || fallback;
}

export function resolveText<T extends string | undefined>(
  text: T | ((data: FormData) => T),
  data: FormData,
): T {
  return typeof text === "function" ? text(data) : text;
}
