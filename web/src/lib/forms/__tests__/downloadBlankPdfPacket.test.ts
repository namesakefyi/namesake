import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { FormConfig, FormDownload } from "#constants/forms";
import { secondTestFormPdf, testFormPdf } from "#lib/pdfs/__tests__/helpers";
import { downloadPdfPacket } from "#lib/pdfs/downloadPdfPacket";
import { downloadBlankPdfPacket } from "../downloadBlankPdfPacket";

vi.mock("../../pdfs/downloadPdfPacket", () => ({
  downloadPdfPacket: vi.fn(),
}));

const conditionalPdf = { ...secondTestFormPdf, when: () => false };

function makeConfig(download: Partial<FormDownload> = {}): FormConfig {
  return {
    title: "Test",
    category: "court-order",
    steps: [],
    download: {
      title: "Court Order MA",
      instructions: ["Step 1", "Step 2"],
      pdfs: [testFormPdf, conditionalPdf],
      ...download,
    },
  };
}

describe("downloadBlankPdfPacket", () => {
  beforeEach(() => {
    vi.mocked(downloadPdfPacket).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("includes every PDF, ignoring conditional `when` predicates", async () => {
    await downloadBlankPdfPacket(async () => makeConfig().download);

    expect(downloadPdfPacket).toHaveBeenCalledWith(
      expect.objectContaining({ pdfs: [testFormPdf, conditionalPdf] }),
    );
  });

  it("resolves instructions against empty form data", async () => {
    const config = makeConfig({
      instructions: [
        "Always",
        { text: "Depends on data", when: (data) => !!data.oldFirstName },
      ],
    });

    await downloadBlankPdfPacket(async () => config.download);

    expect(downloadPdfPacket).toHaveBeenCalledWith(
      expect.objectContaining({ instructions: ["Always"] }),
    );
  });

  it("passes the download title to downloadPdfPacket", async () => {
    await downloadBlankPdfPacket(
      async () => makeConfig({ title: "My Package" }).download,
    );

    expect(downloadPdfPacket).toHaveBeenCalledWith({
      title: "My Package",
      instructions: ["Step 1", "Step 2"],
      pdfs: [testFormPdf, conditionalPdf],
    });
  });
});
