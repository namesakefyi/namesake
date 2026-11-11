import { describe, expect, it, vi } from "vitest";
import { getPdfForm } from "../getPdfForm";
import { testPdf } from "./helpers";

vi.mock("../loadPdfLib", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../loadPdfLib")>();
  return { loadPdfLib: vi.fn().mockImplementation(actual.loadPdfLib) };
});

describe("getPdfForm", () => {
  it("should return form object for testing", async () => {
    const form = await getPdfForm(testPdf, {
      newFirstName: "New",
      oldFirstName: "Old",
      shouldReturnOriginalDocuments: true,
    });

    expect(form.getTextField("newFirstName")?.getValue()).toBe("New");
    expect(form.getTextField("oldFirstName")?.getValue()).toBe("Old");
    expect(form.getCheckbox("shouldReturnOriginalDocuments")?.isChecked()).toBe(
      true,
    );
  });

  it("should throw error for invalid PDF path", async () => {
    const invalidPdf = {
      ...testPdf,
      file: "/nonexistent.pdf",
    };

    await expect(
      getPdfForm(invalidPdf, {
        newFirstName: "New",
        oldFirstName: "Old",
        shouldReturnOriginalDocuments: false,
      }),
    ).rejects.toThrow();
  });
});
