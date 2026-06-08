import type { FormConfig } from "../constants/forms";

const modules = import.meta.glob<{ default: FormConfig }>(
  "../content/forms/*/index.ts",
  { eager: true },
);

export function getFormConfig(slug: string): FormConfig | undefined {
  const key = Object.keys(modules).find((k) =>
    k.endsWith(`/forms/${slug}/index.ts`),
  );
  if (!key) return undefined;
  return modules[key].default;
}
