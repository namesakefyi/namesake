import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { FormConfig, FormDownload } from "#constants/forms";
import {
  secondTestFormPdf,
  secondTestPdf,
  testFormPdf,
  testPdf,
} from "#lib/pdfs/__tests__/helpers";
import { downloadBlankPdfs } from "#lib/pdfs/downloadBlankPdfs";
import { downloadBlankPdfPacket } from "../downloadBlankPdfPacket";

vi.mock("../../pdfs/downloadBlankPdfs", () => ({
  downloadBlankPdfs: vi.fn(),
}));

function makeConfig(download: Partial<FormDownload> = {}): FormConfig {
  return {
    title: "Test",
    category: "court-order",
    steps: [],
    download: {
      title: "Court Order MA",
      instructions: ["Step 1", "Step 2"],
      pdfs: [testFormPdf, { ...secondTestFormPdf, when: () => false }],
      ...download,
    },
  };
}

describe("downloadBlankPdfPacket", () => {
  beforeEach(() => {
    vi.mocked(downloadBlankPdfs).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("includes every PDF, ignoring conditional `when` predicates", async () => {
    await downloadBlankPdfPacket(makeConfig());

    expect(downloadBlankPdfs).toHaveBeenCalledWith(
      expect.objectContaining({ pdfs: [testPdf, secondTestPdf] }),
    );
  });

  it("resolves instructions against empty form data", async () => {
    const config = makeConfig({
      instructions: [
        "Always",
        { text: "Depends on data", when: (data) => !!data.oldFirstName },
      ],
    });

    await downloadBlankPdfPacket(config);

    expect(downloadBlankPdfs).toHaveBeenCalledWith(
      expect.objectContaining({ instructions: ["Always"] }),
    );
  });

  it("passes the download title to downloadBlankPdfs", async () => {
    await downloadBlankPdfPacket(makeConfig({ title: "My Package" }));

    expect(downloadBlankPdfs).toHaveBeenCalledWith({
      title: "My Package",
      instructions: ["Step 1", "Step 2"],
      pdfs: [testPdf, secondTestPdf],
    });
  });
});
