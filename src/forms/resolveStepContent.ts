import type { FormData } from "@/constants/fields";
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

/**
 * Resolves a step's title to a string, using form data when the title is dynamic.
 */
export function resolveTitle(
  step: Pick<Step, "title">,
  data: Partial<FormData>,
): string {
  return typeof step.title === "function" ? step.title(data) : step.title;
}

/**
 * Resolves a step's description to a string, using form data when the description is dynamic.
 */
export function resolveDescription(
  step: Pick<Step, "description">,
  data: Partial<FormData>,
): string | undefined {
  const desc = step.description;
  return typeof desc === "function" ? desc(data) : desc;
}
