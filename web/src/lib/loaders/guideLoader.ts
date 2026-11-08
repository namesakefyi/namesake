import { relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { AstroError } from "astro/errors";
import { glob, type Loader } from "astro/loaders";
import { JURISDICTIONS } from "#constants/jurisdictions";

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
    throw new AstroError(
      `Guide "${entryPath}" is nested too deeply.`,
      "Move it to the root of the guides folder or one folder deep (`{jurisdiction}/{name}.mdx`).",
    );
  }
  if (!jurisdictions.includes(jurisdiction)) {
    throw new AstroError(
      `Guide "${entryPath}" is in an unknown jurisdiction folder "${jurisdiction}".`,
      `Use one of: ${jurisdictions.join(", ")}.`,
    );
  }
  return jurisdiction;
}

export function guideLoader({
  base,
  pattern,
}: {
  base: string;
  pattern: string;
}): Loader {
  const globLoader = glob({ base, pattern });

  return {
    name: "guide-loader",
    load: async (context) => {
      const baseDir = fileURLToPath(new URL(base, context.config.root));

      await globLoader.load({
        ...context,
        parseData: (props) => {
          const entryPath = relative(baseDir, props.filePath ?? "")
            .split(sep)
            .join("/");

          if ("jurisdiction" in props.data) {
            throw new AstroError(
              `Guide "${entryPath}" sets \`jurisdiction\` in its frontmatter.`,
              "Remove it; the jurisdiction is derived from the guide's folder.",
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
