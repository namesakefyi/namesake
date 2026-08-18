import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildPdfPacket } from "../buildPdfPacket";
import { definePdf } from "../definePdf";
import { downloadFilledPdf } from "../downloadFilledPdf";
import { downloadPdf } from "../downloadPdf";
import { fillPdf } from "../fillPdf";
import { testPdfDefinition } from "./helpers";

vi.mock("../buildPdfPacket", () => ({ buildPdfPacket: vi.fn() }));
vi.mock("../downloadPdf", () => ({ downloadPdf: vi.fn() }));
vi.mock("../fillPdf", () => ({ fillPdf: vi.fn() }));

const secondPdf = definePdf({
  id: "test-form-2" as any,
  title: "Test Form 2",
  jurisdiction: "ma",
  canonicalUrl: "https://example.com",
  pdfPath: "public/forms/test-form-2.pdf",
  resolver: (data) => ({ field1: data.newFirstName }),
});

const packetBytes = new Uint8Array([9, 9, 9]);

describe("downloadFilledPdf", () => {
  beforeEach(() => {
    vi.mocked(buildPdfPacket).mockResolvedValue(packetBytes);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("fills each PDF with the given user data", async () => {
    const userData = { newFirstName: "Jamie" };
    vi.mocked(fillPdf).mockResolvedValue(new Uint8Array());

    await downloadFilledPdf({
      title: "Test Packet",
      instructions: [],
      pdfs: [testPdfDefinition, secondPdf],
      userData,
    });

    expect(fillPdf).toHaveBeenCalledWith({ pdf: testPdfDefinition, userData });
    expect(fillPdf).toHaveBeenCalledWith({ pdf: secondPdf, userData });
  });

  it("builds the packet with each PDF's filled bytes, in order", async () => {
    const firstBytes = new Uint8Array([1]);
    const secondBytes = new Uint8Array([2]);
    vi.mocked(fillPdf)
      .mockResolvedValueOnce(firstBytes)
      .mockResolvedValueOnce(secondBytes);

    await downloadFilledPdf({
      title: "Multi-PDF Packet",
      instructions: ["Step 1"],
      pdfs: [testPdfDefinition, secondPdf],
      userData: {},
    });

    expect(buildPdfPacket).toHaveBeenCalledWith({
      title: "Multi-PDF Packet",
      instructions: ["Step 1"],
      pdfs: [testPdfDefinition, secondPdf],
      pdfBytes: [firstBytes, secondBytes],
    });
  });

  it("downloads the packet returned by buildPdfPacket, under the given title", async () => {
    vi.mocked(fillPdf).mockResolvedValue(new Uint8Array());

    await downloadFilledPdf({
      title: "Test Packet",
      instructions: [],
      pdfs: [testPdfDefinition],
      userData: {},
    });

    expect(downloadPdf).toHaveBeenCalledWith({
      pdfBytes: packetBytes,
      title: "Test Packet",
    });
  });
});
