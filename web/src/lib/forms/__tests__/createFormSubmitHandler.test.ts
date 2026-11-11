import type { SubmitEvent } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { FormConfig, FormDownload } from "#constants/forms";
import { testFormPdf } from "#lib/pdfs/__tests__/helpers";
import { downloadPdfPacket } from "#lib/pdfs/downloadPdfPacket";
import { createFormSubmitHandler } from "../createFormSubmitHandler";
import { resolveFormVisibility } from "../formVisibility";

vi.mock("../formVisibility", () => ({
  resolveFormVisibility: vi.fn(),
}));
vi.mock("../../pdfs/downloadPdfPacket", () => ({
  downloadPdfPacket: vi.fn(),
}));

const mockFormData = { oldFirstName: "Jane" };
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

function makeConfig(download: Partial<FormDownload> = {}): FormConfig {
  return {
    title: "Test",
    category: "court-order",
    steps: [],
    download: {
      title: "Court Order MA",
      instructions: ["Step 1", "Step 2"],
      pdfs: [testFormPdf],
      ...download,
    },
  };
}

function partsOf({ steps, download }: FormConfig) {
  return { steps, loadDownload: async () => download };
}

describe("createFormSubmitHandler", () => {
  beforeEach(() => {
    vi.mocked(resolveFormVisibility).mockReturnValue({
      visibleStepIds: [],
      visibleFields: mockVisibleData,
      sections: [],
      includedPdfs: [testFormPdf],
    });
    vi.mocked(downloadPdfPacket).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("prevents the default form submission", async () => {
    const event = makeEvent();
    const handler = createFormSubmitHandler(partsOf(makeConfig()), makeForm());

    await handler(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it("calls resolveFormVisibility with steps, formData, and pdfs", async () => {
    const config = makeConfig();

    await createFormSubmitHandler(partsOf(config), makeForm())(makeEvent());

    expect(resolveFormVisibility).toHaveBeenCalledWith(
      config.steps,
      mockFormData,
      config.download.pdfs,
    );
  });

  it("resolves instructions against the submitted form data", async () => {
    const config = makeConfig({
      instructions: [
        "Always",
        { text: "Depends on data", when: (data) => !!data.oldFirstName },
      ],
    });

    await createFormSubmitHandler(partsOf(config), makeForm())(makeEvent());

    expect(downloadPdfPacket).toHaveBeenCalledWith(
      expect.objectContaining({ instructions: ["Always", "Depends on data"] }),
    );
  });

  it("downloads the included PDFs, filled with the visible data", async () => {
    const config = makeConfig({ title: "My Package" });

    await createFormSubmitHandler(partsOf(config), makeForm())(makeEvent());

    expect(downloadPdfPacket).toHaveBeenCalledWith({
      title: "My Package",
      instructions: ["Step 1", "Step 2"],
      pdfs: [testFormPdf],
      data: mockVisibleData,
    });
  });
});
