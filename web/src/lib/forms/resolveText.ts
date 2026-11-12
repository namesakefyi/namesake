import type { FormData } from "#lib/forms/questions";

export function resolveText<T extends string | undefined>(
  text: T | ((data: FormData) => T),
  data: FormData,
): T {
  return typeof text === "function" ? text(data) : text;
}
