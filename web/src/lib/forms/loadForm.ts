import { useEffect, useState } from "react";
import type { FormDownload, FormMeta, Step } from "#constants/forms";

// Lazy, so a form page downloads only its own form's steps, and its PDFs only
// once the person starts filling.
const metas = import.meta.glob<FormMeta>("../../content/forms/**/index.ts", {
  import: "default",
});
const steps = import.meta.glob<readonly Step[]>(
  "../../content/forms/**/steps.ts",
  { import: "default" },
);
const downloads = import.meta.glob<FormDownload>(
  "../../content/forms/**/download.ts",
  { import: "default" },
);

const PREFIX = "../../content/forms/";

function load<T>(
  loaders: Record<string, () => Promise<T>>,
  formId: string,
  file: string,
): Promise<T> {
  const loader = loaders[`${PREFIX}${formId}/${file}`];
  if (!loader) throw new Error(`Form "${formId}" has no ${file}`);
  return loader();
}

/** Every form's id, such as `ma/court-order`. */
export const formIds = Object.keys(metas).map((path) =>
  path.slice(PREFIX.length, -"/index.ts".length),
);

export function isFormId(formId: string): boolean {
  return Object.hasOwn(metas, `${PREFIX}${formId}/index.ts`);
}

export const loadFormMeta = (formId: string) => load(metas, formId, "index.ts");

export const loadFormSteps = (formId: string) =>
  load(steps, formId, "steps.ts");

export const loadFormDownload = (formId: string) =>
  load(downloads, formId, "download.ts");

export function useFormSteps(formId: string): readonly Step[] | undefined {
  const [loaded, setLoaded] = useState<readonly Step[]>();

  useEffect(() => {
    let isCurrent = true;
    setLoaded(undefined);
    loadFormSteps(formId)
      .then((formSteps) => {
        if (isCurrent) setLoaded(formSteps);
      })
      .catch((error) => {
        console.error(`Failed to load form "${formId}":`, error);
      });
    return () => {
      isCurrent = false;
    };
  }, [formId]);

  return loaded;
}
