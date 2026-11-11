import type { Step } from "#constants/forms";
import type { FormPdf } from "#constants/pdf";
import type { FormData } from "#lib/forms/questions";
import { getStepFields, type StepField } from "./getStepFields";

export function getFormFields(steps: readonly Step[]): string[] {
  return steps.flatMap((step) => getStepFields(step).map((field) => field.id));
}

export interface VisibilitySection {
  step: Step;
  fields: readonly StepField[];
}

export interface FormVisibility {
  visibleStepIds: string[];
  visibleFields: FormData;
  sections: readonly VisibilitySection[];
  includedPdfs: FormPdf[];
}

/** Returns only the visible step IDs (cheap — skips field/PDF resolution). */
export function getVisibleStepIds(
  steps: readonly Step[],
  formData: FormData,
): string[] {
  return steps.filter((s) => !s.when || s.when(formData)).map((s) => s.id);
}

/**
 * Resolves all form visibility in one pass: which steps are visible, which
 * fields are visible, and which PDFs to include.
 *
 * This is the single source of truth for visibility. Review table and submit
 * handler should use this. For navigation, prefer `getVisibleStepIds` when
 * field/PDF resolution isn't needed.
 */
export function resolveFormVisibility(
  steps: readonly Step[],
  formData: FormData,
  pdfs: readonly FormPdf[] = [],
): FormVisibility {
  const visibleStepIds: string[] = [];
  const visibleFields: FormData = {};
  const sections: VisibilitySection[] = [];

  for (const step of steps) {
    if (step.when && !step.when(formData)) continue;

    visibleStepIds.push(step.id);

    const fields = getStepFields(step).filter(
      ({ when }) => !when || when(formData),
    );
    for (const { id } of fields) {
      (visibleFields as Record<string, unknown>)[id] = formData[id];
    }
    sections.push({ step, fields });
  }

  const includedPdfs = pdfs.filter((pdf) => !pdf.when || pdf.when(formData));

  return { visibleStepIds, visibleFields, sections, includedPdfs };
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
