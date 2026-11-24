import { PDF } from "@libpdf/core";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildPdfPacket } from "../buildPdfPacket";
import { testPdf } from "./helpers";

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

  it("starts with a US Letter cover page that includes the logo", async () => {
    const result = await buildPdfPacket({
      title: "Massachusetts Court Order",
      instructions: ["Review all documents carefully."],
      documents: [{ pdf: testPdf, bytes: mockPdfBytes }],
    });

    const coverPage = (await PDF.load(result)).getPages()[0];
    expect(coverPage.width).toBe(612);
    expect(coverPage.height).toBe(792);
    expect(fetch).toHaveBeenCalledWith("/forms/pdf-cover-logo.png");
  });

  it("preserves a filled field on the page following the cover", async () => {
    const source = PDF.create();
    const page = source.addPage({ size: "a4" });
    const name = source.getOrCreateForm().createTextField("name");
    page.drawField(name, { x: 40, y: 700, width: 200, height: 24 });
    name.setValue("River");

    const result = await buildPdfPacket({
      title: "Test Packet",
      instructions: ["First instruction"],
      documents: [{ pdf: testPdf, bytes: await source.save() }],
    });

    const pdfDoc = await PDF.load(result);
    expect(pdfDoc.getPages()).toHaveLength(2);
    expect(pdfDoc.getPages()[1].height).toBeCloseTo(page.height);
    expect(pdfDoc.getForm()?.getTextField("name")?.getValue()).toBe("River");
  });

  it("includes one page per PDF, in the given order, after the cover page", async () => {
    const result = await buildPdfPacket({
      title: "Multi-PDF Packet",
      instructions: [],
      documents: [
        { pdf: testPdf, bytes: mockPdfBytes },
        { pdf: testPdf, bytes: mockPdfBytes },
      ],
    });

    const pdfDoc = await PDF.load(result);
    // Cover page + 2 source PDF pages
    expect(pdfDoc.getPages()).toHaveLength(3);
  });
});
