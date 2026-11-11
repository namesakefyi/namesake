import type { FieldTypeName } from "#constants/fields";
import type { FormConfig } from "#constants/forms";
import type { PDFDefinition } from "#constants/pdf";
import type { Data } from "#lib/forms/questions";
import { getFormConfigs } from "../getFormConfig";
import { getStepFields } from "../getStepFields";

export const forms = Object.entries(getFormConfigs());

const pdfDefinitions = new Map(
  Object.values(
    import.meta.glob<{ default: PDFDefinition }>(
      "/src/content/pdfs/**/index.ts",
      { eager: true },
    ),
  ).map((module) => [module.default.id, module.default]),
);

export function getPdf(pdfId: string): PDFDefinition {
  const pdf = pdfDefinitions.get(pdfId as PDFDefinition["id"]);
  if (!pdf) throw new Error(`No PDF definition for ${pdfId}`);
  return pdf;
}

const askedFields = new WeakMap<FormConfig, Map<string, FieldTypeName>>();

/** Each field a form asks, with its type. */
export function getAskedFields(config: FormConfig): Map<string, FieldTypeName> {
  let asked = askedFields.get(config);
  if (!asked) {
    asked = new Map(
      config.steps.flatMap((step) =>
        getStepFields(step).map((field) => [field.id, field.type] as const),
      ),
    );
    askedFields.set(config, asked);
  }
  return asked;
}

/** Answer sets to trace with, so more branches of each function run. */
const SAMPLES: readonly ((type: FieldTypeName) => unknown)[] = [
  () => undefined,
  (type) =>
    type === "bool" ? true : type === "list" ? ["other"] : "1990-01-01",
  (type) => (type === "bool" ? false : type === "list" ? [] : ""),
];

/**
 * The fields of `types` a function reads, found by calling it with
 * recording proxies.
 */
export function traceReads(
  read: (data: Data) => unknown,
  types: ReadonlyMap<string, FieldTypeName>,
): string[] {
  const fields = new Set<string>();
  for (const sample of SAMPLES) {
    const data = new Proxy({} as Data, {
      get(_target, property) {
        const type = typeof property === "string" && types.get(property);
        if (!type) return undefined;
        fields.add(property as string);
        return sample(type);
      },
    });
    try {
      read(data);
    } catch {
      // Reads made before the error still count.
    }
  }
  return [...fields];
}
