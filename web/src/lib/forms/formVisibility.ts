import type { Instruction, Step } from "#constants/forms";
import type { Condition, FormData } from "#lib/forms/questions";
import { getStepFields, type StepField } from "./getStepFields";

export function getFormFields(steps: readonly Step[]): string[] {
  return steps.flatMap((step) => getStepFields(step).map((field) => field.id));
}

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

export function resolveInstructions(
  instructions: readonly Instruction[],
  formData: FormData,
): string[] {
  return instructions.flatMap((item) =>
    typeof item === "string"
      ? [item]
      : isShown(item, formData)
        ? [item.text]
        : [],
  );
}

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

/**
 * Finds the next visible step index after `fromIndex`.
 * Returns -1 if none (should advance to review).
 */
export function findNextStepIndex(
  steps: readonly Step[],
  fromIndex: number,
  visibleStepIds: readonly string[],
): number {
  const visibleSet = new Set(visibleStepIds);
  for (let i = fromIndex + 1; i < steps.length; i++) {
    if (visibleSet.has(steps[i].id)) return i;
  }
  return -1;
}

/**
 * Finds the previous visible step index before `fromIndex`.
 * Returns -1 if none (should go back to title).
 */
export function findPrevStepIndex(
  steps: readonly Step[],
  fromIndex: number,
  visibleStepIds: readonly string[],
): number {
  const visibleSet = new Set(visibleStepIds);
  for (let i = fromIndex - 1; i >= 0; i--) {
    if (visibleSet.has(steps[i].id)) return i;
  }
  return -1;
}
