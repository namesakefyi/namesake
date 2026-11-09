import type { FieldName, FormData } from "#constants/fields";
import type { FormPdfConfig } from "#constants/forms";
import type { PDFId } from "#constants/pdf";
import { expandLegacyFields, normalizeStep } from "./steps/normalize";
import type { Field, Step } from "./types";

/** Extracts all field names from a legacy step's fields array. */
export function getFieldNames(fields: readonly Field[]): FieldName[] {
  return expandLegacyFields(fields).map((entry) => entry.id);
}

/** Extracts all field names written by form steps. */
export function getFormFields(steps: readonly Step[]): FieldName[] {
  return steps.flatMap((step) =>
    normalizeStep(step).fields.map((field) => field.id),
  );
}

/**
 * Looks up a field's `when` predicate from a legacy fields array.
 *
 * Returns the callback if the field is conditional, `null` if the field
 * exists but is unconditional (always visible), or `undefined` if the
 * field is not listed at all.
 */
export function getFieldWhen(
  fields: readonly Field[],
  fieldName: FieldName,
): ((data: Partial<FormData>) => boolean) | null | undefined {
  const entry = expandLegacyFields(fields).find(
    (candidate) => candidate.id === fieldName,
  );
  if (!entry) return undefined;
  return entry.when ?? null;
}

/**
 * Whether a field a step writes is visible for the given answers, combining
 * the step's, enclosing subsections' and the field's own conditions.
 * Returns `false` if the step doesn't write the field.
 */
export function isStepFieldVisible(
  step: Step,
  fieldName: FieldName,
  data: Partial<FormData>,
): boolean {
  const field = normalizeStep(step).fields.find(
    (candidate) => candidate.id === fieldName,
  );
  if (!field) return false;
  return !field.when || field.when(data);
}

export interface VisibilitySection {
  stepId: string;
  fields: readonly FieldName[];
}

export interface FormVisibility {
  visibleStepIds: string[];
  visibleFields: Partial<FormData>;
  sections: readonly VisibilitySection[];
  pdfsToInclude: Array<{ pdfId: PDFId; include: boolean }>;
}

/** Returns only the visible step IDs (cheap — skips field/PDF resolution). */
export function getVisibleStepIds(
  steps: readonly Step[],
  formData: Partial<FormData>,
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
  formData: Partial<FormData>,
  pdfs: readonly FormPdfConfig[] = [],
): FormVisibility {
  const visibleStepIds: string[] = [];
  const visibleFields: Partial<FormData> = {};
  const sections: VisibilitySection[] = [];

  for (const step of steps) {
    if (step.when && !step.when(formData)) continue;

    visibleStepIds.push(step.id);

    const visibleFieldNames: FieldName[] = [];
    for (const { id: fieldId, when } of normalizeStep(step).fields) {
      if (!when || when(formData)) {
        (visibleFields as Record<string, unknown>)[fieldId] = formData[fieldId];
        visibleFieldNames.push(fieldId);
      }
    }
    sections.push({ stepId: step.id, fields: visibleFieldNames });
  }

  const pdfsToInclude = pdfs.map((pdf) => ({
    pdfId: pdf.pdfId,
    include: pdf.when ? pdf.when(formData) : true,
  }));

  return { visibleStepIds, visibleFields, sections, pdfsToInclude };
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
