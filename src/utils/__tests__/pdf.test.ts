import { PDFDocument } from "@cantoo/pdf-lib";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { definePdf, downloadPdf, fetchPdf, fillPdf, getPdfForm } from "../pdf";

describe("PDF utilities", () => {
  const testPdfDefinition = definePdf({
    title: "Test Form",
    pdfPath: "public/forms/test-form.pdf",
    fields: (data: {
      newFirstName?: string;
      oldFirstName?: string;
      shouldReturnOriginalDocuments?: boolean;
    }) => ({
      newFirstName: data.newFirstName,
      oldFirstName: data.oldFirstName,
      shouldReturnOriginalDocuments: data.shouldReturnOriginalDocuments,
    }),
  });

  describe("fetchPdf", () => {
    it("should fetch and validate PDF content", async () => {
      const buffer = await fetchPdf("public/forms/test-form.pdf");
      expect(buffer).toBeInstanceOf(ArrayBuffer);
    });

    it("should throw error for non-existent PDF", async () => {
      await expect(fetchPdf("/nonexistent.pdf")).rejects.toThrow(
        "Failed to fetch PDF",
      );
    });

    it("should throw error for non-PDF content", async () => {
      global.fetch = vi.fn().mockResolvedValue(
        new Response("<!DOCTYPE html>", {
          status: 200,
          headers: new Headers({
            "content-type": "text/html",
          }),
        }),
      );

      await expect(fetchPdf("/test.pdf")).rejects.toThrow(
        "Invalid content type",
      );
    });
  });

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
      expect(
        form.getCheckBox("shouldReturnOriginalDocuments").isChecked(),
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

      const pdfDoc = await PDFDocument.load(result);
      const form = pdfDoc.getForm();
      expect(form.getTextField("newFirstName").getText()).toBeUndefined();
      expect(form.getTextField("oldFirstName").getText()).toBeUndefined();
      expect(
        form.getCheckBox("shouldReturnOriginalDocuments").isChecked(),
      ).toBe(false);
    });
  });

  describe("getPdfForm", () => {
    it("should return form object for testing", async () => {
      const form = await getPdfForm({
        pdf: testPdfDefinition,
        userData: {
          newFirstName: "New",
          oldFirstName: "Old",
          shouldReturnOriginalDocuments: true,
        },
      });

      expect(form.getTextField("newFirstName").getText()).toBe("New");
      expect(form.getTextField("oldFirstName").getText()).toBe("Old");
      expect(
        form.getCheckBox("shouldReturnOriginalDocuments").isChecked(),
      ).toBe(true);
    });

    it("should throw error for invalid PDF path", async () => {
      const invalidPdf = {
        ...testPdfDefinition,
        pdfPath: "/nonexistent.pdf",
      };

      await expect(
        getPdfForm({
          pdf: invalidPdf,
          userData: {
            newFirstName: "New",
            oldFirstName: "Old",
            shouldReturnOriginalDocuments: false,
          },
        }),
      ).rejects.toThrow();
    });
  });

  describe("definePdf", () => {
    it("should create valid PDF definition", () => {
      const definition = definePdf({
        title: "Test",
        pdfPath: "public/forms/test-form.pdf",
        jurisdiction: "MA",
        code: "TEST-1",
        fields: (data) => ({
          newFirstName: data.newFirstName,
          oldFirstName: data.oldFirstName,
          shouldReturnOriginalDocuments: data.shouldReturnOriginalDocuments,
        }),
      });

      expect(definition).toMatchObject({
        title: "Test",
        pdfPath: "public/forms/test-form.pdf",
        jurisdiction: "MA",
        code: "TEST-1",
      });
      expect(typeof definition.fields).toBe("function");
    });
  });

  describe("downloadPdf", () => {
    let createObjectURL: typeof URL.createObjectURL;
    let revokeObjectURL: typeof URL.revokeObjectURL;

    beforeEach(() => {
      // Store original functions
      createObjectURL = URL.createObjectURL;
      revokeObjectURL = URL.revokeObjectURL;

      // Mock URL.createObjectURL
      URL.createObjectURL = vi.fn().mockReturnValue("blob:mock-url");
      URL.revokeObjectURL = vi.fn();

      // Mock document.createElement
      document.createElement = vi.fn().mockReturnValue({
        href: "",
        download: "",
        click: vi.fn(),
      });
    });

    afterEach(() => {
      // Restore original functions
      URL.createObjectURL = createObjectURL;
      URL.revokeObjectURL = revokeObjectURL;
    });

    it("should create and trigger download of PDF file", async () => {
      const mockAnchor = {
        href: "",
        download: "",
        click: vi.fn(),
      };
      document.createElement = vi.fn().mockReturnValue(mockAnchor);

      await downloadPdf({
        pdf: testPdfDefinition,
        userData: {
          newFirstName: "Test",
          oldFirstName: "Old",
          shouldReturnOriginalDocuments: true,
        },
      });

      // Verify Blob URL was created
      expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));

      // Verify anchor element was configured correctly
      expect(mockAnchor.href).toBe("blob:mock-url");
      expect(mockAnchor.download).toBe("Test Form.pdf");
      expect(mockAnchor.click).toHaveBeenCalled();
    });

    it("should handle errors gracefully", async () => {
      const consoleSpy = vi.spyOn(console, "error");
      document.createElement = vi.fn().mockImplementation(() => {
        throw new Error("Failed to create element");
      });

      await downloadPdf({
        pdf: testPdfDefinition,
        userData: {
          newFirstName: "Test",
          oldFirstName: "Old",
          shouldReturnOriginalDocuments: true,
        },
      });

      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should use PDF title for filename", async () => {
      const mockAnchor = {
        href: "",
        download: "",
        click: vi.fn(),
      };
      document.createElement = vi.fn().mockReturnValue(mockAnchor);

      const customPdf = definePdf({
        title: "Custom Form Name",
        pdfPath: "public/forms/test-form.pdf",
        fields: () => ({}),
      });

      await downloadPdf({
        pdf: customPdf,
        userData: {},
      });

      expect(mockAnchor.download).toBe("Custom Form Name.pdf");
    });
  });
});
