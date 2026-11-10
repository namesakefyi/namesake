import { AstroError } from "astro/errors";
import { JURISDICTIONS } from "#constants/jurisdictions";

/**
 * Derives a content entry's jurisdiction from its id, which is its path
 * relative to the collection folder without the file name.
 *
 * - `passport` → `undefined` (applies to all jurisdictions)
 * - `ma/court-order` → `"ma"`
 *
 * Throws if the entry sets `jurisdiction` itself, is nested more than one
 * folder deep, or is in a folder that isn't a known jurisdiction.
 */
export function parseContentPath(
  id: string,
  collection: string,
  data: object,
): string | undefined {
  if ("jurisdiction" in data) {
    throw new AstroError(
      `Entry "${id}" in ${collection} sets \`jurisdiction\`.`,
      "Remove it; the jurisdiction is derived from the entry's folder.",
    );
  }

  const segments = id.split("/");
  if (segments.length === 1) return undefined;

  const [jurisdiction] = segments;
  if (segments.length > 2) {
    throw new AstroError(
      `Entry "${id}" in ${collection} is nested too deeply.`,
      "Move it to the root of the collection folder or one jurisdiction folder deep.",
    );
  }
  if (!Object.hasOwn(JURISDICTIONS, jurisdiction)) {
    throw new AstroError(
      `Entry "${id}" in ${collection} is in an unknown jurisdiction folder "${jurisdiction}".`,
      `Use one of: ${Object.keys(JURISDICTIONS).join(", ")}.`,
    );
  }
  return jurisdiction;
}
