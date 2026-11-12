import type { FormConfig } from "#constants/forms";

const configs: Record<string, FormConfig> = Object.fromEntries(
  Object.entries(
    import.meta.glob<{ default: FormConfig }>(
      "../../content/forms/**/index.ts",
      { eager: true },
    ),
  ).map(([path, module]) => [
    path.replace(/^.*\/forms\/|\/index\.ts$/g, ""),
    module.default,
  ]),
);

export function getFormConfig(formId: string): FormConfig | undefined {
  return configs[formId];
}

export function getFormConfigs(): Record<string, FormConfig> {
  return configs;
}
