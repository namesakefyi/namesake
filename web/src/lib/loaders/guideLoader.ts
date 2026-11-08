import { relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { glob, type Loader } from "astro/loaders";
import { JURISDICTIONS } from "#constants/jurisdictions";

const BASE = "./src/content/guides";

/**
 * Derives a guide's jurisdiction from its path relative to the guides folder.
 *
 * - `passport.mdx` → `undefined` (applies to all jurisdictions)
 * - `ma/court-order.mdx` → `"ma"`
 *
 * Throws if the guide is nested more than one folder deep or the folder is
 * not a known jurisdiction.
 */
export function parseJurisdictionFromPath(
  entryPath: string,
  jurisdictions: readonly string[] = Object.keys(JURISDICTIONS),
): string | undefined {
  const segments = entryPath.split("/");
  if (segments.length === 1) return undefined;

  const [jurisdiction] = segments;
  if (segments.length > 2) {
    throw invalidEntry(
      entryPath,
      "guides must be at the root or one folder deep (`{jurisdiction}/{name}`).",
    );
  }
  if (!jurisdictions.includes(jurisdiction)) {
    throw invalidEntry(
      entryPath,
      `"${jurisdiction}" is not a known jurisdiction. Expected one of: ${jurisdictions.join(", ")}.`,
    );
  }
  return jurisdiction;
}

function invalidEntry(entryPath: string, reason: string) {
  return new Error(`Invalid content entry "${entryPath}": ${reason}`);
}

/**
 * Content loader for guides. Guides live at the root of the collection
 * (applying to all jurisdictions) or in a jurisdiction folder, e.g.
 * `ma/court-order.mdx`. The folder is the single source of truth for each
 * guide's `jurisdiction`, which is injected into the entry data before schema
 * validation. Malformed structure fails the build.
 */
export function guideLoader(): Loader {
  const globLoader = glob({ base: BASE, pattern: "**/*.mdx" });

  return {
    name: "guide-loader",
    load: async (context) => {
      const baseDir = fileURLToPath(new URL(BASE, context.config.root));

      await globLoader.load({
        ...context,
        parseData: (props) => {
          const entryPath = relative(baseDir, props.filePath ?? "")
            .split(sep)
            .join("/");

          if ("jurisdiction" in props.data) {
            throw invalidEntry(
              entryPath,
              "remove `jurisdiction` from frontmatter; it is derived from the file path.",
            );
          }

          return context.parseData({
            ...props,
            data: {
              ...props.data,
              jurisdiction: parseJurisdictionFromPath(entryPath),
            },
          });
        },
      });
    },
  };
}
