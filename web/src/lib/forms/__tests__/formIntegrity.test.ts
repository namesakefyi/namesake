import { describe, expect, it } from "vitest";
import { type FieldType, SHARED_FIELDS } from "#constants/fields";
import type { Condition } from "#lib/forms/questions";
import { getStepFields } from "../getStepFields";
import { getRootContext, walkQuestions } from "../walkQuestions";
import { forms, getAskedFields, getFieldsReadBy } from "./formFixtures";

/** Every known field, so reads of fields a form doesn't ask are caught. */
const ALL_FIELDS = new Map<string, FieldType>([
  ...Object.entries(SHARED_FIELDS).map(
    ([name, field]) => [name, field.type] as const,
  ),
  ...forms.flatMap(([, config]) => [...getAskedFields(config)]),
]);

describe("form integrity", () => {
  it("asks for every field an included PDF reads", () => {
    const failures = forms.flatMap(([formId, config]) => {
      const asked = getAskedFields(config);
      return config.download.pdfs.flatMap(({ pdf, fill }) => {
        return getFieldsReadBy(fill, ALL_FIELDS)
          .filter((field) => !asked.has(field))
          .map((field) => `${formId}: ${pdf.title} reads ${field}`);
      });
    });
    expect(failures).toEqual([]);
  });

  it("only includes PDFs and instructions based on fields the form asks", () => {
    const failures = forms.flatMap(([formId, config]) => {
      const asked = getAskedFields(config);
      const conditions = [
        ...config.download.pdfs.map(({ pdf, when }) => ({
          name: pdf.title,
          when,
        })),
        ...config.download.instructions.flatMap((instruction) =>
          typeof instruction === "string"
            ? []
            : [{ name: `"${instruction.text}"`, when: instruction.when }],
        ),
      ];
      return conditions.flatMap(({ name, when }) =>
        when
          ? getFieldsReadBy(when, ALL_FIELDS)
              .filter((field) => !asked.has(field))
              .map((field) => `${formId}: ${name} reads ${field}`)
          : [],
      );
    });
    expect(failures).toEqual([]);
  });

  it("only bases conditions on fields asked earlier", () => {
    const failures: string[] = [];
    for (const [formId, config] of forms) {
      const known = new Set<string>();
      for (const step of config.steps) {
        const check = (condition: Condition | undefined) => {
          for (const field of condition
            ? getFieldsReadBy(condition, ALL_FIELDS)
            : []) {
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
      const writers = new Map<string, string[]>();
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
