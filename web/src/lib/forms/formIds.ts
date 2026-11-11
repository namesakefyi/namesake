import type { FormMeta } from "#constants/forms";

const metas = import.meta.glob<FormMeta>("../../content/forms/**/index.ts", {
  import: "default",
});

const PREFIX = "../../content/forms/";

export function loadFormFile<T>(
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

export const isFormId = (formId: string) =>
  Object.hasOwn(metas, `${PREFIX}${formId}/index.ts`);

export const loadFormMeta = (formId: string) =>
  loadFormFile(metas, formId, "index.ts");
