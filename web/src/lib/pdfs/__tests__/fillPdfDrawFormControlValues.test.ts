import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PDFDefinition } from "#constants/pdf";
import { fillPdf } from "../fillPdf";

// Ensure these are declared when Vitest hoists the module mocks below.
const mocks = vi.hoisted(() => ({
  drawText: vi.fn(),
  fetchPdf: vi.fn(),
  fill: vi.fn(),
  load: vi.fn(),
}));

vi.mock("../fetchPdf", () => ({ fetchPdf: mocks.fetchPdf }));
vi.mock("../loadPdfLib", () => ({
  loadPdfLib: vi.fn().mockResolvedValue({
    PDF: { load: mocks.load },
    StandardFonts: { HelveticaBold: "HelveticaBold" },
  }),
}));

describe("fillPdf drawn form controls", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.fetchPdf.mockResolvedValue(new ArrayBuffer(0));
  });

  it("draws only the selected widget for a string-valued checkbox group", async () => {
    // A grouped checkbox uses one field name with a distinct on-value per widget.
    const pageRef = { objectNumber: 1, generation: 0 };
    const unselectedWidget = {
      pageRef,
      rect: [10, 10, 20, 20] as [number, number, number, number],
      getOnValue: () => "First",
    };
    const selectedWidget = {
      pageRef,
      rect: [30, 10, 40, 20] as [number, number, number, number],
      getOnValue: () => "Second",
    };
    const form = {
      fill: mocks.fill,
      getCheckbox: (name: string) =>
        name === "choices"
          ? {
              getValue: () => "Second",
              getWidgets: () => [unselectedWidget, selectedWidget],
            }
          : undefined,
      getRadioGroup: () => undefined,
    };

    // Mock only the PDF document surface exercised by fillPdf.
    mocks.load.mockResolvedValue({
      setTitle: vi.fn(),
      setAuthor: vi.fn(),
      getForm: () => form,
      getPages: () => [
        {
          ref: pageRef,
          drawText: mocks.drawText,
        },
      ],
      save: vi.fn().mockResolvedValue(new Uint8Array()),
    });

    const pdf: PDFDefinition = {
      id: "lic100-drivers-license-learners-permit-or-id-card",
      title: "Test Form",
      canonicalUrl: "https://example.com",
      pdfPath: "test.pdf",
      drawFormControlValues: true,
      resolver: () => ({
        choices: "Second",
        listbox: ["First", "Second"],
      }),
    };

    await fillPdf({ pdf, userData: {} });

    expect(mocks.fill).toHaveBeenCalledWith({
      choices: "Second",
      listbox: ["First", "Second"],
    });
    expect(mocks.drawText).toHaveBeenCalledOnce();
    expect(mocks.drawText).toHaveBeenCalledWith(
      "X",
      expect.objectContaining({ x: 30.72, y: 10.18 }),
    );
  });

  it("passes string arrays through as list-box values without drawing marks", async () => {
    const form = {
      fill: mocks.fill,
      getCheckbox: () => undefined,
      getRadioGroup: () => undefined,
    };

    // List boxes retain their native appearance and do not need an X mark.
    mocks.load.mockResolvedValue({
      setTitle: vi.fn(),
      setAuthor: vi.fn(),
      getForm: () => form,
      getPages: () => [],
      save: vi.fn().mockResolvedValue(new Uint8Array()),
    });

    const pdf: PDFDefinition = {
      id: "lic100-drivers-license-learners-permit-or-id-card",
      title: "Test Form",
      canonicalUrl: "https://example.com",
      pdfPath: "test.pdf",
      drawFormControlValues: true,
      resolver: () => ({ listbox: ["First", "Second"] }),
    };

    await fillPdf({ pdf, userData: {} });

    expect(mocks.fill).toHaveBeenCalledWith({
      listbox: ["First", "Second"],
    });
    expect(mocks.drawText).not.toHaveBeenCalled();
  });
});
