import type { FormConfig } from "../constants/forms";

const modules = import.meta.glob<{ [key: string]: FormConfig }>(
  "../content/forms/*/config.ts",
  { eager: true },
);

export function getFormConfig(slug: string): FormConfig | undefined {
  const key = Object.keys(modules).find((k) =>
    k.includes(`/forms/${slug}/config.ts`),
  );
  if (!key) return undefined;
  return Object.values(modules[key]).find(Boolean) as FormConfig;
}
