import { expect } from "vitest";
import type { PDFDefinition } from "#constants/pdf";
import type { Data } from "#lib/forms/questions";
import { getPdfForm } from "./getPdfForm";

/**
 * Assert that all form data values are correctly written to the PDF fields.
 */
export async function expectPdfFieldsMatch(
  pdf: PDFDefinition,
  userData: Data,
): Promise<void> {
  const form = await getPdfForm({ pdf, userData });
  const expected = pdf.resolver(userData);

  for (const [fieldName, value] of Object.entries(expected)) {
    if (value === undefined) continue;

    const field = form?.getField(fieldName);
    if (field?.type === "radio") {
      const option =
        typeof value === "boolean" ? (value ? "Yes" : "No") : value;
      expect(form?.getRadioGroup(fieldName)?.getValue()).toBe(option);
    } else if (typeof value === "boolean") {
      expect(form?.getCheckbox(fieldName)?.isChecked()).toBe(value);
    } else {
      expect(form?.getTextField(fieldName)?.getValue()).toBe(value);
    }
  }
}
