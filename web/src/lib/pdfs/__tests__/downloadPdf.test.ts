import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { definePdf } from "../definePdf";
import { downloadPdf } from "../downloadPdf";
import { fillPdf } from "../fillPdf";
import { testPdf } from "./helpers";

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

    const pdfBytes = await fillPdf(testPdf, {
      newFirstName: "Test",
      oldFirstName: "Old",
      shouldReturnOriginalDocuments: true,
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

  it("propagates errors instead of swallowing them", async () => {
    document.createElement = vi.fn().mockImplementation(() => {
      throw new Error("Failed to create element");
    });

    const pdfBytes = await fillPdf(testPdf, {
      newFirstName: "Test",
      oldFirstName: "Old",
      shouldReturnOriginalDocuments: true,
    });

    await expect(
      downloadPdf({
        pdfBytes,
        title: "Test Form",
      }),
    ).rejects.toThrow("Failed to create element");
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
      canonicalUrl: "https://example.com",
      file: "public/forms/test-form.pdf",
      fields: {},
    });

    const pdfBytes = await fillPdf(customPdf, {});

    await downloadPdf({
      pdfBytes,
      title: "Custom Form Name",
    });

    expect(mockAnchor.download).toBe("Custom Form Name.pdf");
  });
});
