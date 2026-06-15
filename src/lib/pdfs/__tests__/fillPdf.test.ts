import { PDFDocument } from "@cantoo/pdf-lib";
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
    const pdfDoc = await PDFDocument.load(result);
    const form = pdfDoc.getForm();
    expect(form.getTextField("newFirstName").getText()).toBe("New");
    expect(form.getTextField("oldFirstName").getText()).toBe("Old");
    expect(form.getCheckBox("shouldReturnOriginalDocuments").isChecked()).toBe(
      true,
    );
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

    const pdfDoc = await PDFDocument.load(result);
    const form = pdfDoc.getForm();
    expect(form.getTextField("newFirstName").getText()).toBeUndefined();
    expect(form.getTextField("oldFirstName").getText()).toBeUndefined();
    expect(form.getCheckBox("shouldReturnOriginalDocuments").isChecked()).toBe(
      false,
    );
  });

  it("should set a title and author", async () => {
    const result = await fillPdf({
      pdf: testPdfDefinition,
      userData: {},
    });

    const pdfDoc = await PDFDocument.load(result);

    expect(pdfDoc.getTitle()).toBe("Test Form");
    expect(pdfDoc.getAuthor()).toBe("Filled by Namesake Collaborative");
  });
});
