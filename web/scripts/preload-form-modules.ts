import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";
import type { Plugin } from "vite";

const FORM_STEPS = /\/src\/content\/forms\/(.+)\/steps\.ts$/;
const PLACEHOLDER =
  /<link rel="modulepreload" data-form-module="([^"]+)"\s*\/?>/g;

/**
 * Form pages load their form's `steps.ts` after the island hydrates. This
 * fills in the `<link rel="modulepreload" data-form-module>` that
 * `FormContainer.astro` renders, so the browser fetches the steps' chunks
 * alongside the island's. `download.ts` stays out, since it loads later.
 */
export function preloadFormModules(): AstroIntegration {
  const filesByForm = new Map<string, string[]>();
  let base = "/";

  const recordFormChunks: Plugin = {
    name: "namesake:record-form-chunks",
    applyToEnvironment: (environment) => environment.name === "client",
    generateBundle(_options, bundle) {
      const chunks = new Map(
        Object.values(bundle)
          .filter((output) => output.type === "chunk")
          .map((chunk) => [chunk.fileName, chunk]),
      );
      for (const chunk of chunks.values()) {
        const formId = chunk.facadeModuleId?.match(FORM_STEPS)?.[1];
        if (!formId) continue;
        const files = new Set<string>();
        const visit = (fileName: string) => {
          if (files.has(fileName)) return;
          files.add(fileName);
          for (const imported of chunks.get(fileName)?.imports ?? []) {
            visit(imported);
          }
        };
        visit(chunk.fileName);
        filesByForm.set(formId, [...files]);
      }
    },
  };

  return {
    name: "namesake:preload-form-modules",
    hooks: {
      "astro:config:setup": ({ config, updateConfig }) => {
        base = config.base.endsWith("/") ? config.base : `${config.base}/`;
        updateConfig({ vite: { plugins: [recordFormChunks] } });
      },
      "astro:build:done": async ({ dir }) => {
        const root = fileURLToPath(dir);
        const pages = (await readdir(root, { recursive: true })).filter(
          (file) => file.endsWith(".html"),
        );
        await Promise.all(
          pages.map(async (page) => {
            const path = join(root, page);
            const html = await readFile(path, "utf8");
            if (!html.includes("data-form-module")) return;
            const filled = html.replace(PLACEHOLDER, (_tag, formId: string) => {
              const files = filesByForm.get(formId);
              if (!files) {
                throw new Error(`No client chunk found for form "${formId}"`);
              }
              return files
                .map(
                  (file) => `<link rel="modulepreload" href="${base}${file}">`,
                )
                .join("");
            });
            await writeFile(path, filled);
          }),
        );
      },
    },
  };
}
