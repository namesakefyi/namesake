import type { FormConfig } from "#constants/forms";

const modules = import.meta.glob<{ default: FormConfig }>(
  "../../content/forms/*/index.ts",
  { eager: true },
);

export function getFormConfig(slug: string): FormConfig | undefined {
  const key = Object.keys(modules).find((k) =>
    k.endsWith(`/forms/${slug}/index.ts`),
  );
  if (!key) return undefined;
  return modules[key].default;
}

/** Every form's config, keyed by slug. */
export function getFormConfigs(): Record<string, FormConfig> {
  return Object.fromEntries(
    Object.entries(modules).map(([path, module]) => [
      path.split("/").at(-2) as string,
      module.default,
    ]),
  );
}
