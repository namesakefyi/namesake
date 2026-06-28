import { PDF } from "@libpdf/core";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { definePdf } from "../definePdf";
import { downloadMergedPdf } from "../downloadMergedPdf";
import { testPdfDefinition } from "./helpers";

describe("downloadMergedPdf", () => {
  let createObjectURL: typeof URL.createObjectURL;
  let revokeObjectURL: typeof URL.revokeObjectURL;
  let mockPdfBytes: Uint8Array;
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    // Silence console.warn for expected UPNG.decode error
    consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    // Create a minimal valid PDF for testing
    const pdfDoc = PDF.create();
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
          new Response(mockPdfBytes as BodyInit, {
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

    // Restore console.warn
    consoleSpy.mockRestore();
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
      jurisdiction: "ma",
      canonicalUrl: "https://example.com",
      pdfPath: "public/forms/test-form-2.pdf",
      resolver: (data) => ({ field1: data.newFirstName }),
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
