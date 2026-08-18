import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildPdfPacket } from "../buildPdfPacket";
import { definePdf } from "../definePdf";
import { downloadBlankPdfs } from "../downloadBlankPdfs";
import { downloadPdf } from "../downloadPdf";
import { fetchPdf } from "../fetchPdf";
import { testPdfDefinition } from "./helpers";

vi.mock("../buildPdfPacket", () => ({ buildPdfPacket: vi.fn() }));
vi.mock("../downloadPdf", () => ({ downloadPdf: vi.fn() }));
vi.mock("../fetchPdf", () => ({ fetchPdf: vi.fn() }));

const secondPdf = definePdf({
  id: "test-form-2" as any,
  title: "Test Form 2",
  jurisdiction: "ma",
  canonicalUrl: "https://example.com",
  pdfPath: "public/forms/test-form-2.pdf",
  resolver: (data) => ({ field1: data.newFirstName }),
});

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
      pdfs: [testPdfDefinition, secondPdf],
    });

    expect(fetchPdf).toHaveBeenCalledWith(testPdfDefinition.pdfPath);
    expect(fetchPdf).toHaveBeenCalledWith(secondPdf.pdfPath);
  });

  it("builds the packet with each PDF's fetched bytes, in order", async () => {
    vi.mocked(fetchPdf)
      .mockResolvedValueOnce(new Uint8Array([1]).buffer)
      .mockResolvedValueOnce(new Uint8Array([2]).buffer);

    await downloadBlankPdfs({
      title: "Multi-PDF Packet",
      instructions: ["Step 1"],
      pdfs: [testPdfDefinition, secondPdf],
    });

    expect(buildPdfPacket).toHaveBeenCalledWith({
      title: "Multi-PDF Packet",
      instructions: ["Step 1"],
      pdfs: [testPdfDefinition, secondPdf],
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
});
