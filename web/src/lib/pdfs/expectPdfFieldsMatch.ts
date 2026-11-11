import { expect } from "vitest";
import type { PDFDefinition, PDFFieldValue } from "#constants/pdf";
import { getPdfForm } from "./getPdfForm";

export async function expectPdfFieldsMatch(
  pdf: PDFDefinition,
  values: Readonly<Record<string, PDFFieldValue>>,
): Promise<void> {
  const form = await getPdfForm(pdf, values);

  for (const [fieldName, value] of Object.entries(values)) {
    if (value === undefined) continue;

    const field = form.getField(fieldName);
    if (field?.type === "radio") {
      const option =
        typeof value === "boolean" ? (value ? "Yes" : "No") : value;
      expect(form.getRadioGroup(fieldName)?.getValue()).toBe(option);
    } else if (typeof value === "boolean") {
      expect(form.getCheckbox(fieldName)?.isChecked()).toBe(value);
    } else {
      expect(form.getTextField(fieldName)?.getValue()).toBe(value);
    }
  }
}
