import { describe, expect, it, vi } from "vitest";
import { getPdfForm } from "../getPdfForm";
import { testPdfDefinition } from "./helpers";

vi.mock("../loadPdfLib", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../loadPdfLib")>();
  return { loadPdfLib: vi.fn().mockImplementation(actual.loadPdfLib) };
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

    expect(form.getTextField("newFirstName")?.getValue()).toBe("New");
    expect(form.getTextField("oldFirstName")?.getValue()).toBe("Old");
    expect(form.getCheckbox("shouldReturnOriginalDocuments")?.isChecked()).toBe(
      true,
    );
  });

  it("should throw when the loaded PDF has no AcroForm", async () => {
    const { loadPdfLib } = await import("../loadPdfLib");
    vi.mocked(loadPdfLib).mockResolvedValueOnce({
      PDF: {
        load: vi.fn().mockResolvedValue({ getForm: () => null }),
      } as any,
    });
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(
      getPdfForm({ pdf: testPdfDefinition, userData: {} }),
    ).rejects.toThrow("PDF has no AcroForm");

    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    consoleSpy.mockRestore();
  });

  it("should throw error for invalid PDF path", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

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

    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    consoleSpy.mockRestore();
  });
});
