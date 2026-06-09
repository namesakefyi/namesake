/// <reference path="./worker-configuration.d.ts" />

/**
 * Virtual modules for Astro/Workers import specifiers that Vite cannot resolve during Vitest.
 *
 * @see https://vitest.dev/config/#plugins — Vitest uses Vite's plugin pipeline (`resolveId` / `load`).
 * @see https://vite.dev/guide/api-plugin.html — virtual module ids conventionally use a `\0` prefix.
 */

import type { Plugin } from "vitest/config";

type Shim<Spec extends string = string> = Readonly<{
  specifier: Spec;
  /** Stable internal module id; must be unique across shims. */
  virtualModuleId: `\0${string}`;
  /** Emitted as ESM — keep in sync with `typeAlignment`. */
  source: string;
}>;

function virtualId(slug: string): `\0${string}` {
  return `\0vitest:${slug}` as `\0${string}`;
}

/** Drops compile-only `typeAlignment` (`satisfies` Wrangler types against emitted `source`). */
function defineShim<const Spec extends string>(
  def: Shim<Spec> & { typeAlignment: unknown },
): Shim<Spec> {
  const { typeAlignment, ...shim } = def;
  void typeAlignment;
  return shim;
}

const shims = [
  defineShim({
    specifier: "cloudflare:workers",
    virtualModuleId: virtualId("cloudflare-workers"),
    source: `
export const env = {
  DB: undefined,
  RESEND_API_KEY: undefined,
};
`.trimStart(),
    typeAlignment: {
      DB: undefined,
      RESEND_API_KEY: undefined,
    } satisfies Partial<Pick<Env, "DB" | "RESEND_API_KEY">>,
  }),
] as const satisfies readonly Shim[];

function shimMaps(entries: readonly Shim[]) {
  const resolveToVirtual = new Map<string, string>();
  const loadSource = new Map<string, string>();

  for (const { specifier, virtualModuleId, source } of entries) {
    if (resolveToVirtual.has(specifier)) {
      throw new Error(
        `[vitest.shims] Duplicate specifier "${specifier}". Remove or rename one entry.`,
      );
    }
    if (loadSource.has(virtualModuleId)) {
      throw new Error(
        `[vitest.shims] Duplicate virtualModuleId "${String(virtualModuleId)}".`,
      );
    }
    resolveToVirtual.set(specifier, virtualModuleId);
    loadSource.set(virtualModuleId, source);
  }

  return { resolveToVirtual, loadSource };
}

const { resolveToVirtual, loadSource } = shimMaps(shims);

export function shimsPlugin(): Plugin {
  return {
    name: "vitest-shims",
    resolveId(id) {
      return resolveToVirtual.get(id);
    },
    load(id) {
      return loadSource.get(id);
    },
  };
}
