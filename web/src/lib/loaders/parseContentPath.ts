import { AstroError } from "astro/errors";
import { JURISDICTIONS } from "#constants/jurisdictions";

/**
 * Derives a content entry's jurisdiction from its id, which is its path
 * relative to the collection folder without the file name.
 *
 * - `passport` → `undefined` (applies to all jurisdictions)
 * - `ma/court-order` → `"ma"`
 *
 * Throws if the entry is nested more than one folder deep or the folder is
 * not a known jurisdiction.
 */
export function parseContentPath(
  id: string,
  collection: string,
  jurisdictions: readonly string[] = Object.keys(JURISDICTIONS),
): string | undefined {
  const segments = id.split("/");
  if (segments.length === 1) return undefined;

  const [jurisdiction] = segments;
  if (segments.length > 2) {
    throw new AstroError(
      `Entry "${id}" in ${collection} is nested too deeply.`,
      "Move it to the root of the collection folder or one jurisdiction folder deep.",
    );
  }
  if (!jurisdictions.includes(jurisdiction)) {
    throw new AstroError(
      `Entry "${id}" in ${collection} is in an unknown jurisdiction folder "${jurisdiction}".`,
      `Use one of: ${jurisdictions.join(", ")}.`,
    );
  }
  return jurisdiction;
}

export function rejectJurisdictionKey(
  data: object,
  id: string,
  collection: string,
): void {
  if ("jurisdiction" in data) {
    throw new AstroError(
      `Entry "${id}" in ${collection} sets \`jurisdiction\`.`,
      "Remove it; the jurisdiction is derived from the entry's folder.",
    );
  }
}
