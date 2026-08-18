import { PDF } from "@libpdf/core";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { definePdf } from "../definePdf";
import { mergePdfsWithCoverPage } from "../mergePdfsWithCoverPage";
import { testPdfDefinition } from "./helpers";

describe("mergePdfsWithCoverPage", () => {
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

    createObjectURL = URL.createObjectURL;
    revokeObjectURL = URL.revokeObjectURL;

    URL.createObjectURL = vi.fn().mockReturnValue("blob:mock-url");
    URL.revokeObjectURL = vi.fn();

    document.createElement = vi.fn().mockReturnValue({
      href: "",
      download: "",
      click: vi.fn(),
    });

    global.fetch = vi.fn().mockImplementation((url) => {
      if (url === "/forms/pdf-cover-logo.png") {
        return Promise.resolve(
          new Response(new ArrayBuffer(8), {
            headers: { "content-type": "image/png" },
          }),
        );
      }
      return Promise.reject(new Error("Not found"));
    });
  });

  afterEach(() => {
    URL.createObjectURL = createObjectURL;
    URL.revokeObjectURL = revokeObjectURL;
    consoleSpy.mockRestore();
  });

  it("merges a cover page with bytes produced by getPdfBytes and downloads the result", async () => {
    const mockAnchor = {
      href: "",
      download: "",
      click: vi.fn(),
    };
    document.createElement = vi.fn().mockReturnValue(mockAnchor);

    const getPdfBytes = vi.fn().mockResolvedValue(mockPdfBytes);

    await mergePdfsWithCoverPage({
      title: "Test Packet",
      instructions: ["First instruction"],
      pdfs: [testPdfDefinition],
      getPdfBytes,
    });

    expect(getPdfBytes).toHaveBeenCalledWith(testPdfDefinition);
    expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(mockAnchor.href).toBe("blob:mock-url");
    expect(mockAnchor.download).toBe("Test Packet.pdf");
    expect(mockAnchor.click).toHaveBeenCalled();
  });

  it("calls getPdfBytes once per PDF, in order", async () => {
    const mockAnchor = { href: "", download: "", click: vi.fn() };
    document.createElement = vi.fn().mockReturnValue(mockAnchor);

    const secondPdf = definePdf({
      id: "test-form-2" as any,
      title: "Test Form 2",
      jurisdiction: "ma",
      canonicalUrl: "https://example.com",
      pdfPath: "public/forms/test-form-2.pdf",
      resolver: (data) => ({ field1: data.newFirstName }),
    });

    const getPdfBytes = vi.fn().mockResolvedValue(mockPdfBytes);

    await mergePdfsWithCoverPage({
      title: "Multi-PDF Packet",
      instructions: [],
      pdfs: [testPdfDefinition, secondPdf],
      getPdfBytes,
    });

    expect(getPdfBytes).toHaveBeenCalledTimes(2);
    expect(getPdfBytes).toHaveBeenNthCalledWith(1, testPdfDefinition);
    expect(getPdfBytes).toHaveBeenNthCalledWith(2, secondPdf);
    expect(mockAnchor.download).toBe("Multi-PDF Packet.pdf");
  });

  it("propagates a rejection from getPdfBytes without downloading", async () => {
    const mockAnchor = { href: "", download: "", click: vi.fn() };
    document.createElement = vi.fn().mockReturnValue(mockAnchor);

    const getPdfBytes = vi.fn().mockRejectedValue(new Error("fetch failed"));

    await expect(
      mergePdfsWithCoverPage({
        title: "Test Packet",
        instructions: [],
        pdfs: [testPdfDefinition],
        getPdfBytes,
      }),
    ).rejects.toThrow("fetch failed");

    expect(mockAnchor.click).not.toHaveBeenCalled();
  });
});
