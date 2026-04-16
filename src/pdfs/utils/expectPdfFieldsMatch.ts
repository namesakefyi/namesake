import { expect } from "vitest";
import type { FormData } from "../../constants/fields";
import type { PDFDefinition } from "../../constants/pdf";
import { getPdfForm } from "./getPdfForm";

/**
 * Assert that all form data values are correctly written to the PDF fields.
 */
export async function expectPdfFieldsMatch(
  pdf: PDFDefinition,
  userData: Partial<FormData>,
): Promise<void> {
  const form = await getPdfForm({ pdf, userData });
  const expected = pdf.resolver(userData);

  for (const [fieldName, value] of Object.entries(expected)) {
    if (value === undefined) continue;

    if (typeof value === "boolean") {
      expect(form.getCheckBox(fieldName).isChecked()).toBe(value);
    } else {
      expect(form.getTextField(fieldName).getText()).toBe(value);
    }
  }
}
