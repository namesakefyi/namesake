import { describe, expect, it, vi } from "vitest";
import * as forms from "../../constants/forms";
import * as pdfs from "../../pdfs";
import { getFormPdfMetadata } from "../getFormPdfMetadata";

vi.mock("../../constants/forms", () => ({
  getFormConfig: vi.fn(),
}));

vi.mock("../../pdfs", () => ({
  getPdfDefinition: vi.fn(),
}));

describe("getFormPdfMetadata", () => {
  it("returns an empty array when the form slug has no config", async () => {
    vi.mocked(forms.getFormConfig).mockReturnValue(undefined);

    const result = await getFormPdfMetadata("unknown-form" as never);

    expect(result).toEqual([]);
  });

  it("returns metadata for each PDF in the form config", async () => {
    vi.mocked(forms.getFormConfig).mockReturnValue({
      pdfs: [{ pdfId: "cjp27-petition-to-change-name-of-adult" }],
    } as never);

    vi.mocked(pdfs.getPdfDefinition).mockResolvedValue({
      id: "cjp27-petition-to-change-name-of-adult",
      title: "Petition to Change Name of Adult",
      code: "CJP-27",
    } as never);

    const result = await getFormPdfMetadata("court-order-ma");

    expect(result).toEqual([
      {
        pdfId: "cjp27-petition-to-change-name-of-adult",
        title: "Petition to Change Name of Adult",
        code: "CJP-27",
        conditional: false,
      },
    ]);
  });

  it("sets conditional to false when a PDF has no include predicate", async () => {
    vi.mocked(forms.getFormConfig).mockReturnValue({
      pdfs: [{ pdfId: "affidavit-of-indigency" }],
    } as never);

    vi.mocked(pdfs.getPdfDefinition).mockResolvedValue({
      id: "affidavit-of-indigency",
      title: "Affidavit of Indigency",
    } as never);

    const [metadata] = await getFormPdfMetadata("court-order-ma");

    expect(metadata.conditional).toBe(false);
  });

  it("sets conditional to true when a PDF has an include predicate", async () => {
    vi.mocked(forms.getFormConfig).mockReturnValue({
      pdfs: [
        {
          pdfId: "cjp25-petition-to-change-name-of-minor",
          when: () => true,
        },
      ],
    } as never);

    vi.mocked(pdfs.getPdfDefinition).mockResolvedValue({
      id: "cjp25-petition-to-change-name-of-minor",
      title: "Petition to Change Name of Minor",
      code: "CJP-25",
    } as never);

    const [metadata] = await getFormPdfMetadata("court-order-ma");

    expect(metadata.conditional).toBe(true);
  });

  it("omits code when the PDF definition has none", async () => {
    vi.mocked(forms.getFormConfig).mockReturnValue({
      pdfs: [{ pdfId: "ss5-application-for-social-security-card" }],
    } as never);

    vi.mocked(pdfs.getPdfDefinition).mockResolvedValue({
      id: "ss5-application-for-social-security-card",
      title: "Application for a Social Security Card",
    } as never);

    const [metadata] = await getFormPdfMetadata("social-security");

    expect(metadata.code).toBeUndefined();
  });

  it("returns metadata for all PDFs when a form has multiple", async () => {
    vi.mocked(forms.getFormConfig).mockReturnValue({
      pdfs: [
        { pdfId: "cjp27-petition-to-change-name-of-adult" },
        { pdfId: "affidavit-of-indigency", when: () => true },
      ],
    } as never);

    vi.mocked(pdfs.getPdfDefinition)
      .mockResolvedValueOnce({
        id: "cjp27-petition-to-change-name-of-adult",
        title: "Petition to Change Name of Adult",
        code: "CJP-27",
      } as never)
      .mockResolvedValueOnce({
        id: "affidavit-of-indigency",
        title: "Affidavit of Indigency",
      } as never);

    const result = await getFormPdfMetadata("court-order-ma");

    expect(result).toHaveLength(2);
    expect(result[0].pdfId).toBe("cjp27-petition-to-change-name-of-adult");
    expect(result[1].pdfId).toBe("affidavit-of-indigency");
    expect(result[1].conditional).toBe(true);
  });
});
