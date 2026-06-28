import { PDF } from "@libpdf/core";
import { describe, expect, it } from "vitest";
import { fillPdf } from "../fillPdf";
import { testPdfDefinition } from "./helpers";

describe("fillPdf", () => {
  it("should fill PDF with text and checkbox fields", async () => {
    const result = await fillPdf({
      pdf: testPdfDefinition,
      userData: {
        newFirstName: "New",
        oldFirstName: "Old",
        shouldReturnOriginalDocuments: true,
      },
    });

    expect(result).toBeInstanceOf(Uint8Array);

    // Verify the filled PDF
    const pdfDoc = await PDF.load(result);
    const form = pdfDoc.getForm();
    expect(form?.getTextField("newFirstName")?.getValue()).toBe("New");
    expect(form?.getTextField("oldFirstName")?.getValue()).toBe("Old");
    expect(
      form?.getCheckbox("shouldReturnOriginalDocuments")?.isChecked(),
    ).toBe(true);
  });

  it("should handle empty or undefined values", async () => {
    const result = await fillPdf({
      pdf: testPdfDefinition,
      userData: {
        newFirstName: "",
        oldFirstName: "",
        shouldReturnOriginalDocuments: false,
      },
    });

    const pdfDoc = await PDF.load(result);
    const form = pdfDoc.getForm();
    expect(form?.getTextField("newFirstName")?.getValue()).toBeFalsy();
    expect(form?.getTextField("oldFirstName")?.getValue()).toBeFalsy();
    expect(
      form?.getCheckbox("shouldReturnOriginalDocuments")?.isChecked(),
    ).toBe(false);
  });

  it("should set a title and author", async () => {
    const result = await fillPdf({
      pdf: testPdfDefinition,
      userData: {},
    });

    const pdfDoc = await PDF.load(result);

    expect(pdfDoc.getTitle()).toBe("Test Form");
    expect(pdfDoc.getAuthor()).toBe("Filled by Namesake Collaborative");
  });
});
