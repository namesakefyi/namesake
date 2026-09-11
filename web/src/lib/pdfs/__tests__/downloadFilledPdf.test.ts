import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildPdfPacket } from "../buildPdfPacket";
import { downloadFilledPdf } from "../downloadFilledPdf";
import { downloadPdf } from "../downloadPdf";
import { fillPdf } from "../fillPdf";
import { secondTestPdfDefinition, testPdfDefinition } from "./helpers";

vi.mock("../buildPdfPacket", () => ({ buildPdfPacket: vi.fn() }));
vi.mock("../downloadPdf", () => ({ downloadPdf: vi.fn() }));
vi.mock("../fillPdf", () => ({ fillPdf: vi.fn() }));

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
      pdfs: [testPdfDefinition, secondTestPdfDefinition],
      userData,
    });

    expect(fillPdf).toHaveBeenCalledWith({ pdf: testPdfDefinition, userData });
    expect(fillPdf).toHaveBeenCalledWith({
      pdf: secondTestPdfDefinition,
      userData,
    });
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
      pdfs: [testPdfDefinition, secondTestPdfDefinition],
      userData: {},
    });

    expect(buildPdfPacket).toHaveBeenCalledWith({
      title: "Multi-PDF Packet",
      instructions: ["Step 1"],
      pdfs: [testPdfDefinition, secondTestPdfDefinition],
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

  it("propagates a rejection from downloadPdf instead of swallowing it", async () => {
    vi.mocked(fillPdf).mockResolvedValue(new Uint8Array());
    vi.mocked(downloadPdf).mockRejectedValue(new Error("download failed"));

    await expect(
      downloadFilledPdf({
        title: "Test Packet",
        instructions: [],
        pdfs: [testPdfDefinition],
        userData: {},
      }),
    ).rejects.toThrow("download failed");
  });
});
