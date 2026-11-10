import type { FormConfig } from "#constants/forms";

const modules = import.meta.glob<{ default: FormConfig }>(
  "../../content/forms/**/index.ts",
  { eager: true },
);

export function getFormConfig(id: string): FormConfig | undefined {
  return modules[`../../content/forms/${id}/index.ts`]?.default;
}
