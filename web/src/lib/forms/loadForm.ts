import type { FormDefinition, FormDownload, Step } from "#constants/forms";

// Lazy, so a form page downloads only its own form's steps, and its PDFs only
// once the person starts filling.
const definitions = import.meta.glob<FormDefinition>(
  "../../content/forms/**/index.ts",
  { import: "default" },
);
const steps = import.meta.glob<readonly Step[]>(
  "../../content/forms/**/steps.ts",
  { import: "default" },
);
const downloads = import.meta.glob<FormDownload>(
  "../../content/forms/**/download.ts",
  { import: "default" },
);

const PREFIX = "../../content/forms/";

function loadFormFile<T>(
  loaders: Record<string, () => Promise<T>>,
  formId: string,
  file: string,
): Promise<T> {
  const loader = loaders[`${PREFIX}${formId}/${file}`];
  if (!loader) throw new Error(`Form "${formId}" has no ${file}`);
  return loader();
}

/** Every form's id, such as `ma/court-order`. */
export const formIds = Object.keys(definitions).map((path) =>
  path.slice(PREFIX.length, -"/index.ts".length),
);

export const isFormId = (formId: string) =>
  Object.hasOwn(definitions, `${PREFIX}${formId}/index.ts`);

export const loadFormDefinition = (formId: string) =>
  loadFormFile(definitions, formId, "index.ts");

export const loadFormSteps = (formId: string) =>
  loadFormFile(steps, formId, "steps.ts");

export const loadFormDownload = (formId: string) =>
  loadFormFile(downloads, formId, "download.ts");
