import { beforeEach, describe, expect, it, vi } from "vitest";
import type { FormDownload } from "#constants/forms";
import { secondTestFormPdf, testFormPdf } from "#lib/pdfs/__tests__/helpers";
import { downloadPdfPacket } from "#lib/pdfs/downloadPdfPacket";
import { downloadFormPacket } from "../downloadFormPacket";
import { loadFormDownload } from "../loadForm";
import { makeStep } from "./testHelpers";

vi.mock("../loadForm", () => ({ loadFormDownload: vi.fn() }));
vi.mock("#lib/pdfs/downloadPdfPacket", () => ({
  downloadPdfPacket: vi.fn(),
}));

const conditionalPdf = { ...secondTestFormPdf, when: () => false };

const download: FormDownload = {
  title: "Court Order MA",
  instructions: [
    "Always",
    { text: "Has old name", when: (data) => !!data.oldFirstName },
  ],
  pdfs: [testFormPdf, conditionalPdf],
};

describe("downloadFormPacket", () => {
  beforeEach(() => {
    vi.mocked(loadFormDownload).mockResolvedValue(download);
    vi.mocked(downloadPdfPacket).mockResolvedValue(undefined);
  });

  it("downloads every PDF blank when there are no answers", async () => {
    await downloadFormPacket("ma/court-order");

    expect(loadFormDownload).toHaveBeenCalledWith("ma/court-order");
    expect(downloadPdfPacket).toHaveBeenCalledWith({
      title: "Court Order MA",
      instructions: ["Always"],
      pdfs: [testFormPdf, conditionalPdf],
      data: undefined,
    });
  });

  it("fills the included PDFs with the visible answers", async () => {
    const steps = [
      makeStep("a", ["oldFirstName"]),
      makeStep("b", ["phoneNumber"], () => false),
    ];

    await downloadFormPacket("ma/court-order", {
      steps,
      data: { oldFirstName: "Jane", phoneNumber: "555" },
    });

    expect(downloadPdfPacket).toHaveBeenCalledWith({
      title: "Court Order MA",
      instructions: ["Always", "Has old name"],
      pdfs: [testFormPdf],
      data: { oldFirstName: "Jane" },
    });
  });
});
