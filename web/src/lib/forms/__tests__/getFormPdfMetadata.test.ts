import { describe, expect, it, vi } from "vitest";
import { secondTestFormPdf, testFormPdf } from "#lib/pdfs/__tests__/helpers";
import * as forms from "../getFormConfig";
import { getFormPdfMetadata } from "../getFormPdfMetadata";

vi.mock("../getFormConfig", () => ({
  getFormConfig: vi.fn(),
}));

describe("getFormPdfMetadata", () => {
  it("returns an empty array when the form id has no config", () => {
    vi.mocked(forms.getFormConfig).mockReturnValue(undefined);

    expect(getFormPdfMetadata("unknown-form")).toEqual([]);
  });

  it("describes each PDF in the download, marking conditional ones", () => {
    vi.mocked(forms.getFormConfig).mockReturnValue({
      title: "Test",
      category: "court-order",
      steps: [],
      download: {
        title: "Packet",
        instructions: [],
        pdfs: [
          { ...testFormPdf, pdf: { ...testFormPdf.pdf, code: "CJP-27" } },
          { ...secondTestFormPdf, when: () => true },
        ],
      },
    });

    expect(getFormPdfMetadata("ma/court-order")).toEqual([
      {
        title: "Test Form",
        code: "CJP-27",
        conditional: false,
        file: "public/forms/test-form.pdf",
      },
      {
        title: "Test Form 2",
        code: undefined,
        conditional: true,
        file: "public/forms/test-form-2.pdf",
      },
    ]);
  });
});
