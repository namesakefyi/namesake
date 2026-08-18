import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { downloadBlankPdfs } from "../downloadBlankPdfs";
import { fetchPdf } from "../fetchPdf";
import { mergePdfsWithCoverPage } from "../mergePdfsWithCoverPage";
import { testPdfDefinition } from "./helpers";

vi.mock("../mergePdfsWithCoverPage", () => ({
  mergePdfsWithCoverPage: vi.fn(),
}));
vi.mock("../fetchPdf", () => ({ fetchPdf: vi.fn() }));

describe("downloadBlankPdfs", () => {
  beforeEach(() => {
    vi.mocked(mergePdfsWithCoverPage).mockResolvedValue(undefined);
    vi.mocked(fetchPdf).mockResolvedValue(new Uint8Array([1, 2, 3]).buffer);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("delegates to mergePdfsWithCoverPage with the title, instructions, and pdfs", async () => {
    await downloadBlankPdfs({
      title: "Test Packet",
      instructions: ["First instruction"],
      pdfs: [testPdfDefinition],
    });

    expect(mergePdfsWithCoverPage).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Test Packet",
        instructions: ["First instruction"],
        pdfs: [testPdfDefinition],
      }),
    );
  });

  it("fetches each PDF's raw bytes (no fill step) as the getPdfBytes callback", async () => {
    await downloadBlankPdfs({
      title: "Test Packet",
      instructions: [],
      pdfs: [testPdfDefinition],
    });

    const { getPdfBytes } = vi.mocked(mergePdfsWithCoverPage).mock.calls[0][0];
    const bytes = await getPdfBytes(testPdfDefinition);

    expect(fetchPdf).toHaveBeenCalledWith(testPdfDefinition.pdfPath);
    expect(bytes).toBeInstanceOf(Uint8Array);
  });
});
