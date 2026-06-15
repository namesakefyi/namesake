import { PDFDocument } from "@cantoo/pdf-lib";
import { describe, expect, it, vi } from "vitest";
import { createCoverPage } from "../createCoverPage";

describe("createCoverPage", () => {
  it("should create a cover page with all required elements", async () => {
    // Silence console.warn for expected UPNG.decode error
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

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

    consoleSpy.mockRestore();
  });
});
