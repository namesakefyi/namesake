import { describe, expect, it } from "vitest";
import { FIELD_DEFS, type FieldName } from "#constants/fields";
import type { FormConfig } from "#constants/forms";
import type { PDFDefinition } from "#constants/pdf";
import type { Condition, Data } from "#lib/forms/questions";
import { getFormConfigs } from "../getFormConfig";
import { getStepFields } from "../getStepFields";
import { getRootContext, walkQuestions } from "../walkQuestions";

const forms = Object.entries(getFormConfigs());

const pdfDefinitions = new Map(
  Object.values(
    import.meta.glob<{ default: PDFDefinition }>(
      "/src/content/pdfs/**/index.ts",
      { eager: true },
    ),
  ).map((module) => [module.default.id, module.default]),
);

const DEFINITIONS = new Map<string, (typeof FIELD_DEFS)[number]>(
  FIELD_DEFS.map((definition) => [definition.name, definition]),
);

/** Answer sets to trace with, so more branches of each function run. */
const SAMPLES: readonly ((fieldName: string) => unknown)[] = [
  () => undefined,
  (fieldName) => {
    const definition = DEFINITIONS.get(fieldName);
    if (definition?.type === "boolean") return true;
    if (definition?.type === "string[]") return ["other"];
    return definition && "values" in definition
      ? definition.values[0]
      : "1990-01-01";
  },
  (fieldName) => {
    const type = DEFINITIONS.get(fieldName)?.type;
    return type === "boolean" ? false : type === "string[]" ? [] : "";
  },
];

/** The fields a function reads, found by calling it with recording proxies. */
function traceReads(read: (data: Data) => unknown): FieldName[] {
  const fields = new Set<FieldName>();
  for (const sample of SAMPLES) {
    const data = new Proxy({} as Data, {
      get(_target, property) {
        if (typeof property !== "string" || !DEFINITIONS.has(property)) {
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
    const failures = forms.flatMap(([formId, config]) => {
      const written = getWrittenFields(config);
      return config.pdfs.flatMap(({ pdfId }) => {
        const pdf = pdfDefinitions.get(pdfId);
        if (!pdf) throw new Error(`No PDF definition for ${pdfId}`);
        return traceReads(pdf.resolver)
          .filter((field) => !written.has(field))
          .map((field) => `${formId}: ${pdfId} reads ${field}`);
      });
    });
    expect(failures).toEqual([]);
  });

  it("only bases conditions on fields asked earlier", () => {
    const failures: string[] = [];
    for (const [formId, config] of forms) {
      const known = new Set<FieldName>();
      for (const step of config.steps) {
        const check = (condition: Condition | undefined) => {
          for (const field of condition ? traceReads(condition) : []) {
            if (!known.has(field)) {
              failures.push(`${formId} › ${step.id}: reads ${field} too early`);
            }
          }
        };
        check(step.when);
        walkQuestions(step.questions, getRootContext(step), (question) => {
          if ("when" in question) check(question.when);
          if (question.type === "field") {
            for (const written of question.writes) {
              check(written.when);
              known.add(written.id);
            }
          }
        });
      }
    }
    expect(failures).toEqual([]);
  });

  it("gives each step in a form a unique ID", () => {
    const failures = forms.flatMap(([formId, config]) => {
      const ids = config.steps.map((step) => step.id);
      return ids
        .filter((id, index) => ids.indexOf(id) !== index)
        .map((id) => `${formId}: step "${id}" is used more than once`);
    });
    expect(failures).toEqual([]);
  });

  it("asks for each field in only one step", () => {
    const failures = forms.flatMap(([formId, config]) => {
      const writers = new Map<FieldName, string[]>();
      for (const step of config.steps) {
        for (const { id } of getStepFields(step)) {
          writers.set(id, [...(writers.get(id) ?? []), step.id]);
        }
      }
      return [...writers]
        .filter(([, stepIds]) => stepIds.length > 1)
        .map(
          ([field, stepIds]) => `${formId}: ${field} in ${stepIds.join(", ")}`,
        );
    });
    expect(failures).toEqual([]);
  });
});
