import type { SubmitEvent } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { FormConfig } from "#constants/forms";
import type { PDFId } from "#constants/pdf";
import { downloadFilledPdf } from "#lib/pdfs/downloadFilledPdf";
import { loadPdfs } from "#lib/pdfs/loadPdfs";
import { createFormSubmitHandler } from "../createFormSubmitHandler";
import { resolveFormVisibility } from "../formVisibility";

vi.mock("../formVisibility", () => ({
  resolveFormVisibility: vi.fn(),
}));
vi.mock("../../pdfs/downloadFilledPdf", () => ({
  downloadFilledPdf: vi.fn(),
}));
vi.mock("../../pdfs/loadPdfs", () => ({ loadPdfs: vi.fn() }));

const mockFormData = { oldFirstName: "Jane" } as unknown as FormData;
const mockPdfs = [{ id: "cjp27-petition-to-change-name-of-adult" }];
const mockVisibleData = { oldFirstName: "Jane" };

function makeForm(data = mockFormData) {
  return {
    getValues: vi.fn().mockReturnValue(data),
  } as unknown as UseFormReturn<FieldValues>;
}

function makeEvent() {
  return {
    preventDefault: vi.fn(),
  } as unknown as SubmitEvent<HTMLFormElement>;
}

function makeConfig(overrides: Partial<FormConfig> = {}): FormConfig {
  return {
    slug: "court-order-ma",
    steps: [{ fields: ["oldFirstName"] }],
    pdfs: [{ pdfId: "cjp27-petition-to-change-name-of-adult" }],
    downloadTitle: "Court Order MA",
    instructions: ["Step 1", "Step 2"],
    ...overrides,
  } as unknown as FormConfig;
}

describe("createFormSubmitHandler", () => {
  beforeEach(() => {
    vi.mocked(loadPdfs).mockResolvedValue(mockPdfs as never);
    vi.mocked(resolveFormVisibility).mockReturnValue({
      visibleStepIds: [],
      visibleFields: mockVisibleData,
      sections: [],
      pdfsToInclude: [
        { pdfId: "cjp27-petition-to-change-name-of-adult", include: true },
      ],
    });
    vi.mocked(downloadFilledPdf).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("prevents the default form submission", async () => {
    const event = makeEvent();
    const handler = createFormSubmitHandler(makeConfig(), makeForm());

    await handler(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it("calls resolveFormVisibility with steps, formData, and pdfs", async () => {
    const config = makeConfig();

    await createFormSubmitHandler(config, makeForm())(makeEvent());

    expect(resolveFormVisibility).toHaveBeenCalledWith(
      config.steps,
      mockFormData,
      config.pdfs,
    );
  });

  it("passes pdfsToInclude to loadPdfs", async () => {
    const pdfsToInclude: { pdfId: PDFId; include: boolean }[] = [
      { pdfId: "cjp27-petition-to-change-name-of-adult", include: true },
      { pdfId: "affidavit-of-indigency", include: false },
    ];
    vi.mocked(resolveFormVisibility).mockReturnValue({
      visibleStepIds: [],
      visibleFields: mockVisibleData,
      sections: [],
      pdfsToInclude,
    });

    await createFormSubmitHandler(makeConfig(), makeForm())(makeEvent());

    expect(loadPdfs).toHaveBeenCalledWith(pdfsToInclude);
  });

  it("resolves instructions against the submitted form data", async () => {
    const config = makeConfig({
      instructions: [
        "Always",
        { text: "Depends on data", when: (data) => !!data.oldFirstName },
      ],
    });

    await createFormSubmitHandler(config, makeForm())(makeEvent());

    expect(downloadFilledPdf).toHaveBeenCalledWith(
      expect.objectContaining({ instructions: ["Always", "Depends on data"] }),
    );
  });

  it("passes the download title, loaded PDFs, and visible data to downloadFilledPdf", async () => {
    const config = makeConfig({ downloadTitle: "My Package" });

    await createFormSubmitHandler(config, makeForm())(makeEvent());

    expect(downloadFilledPdf).toHaveBeenCalledWith({
      title: "My Package",
      instructions: ["Step 1", "Step 2"],
      pdfs: mockPdfs,
      userData: mockVisibleData,
    });
  });
});
