import { describe, expect, it } from "vitest";
import { FIELD_DEFS, type FieldName } from "#constants/fields";
import type { FormConfig } from "#constants/forms";
import type { PDFDefinition } from "#constants/pdf";
import { getFormConfigs } from "../getFormConfig";
import { getStepFields } from "../getStepFields";
import type { Condition, Data } from "../types";
import { getRootContext, walkNodes } from "../walkNodes";

const forms = Object.entries(getFormConfigs());

const pdfDefinitions = new Map(
  Object.values(
    import.meta.glob<{ default: PDFDefinition }>(
      "/src/content/pdfs/**/index.ts",
      { eager: true },
    ),
  ).map((module) => [module.default.id, module.default]),
);

/** PDF fields no step asks for, keyed by form slug, with why that's fine. */
const UNASKED_PDF_FIELDS: Record<string, Partial<Record<FieldName, string>>> = {
  "court-order-ma-minor": {
    mothersMaidenName: "The CJP 34 line is left blank for the filer",
    otherNamesOrAliases: "The CJP 34 line is left blank for the filer",
  },
  "court-order-ri": {
    previousNameFrom: "The previous-name step only asks yes/no",
  },
};

const FIELD_TYPES = new Map<string, string>(
  FIELD_DEFS.map((definition) => [definition.name, definition.type]),
);

/** Answer sets to trace with, so more branches of each function run. */
const SAMPLES: readonly ((fieldName: string) => unknown)[] = [
  () => undefined,
  (fieldName) => {
    const definition = FIELD_DEFS.find(({ name }) => name === fieldName);
    if (definition?.type === "boolean") return true;
    if (definition?.type === "string[]") return ["other"];
    return definition && "values" in definition
      ? definition.values[0]
      : "1990-01-01";
  },
  (fieldName) => {
    const type = FIELD_TYPES.get(fieldName);
    return type === "boolean" ? false : type === "string[]" ? [] : "";
  },
];

/** The fields a function reads, found by calling it with recording proxies. */
function traceReads(read: (data: Data) => unknown): FieldName[] {
  const fields = new Set<FieldName>();
  for (const sample of SAMPLES) {
    const data = new Proxy({} as Data, {
      get(_target, property) {
        if (typeof property !== "string" || !FIELD_TYPES.has(property)) {
          return undefined;
        }
        fields.add(property as FieldName);
        return sample(property);
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

function getWrittenFields(config: FormConfig): Set<FieldName> {
  return new Set(
    config.steps.flatMap((step) =>
      getStepFields(step).map((field) => field.id),
    ),
  );
}

describe("form integrity", () => {
  it("asks for every field an included PDF reads", () => {
    const unasked = forms.flatMap(([slug, config]) => {
      const written = getWrittenFields(config);
      return config.pdfs.flatMap(({ pdfId }) => {
        const pdf = pdfDefinitions.get(pdfId);
        if (!pdf) throw new Error(`No PDF definition for ${pdfId}`);
        return traceReads(pdf.resolver)
          .filter((field) => !written.has(field))
          .map((field) => ({ slug, field, pdfId }));
      });
    });
    const failures = unasked
      .filter(({ slug, field }) => !UNASKED_PDF_FIELDS[slug]?.[field])
      .map(({ slug, field, pdfId }) => `${slug}: ${pdfId} reads ${field}`);
    const stale = Object.entries(UNASKED_PDF_FIELDS).flatMap(([slug, fields]) =>
      Object.keys(fields)
        .filter(
          (field) =>
            !unasked.some(
              (entry) => entry.slug === slug && entry.field === field,
            ),
        )
        .map((field) => `${slug}: ${field} no longer needs an exception`),
    );
    expect(failures).toEqual([]);
    expect(stale).toEqual([]);
  });

  it("only bases conditions on fields asked earlier", () => {
    const failures: string[] = [];
    for (const [slug, config] of forms) {
      const known = new Set<FieldName>();
      for (const step of config.steps) {
        const check = (condition: Condition | undefined) => {
          for (const field of condition ? traceReads(condition) : []) {
            if (!known.has(field)) {
              failures.push(`${slug} › ${step.id}: reads ${field} too early`);
            }
          }
        };
        check(step.when);
        walkNodes(step.body, getRootContext(step), (node) => {
          if ("when" in node) check(node.when);
          if (node.type === "field") {
            for (const written of node.writes) {
              check(written.when);
              known.add(written.id);
            }
          }
        });
      }
    }
    expect(failures).toEqual([]);
  });

  it("asks for each field in only one step", () => {
    const failures = forms.flatMap(([slug, config]) => {
      const writers = new Map<FieldName, string[]>();
      for (const step of config.steps) {
        for (const { id } of getStepFields(step)) {
          writers.set(id, [...(writers.get(id) ?? []), step.id]);
        }
      }
      return [...writers]
        .filter(([, stepIds]) => stepIds.length > 1)
        .map(
          ([field, stepIds]) => `${slug}: ${field} in ${stepIds.join(", ")}`,
        );
    });
    expect(failures).toEqual([]);
  });
});
