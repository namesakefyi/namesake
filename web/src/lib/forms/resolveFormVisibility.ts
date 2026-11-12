import type { Step } from "#constants/forms";
import type { Condition, FormData } from "#lib/forms/questions";
import { getStepFields, type StepField } from "./getStepFields";

export interface VisibilitySection {
  step: Step;
  fields: readonly StepField[];
}

export interface FormVisibility {
  visibleFields: FormData;
  sections: readonly VisibilitySection[];
}

export const isShown = (item: { when?: Condition }, formData: FormData) =>
  !item.when || item.when(formData);

export function getVisibleStepIds(
  steps: readonly Step[],
  formData: FormData,
): string[] {
  return steps.filter((step) => isShown(step, formData)).map((step) => step.id);
}

/**
 * The visible steps with their visible fields, and the answers to those
 * fields alone, which is what the review page shows and the PDFs are filled
 * with.
 */
export function resolveFormVisibility(
  steps: readonly Step[],
  formData: FormData,
): FormVisibility {
  const visibleFields: FormData = {};
  const sections: VisibilitySection[] = [];

  for (const step of steps) {
    if (!isShown(step, formData)) continue;
    const fields = getStepFields(step).filter((field) =>
      isShown(field, formData),
    );
    for (const { id } of fields) {
      (visibleFields as Record<string, unknown>)[id] = formData[id];
    }
    sections.push({ step, fields });
  }

  return { visibleFields, sections };
}
