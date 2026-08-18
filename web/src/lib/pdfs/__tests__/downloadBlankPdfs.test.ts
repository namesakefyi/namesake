import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildPdfPacket } from "../buildPdfPacket";
import { downloadBlankPdfs } from "../downloadBlankPdfs";
import { downloadPdf } from "../downloadPdf";
import { fetchPdf } from "../fetchPdf";
import { secondTestPdfDefinition, testPdfDefinition } from "./helpers";

vi.mock("../buildPdfPacket", () => ({ buildPdfPacket: vi.fn() }));
vi.mock("../downloadPdf", () => ({ downloadPdf: vi.fn() }));
vi.mock("../fetchPdf", () => ({ fetchPdf: vi.fn() }));

const packetBytes = new Uint8Array([9, 9, 9]);

describe("downloadBlankPdfs", () => {
  beforeEach(() => {
    vi.mocked(buildPdfPacket).mockResolvedValue(packetBytes);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("fetches each PDF's raw bytes, unfilled", async () => {
    vi.mocked(fetchPdf).mockResolvedValue(new Uint8Array([1, 2, 3]).buffer);

    await downloadBlankPdfs({
      title: "Test Packet",
      instructions: [],
      pdfs: [testPdfDefinition, secondTestPdfDefinition],
    });

    expect(fetchPdf).toHaveBeenCalledWith(testPdfDefinition.pdfPath);
    expect(fetchPdf).toHaveBeenCalledWith(secondTestPdfDefinition.pdfPath);
  });

  it("builds the packet with each PDF's fetched bytes, in order", async () => {
    vi.mocked(fetchPdf)
      .mockResolvedValueOnce(new Uint8Array([1]).buffer)
      .mockResolvedValueOnce(new Uint8Array([2]).buffer);

    await downloadBlankPdfs({
      title: "Multi-PDF Packet",
      instructions: ["Step 1"],
      pdfs: [testPdfDefinition, secondTestPdfDefinition],
    });

    expect(buildPdfPacket).toHaveBeenCalledWith({
      title: "Multi-PDF Packet",
      instructions: ["Step 1"],
      pdfs: [testPdfDefinition, secondTestPdfDefinition],
      pdfBytes: [new Uint8Array([1]), new Uint8Array([2])],
    });
  });

  it("downloads the packet returned by buildPdfPacket, under the given title", async () => {
    vi.mocked(fetchPdf).mockResolvedValue(new Uint8Array([1, 2, 3]).buffer);

    await downloadBlankPdfs({
      title: "Test Packet",
      instructions: [],
      pdfs: [testPdfDefinition],
    });

    expect(downloadPdf).toHaveBeenCalledWith({
      pdfBytes: packetBytes,
      title: "Test Packet",
    });
  });

  it("propagates a rejection from downloadPdf instead of swallowing it", async () => {
    vi.mocked(fetchPdf).mockResolvedValue(new Uint8Array([1, 2, 3]).buffer);
    vi.mocked(downloadPdf).mockRejectedValue(new Error("download failed"));

    await expect(
      downloadBlankPdfs({
        title: "Test Packet",
        instructions: [],
        pdfs: [testPdfDefinition],
      }),
    ).rejects.toThrow("download failed");
  });
});
