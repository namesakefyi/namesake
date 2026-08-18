import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { FormConfig } from "#constants/forms";
import { downloadBlankPdfs } from "#lib/pdfs/downloadBlankPdfs";
import { loadPdfs } from "#lib/pdfs/loadPdfs";
import { downloadBlankPdfPacket } from "../downloadBlankPdfPacket";

vi.mock("../../pdfs/downloadBlankPdfs", () => ({
  downloadBlankPdfs: vi.fn(),
}));
vi.mock("../../pdfs/loadPdfs", () => ({ loadPdfs: vi.fn() }));

const mockPdfs = [{ id: "cjp27-petition-to-change-name-of-adult" }];

function makeConfig(overrides: Partial<FormConfig> = {}): FormConfig {
  return {
    slug: "court-order-ma",
    steps: [{ fields: ["oldFirstName"] }],
    pdfs: [
      { pdfId: "cjp27-petition-to-change-name-of-adult" },
      { pdfId: "affidavit-of-indigency", when: () => false },
    ],
    downloadTitle: "Court Order MA",
    instructions: ["Step 1", "Step 2"],
    ...overrides,
  } as unknown as FormConfig;
}

describe("downloadBlankPdfPacket", () => {
  beforeEach(() => {
    vi.mocked(loadPdfs).mockResolvedValue(mockPdfs as never);
    vi.mocked(downloadBlankPdfs).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("calls loadPdfs with every PDF id, ignoring conditional `when` predicates", async () => {
    const config = makeConfig();

    await downloadBlankPdfPacket(config);

    expect(loadPdfs).toHaveBeenCalledWith([
      { pdfId: "cjp27-petition-to-change-name-of-adult" },
      { pdfId: "affidavit-of-indigency" },
    ]);
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

  it("passes the download title and loaded PDFs to downloadBlankPdfs", async () => {
    const config = makeConfig({ downloadTitle: "My Package" });

    await downloadBlankPdfPacket(config);

    expect(downloadBlankPdfs).toHaveBeenCalledWith({
      title: "My Package",
      instructions: ["Step 1", "Step 2"],
      pdfs: mockPdfs,
    });
  });
});
