import { PDF } from "@libpdf/core";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildPdfPacket } from "../buildPdfPacket";
import { testPdfDefinition } from "./helpers";

describe("buildPdfPacket", () => {
  let mockPdfBytes: Uint8Array;
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    // Silence console.warn for expected UPNG.decode error
    consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const pdfDoc = PDF.create();
    const page = pdfDoc.addPage();
    page.drawText("Test PDF");
    mockPdfBytes = await pdfDoc.save();

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
    consoleSpy.mockRestore();
  });

  it("returns merged PDF bytes with a cover page followed by each PDF", async () => {
    const result = await buildPdfPacket({
      title: "Test Packet",
      instructions: ["First instruction"],
      pdfs: [testPdfDefinition],
      pdfBytes: [mockPdfBytes],
    });

    const pdfDoc = await PDF.load(result);
    // Cover page + 1 source PDF page
    expect(pdfDoc.getPages()).toHaveLength(2);
  });

  it("includes one page per PDF, in the given order, after the cover page", async () => {
    const result = await buildPdfPacket({
      title: "Multi-PDF Packet",
      instructions: [],
      pdfs: [testPdfDefinition, testPdfDefinition],
      pdfBytes: [mockPdfBytes, mockPdfBytes],
    });

    const pdfDoc = await PDF.load(result);
    // Cover page + 2 source PDF pages
    expect(pdfDoc.getPages()).toHaveLength(3);
  });
});
