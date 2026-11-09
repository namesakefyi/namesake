import { describe, expect, it, vi } from "vitest";
import { FIELD_DEFS, type FormData } from "#constants/fields";
import type { FormConfig } from "#constants/forms";
import { getFormConfigs } from "#lib/forms/getFormConfig";
import { getStepFields, type StepField } from "#lib/forms/getStepFields";
import { FormStepContext } from "../FormContainer/FormStepContext";
import { renderWithFormProvider } from "../test-utils";
import { FormReviewTable } from "./FormReviewTable";

const contextValue = {
  onNext: vi.fn(),
  onBack: vi.fn(),
  formTitle: "Test Form",
  phase: "review" as const,
  currentStepIndex: 0,
  totalSteps: 1,
  onSubmit: vi.fn(),
  onEditStep: vi.fn(),
  submitError: null,
};

/** A deterministic answer for every field a form writes. */
function makeFixture(
  fields: readonly StepField[],
  booleanAnswer: boolean,
): Partial<FormData> {
  const fixture: Record<string, unknown> = {};
  for (const { id: fieldName, currency } of fields) {
    const definition = FIELD_DEFS.find(
      (candidate) => candidate.name === fieldName,
    );
    if (!definition) continue;
    if (definition.type === "boolean") {
      fixture[fieldName] = booleanAnswer;
    } else if (definition.type === "string[]") {
      fixture[fieldName] = [`${fieldName} 1`, `${fieldName} 2`];
    } else if ("values" in definition) {
      fixture[fieldName] = definition.values[0];
    } else if (currency) {
      fixture[fieldName] = "1234";
    } else if (fieldName === "dateOfBirth") {
      fixture[fieldName] = "1990-06-15";
    } else {
      fixture[fieldName] = `${fieldName} value`;
    }
  }
  return fixture as Partial<FormData>;
}

/** Renders the review table and reads it back as one line per row. */
function renderReview(config: FormConfig, data: Partial<FormData>): string {
  const { container, unmount } = renderWithFormProvider(
    <FormStepContext.Provider value={contextValue}>
      <FormReviewTable steps={config.steps} />
    </FormStepContext.Provider>,
    { defaultValues: data },
  );
  const lines = [...container.querySelectorAll("section")].flatMap(
    (section) => [
      "---",
      ...[...section.querySelectorAll(".form-review-field")].map(
        (row) =>
          `${row.querySelector("dt")?.textContent}${row.querySelector("dd")?.textContent}`,
      ),
    ],
  );
  unmount();
  return lines.join("\n");
}

describe.each(Object.entries(getFormConfigs()))(
  "FormReviewTable for %s",
  (_slug, config) => {
    const fields = config.steps.flatMap(getStepFields);

    it.each([
      ["yes", true],
      ["no", false],
    ] as const)(
      "matches the review output when booleans are %s",
      (_label, booleanAnswer) => {
        expect(
          renderReview(config, makeFixture(fields, booleanAnswer)),
        ).toMatchSnapshot();
      },
    );

    it("matches the review output with no answers", () => {
      expect(renderReview(config, {})).toMatchSnapshot();
    });
  },
);
