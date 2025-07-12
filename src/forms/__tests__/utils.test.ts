import { PDFDocument } from "@cantoo/pdf-lib";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createCoverPage,
  definePdf,
  downloadMergedPdf,
  downloadPdf,
  fetchPdf,
  fillPdf,
  getPdfForm,
  loadPdfs,
} from "../utils";

vi.mock("@/forms", () => ({
  getPdfDefinition: vi.fn(),
}));

import { getPdfDefinition } from "@/forms";

describe("PDF utilities", () => {
  const testPdfDefinition = definePdf({
    id: "test-form" as any,
    title: "Test Form",
    jurisdiction: "MA",
    pdfPath: "public/forms/test-form.pdf",
    fields: (data) => ({
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
        id: "test-form" as any,
        title: "Test Form",
        jurisdiction: "MA",
        pdfPath: "public/forms/test-form.pdf",
        fields: (data) => ({
          newFirstName: data.newFirstName,
          oldFirstName: data.oldFirstName,
          shouldReturnOriginalDocuments: data.shouldReturnOriginalDocuments,
        }),
      });

      expect(definition).toMatchObject({
        id: "test-form",
        pdfPath: "public/forms/test-form.pdf",
        fields: expect.any(Function),
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

      const pdfBytes = await fillPdf({
        pdf: testPdfDefinition,
        userData: {
          newFirstName: "Test",
          oldFirstName: "Old",
          shouldReturnOriginalDocuments: true,
        },
      });

      await downloadPdf({
        pdfBytes,
        title: "Test Form",
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

      const pdfBytes = await fillPdf({
        pdf: testPdfDefinition,
        userData: {
          newFirstName: "Test",
          oldFirstName: "Old",
          shouldReturnOriginalDocuments: true,
        },
      });

      await downloadPdf({
        pdfBytes,
        title: "Test Form",
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
        id: "test-form" as any,
        title: "Custom Form Name",
        jurisdiction: "MA",
        pdfPath: "public/forms/test-form.pdf",
        fields: () => ({}),
      });

      const pdfBytes = await fillPdf({
        pdf: customPdf,
        userData: {},
      });

      await downloadPdf({
        pdfBytes,
        title: "Custom Form Name",
      });

      expect(mockAnchor.download).toBe("Custom Form Name.pdf");
    });
  });

  describe("createCoverPage", () => {
    it("should create a cover page with all required elements", async () => {
      const result = await createCoverPage({
        title: "Massachusetts Court Order",
        instructions: [
          "Review all documents carefully.",
          "Do not sign documents until in the presence of a notary.",
          "Remember to bring all required supporting documents to the court.",
          "You got this! We're here for you.",
        ],
        documents: [
          { title: "Petition to Change Name of Adult", code: "CJP 27" },
          { title: "Motion to Waive Publication", code: "CJD 400" },
        ],
      });

      expect(result).toBeInstanceOf(Uint8Array);
      expect(fetch).toHaveBeenCalledWith("/forms/pdf-cover-logo.png");

      // Load the PDF and verify its structure
      const pdfDoc = await PDFDocument.load(result);
      const pages = pdfDoc.getPages();
      expect(pages).toHaveLength(1);

      const page = pages[0];
      const { width, height } = page.getSize();
      expect(width).toBe(612); // Standard US Letter width
      expect(height).toBe(792); // Standard US Letter height
    });
  });

  describe("downloadMergedPdf", () => {
    let createObjectURL: typeof URL.createObjectURL;
    let revokeObjectURL: typeof URL.revokeObjectURL;
    let mockPdfBytes: Uint8Array;

    beforeEach(async () => {
      // Create a minimal valid PDF for testing
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      page.drawText("Test PDF");
      mockPdfBytes = await pdfDoc.save();

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

      // Mock fetch for all PDF files and logo
      global.fetch = vi.fn().mockImplementation((url) => {
        if (url === "/forms/pdf-cover-logo.png") {
          return Promise.resolve(
            new Response(new ArrayBuffer(8), {
              headers: { "content-type": "image/png" },
            }),
          );
        }
        // Mock PDF files
        if (
          url === "public/forms/test-form.pdf" ||
          url === "public/forms/test-form-2.pdf"
        ) {
          return Promise.resolve(
            new Response(mockPdfBytes, {
              headers: { "content-type": "application/pdf" },
            }),
          );
        }
        return Promise.reject(new Error("Not found"));
      });
    });

    afterEach(() => {
      // Restore original functions
      URL.createObjectURL = createObjectURL;
      URL.revokeObjectURL = revokeObjectURL;
    });

    it("should create and download merged PDF with cover page and filled PDFs", async () => {
      const mockAnchor = {
        href: "",
        download: "",
        click: vi.fn(),
      };
      document.createElement = vi.fn().mockReturnValue(mockAnchor);

      await downloadMergedPdf({
        title: "Test Packet",
        instructions: ["First instruction", "Second instruction"],
        pdfs: [testPdfDefinition],
        userData: {},
      });

      // Verify Blob URL was created
      expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));

      // Verify anchor element was configured correctly
      expect(mockAnchor.href).toBe("blob:mock-url");
      expect(mockAnchor.download).toBe("Test Packet.pdf");
      expect(mockAnchor.click).toHaveBeenCalled();

      // Verify PDF files were fetched
      expect(fetch).toHaveBeenCalledWith("public/forms/test-form.pdf");
      expect(fetch).toHaveBeenCalledWith("/forms/pdf-cover-logo.png");
    });

    it("should handle multiple PDFs in the packet", async () => {
      const mockAnchor = {
        href: "",
        download: "",
        click: vi.fn(),
      };
      document.createElement = vi.fn().mockReturnValue(mockAnchor);

      const secondPdf = definePdf({
        id: "test-form-2" as any,
        title: "Test Form 2",
        jurisdiction: "MA",
        pdfPath: "public/forms/test-form-2.pdf",
        fields: (data) => ({
          field1: data.newFirstName,
        }),
      });

      await downloadMergedPdf({
        title: "Multi-PDF Packet",
        instructions: ["First instruction"],
        pdfs: [testPdfDefinition, secondPdf],
        userData: {},
      });

      // Verify Blob URL was created
      expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));

      // Verify anchor element was configured correctly
      expect(mockAnchor.href).toBe("blob:mock-url");
      expect(mockAnchor.download).toBe("Multi-PDF Packet.pdf");
      expect(mockAnchor.click).toHaveBeenCalled();

      // Verify all PDF files were fetched
      expect(fetch).toHaveBeenCalledWith("public/forms/test-form.pdf");
      expect(fetch).toHaveBeenCalledWith("public/forms/test-form-2.pdf");
      expect(fetch).toHaveBeenCalledWith("/forms/pdf-cover-logo.png");
    });
  });

  describe("loadPdfs", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should load PDFs for all included pdfIds", async () => {
      const mockPdf1 = {
        id: "test-form-1" as any,
        title: "Test Form 1",
        jurisdiction: "MA",
        pdfPath: "public/forms/test-form-1.pdf",
        fields: () => ({}),
      };

      const mockPdf2 = {
        id: "test-form-2" as any,
        title: "Test Form 2",
        jurisdiction: "MA",
        pdfPath: "public/forms/test-form-2.pdf",
        fields: () => ({}),
      };

      (getPdfDefinition as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce(mockPdf1)
        .mockResolvedValueOnce(mockPdf2);

      const result = await loadPdfs([
        { pdfId: "test-form-1" as any },
        { pdfId: "test-form-2" as any },
      ]);

      expect(result).toEqual([mockPdf1, mockPdf2]);
      expect(getPdfDefinition).toHaveBeenCalledTimes(2);
      expect(getPdfDefinition).toHaveBeenCalledWith("test-form-1");
      expect(getPdfDefinition).toHaveBeenCalledWith("test-form-2");
    });

    it("should exclude PDFs when include is false", async () => {
      const mockPdf = {
        id: "test-form-1" as any,
        title: "Test Form 1",
        jurisdiction: "MA",
        pdfPath: "public/forms/test-form-1.pdf",
        fields: () => ({}),
      };

      (getPdfDefinition as ReturnType<typeof vi.fn>).mockResolvedValue(mockPdf);

      const result = await loadPdfs([
        { pdfId: "test-form-1" as any, include: true },
        { pdfId: "test-form-2" as any, include: false },
        { pdfId: "test-form-3" as any }, // defaults to true
      ]);

      expect(result).toHaveLength(2);
      expect(getPdfDefinition).toHaveBeenCalledTimes(2);
      expect(getPdfDefinition).toHaveBeenCalledWith("test-form-1");
      expect(getPdfDefinition).toHaveBeenCalledWith("test-form-3");
      expect(getPdfDefinition).not.toHaveBeenCalledWith("test-form-2");
    });

    it("should return empty array when all PDFs are excluded", async () => {
      const result = await loadPdfs([
        { pdfId: "test-form-1" as any, include: false },
        { pdfId: "test-form-2" as any, include: false },
      ]);

      expect(result).toEqual([]);
      expect(getPdfDefinition).not.toHaveBeenCalled();
    });

    it("should handle empty input array", async () => {
      const result = await loadPdfs([]);

      expect(result).toEqual([]);
      expect(getPdfDefinition).not.toHaveBeenCalled();
    });

    it("should handle getPdfDefinition errors", async () => {
      (getPdfDefinition as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error("PDF not found"),
      );

      await expect(
        loadPdfs([{ pdfId: "nonexistent-form" as any }]),
      ).rejects.toThrow("PDF not found");

      expect(getPdfDefinition).toHaveBeenCalledWith("nonexistent-form");
    });
  });
});
