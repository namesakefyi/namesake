import type { FormData } from "#constants/fields";
import type { Step } from "./types";

/**
 * Returns the subject's first name from form data, or the fallback when empty.
 * Useful for dynamic step titles and descriptions (e.g., "Where do Erika's parents live?").
 */
export function nameOrFallback(
  data: Partial<FormData>,
  fallback: string,
): string {
  const name = data.newFirstName;
  return (typeof name === "string" && name.trim()) || fallback;
}

export function resolveText(
  text: string | ((data: Partial<FormData>) => string),
  data: Partial<FormData>,
): string {
  return typeof text === "function" ? text(data) : text;
}

/**
 * Resolves a step's title to a string, using form data when the title is dynamic.
 */
export function resolveTitle(
  step: Pick<Step, "title">,
  data: Partial<FormData>,
): string {
  return resolveText(step.title, data);
}

/**
 * Resolves a step's description to a string, using form data when the description is dynamic.
 */
export function resolveDescription(
  step: Pick<Step, "description">,
  data: Partial<FormData>,
): string | undefined {
  return step.description && resolveText(step.description, data);
}
