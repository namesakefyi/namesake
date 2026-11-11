import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildPdfPacket } from "../buildPdfPacket";
import { downloadFilledPdf } from "../downloadFilledPdf";
import { downloadPdf } from "../downloadPdf";
import { fillPdf } from "../fillPdf";
import {
  secondTestFormPdf,
  secondTestPdf,
  testFormPdf,
  testPdf,
} from "./helpers";

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
      pdfs: [testFormPdf, secondTestFormPdf],
      userData,
    });

    expect(fillPdf).toHaveBeenCalledWith(testPdf, {
      newFirstName: "Jamie",
      oldFirstName: undefined,
      shouldReturnOriginalDocuments: undefined,
    });
    expect(fillPdf).toHaveBeenCalledWith(secondTestPdf, { field1: "Jamie" });
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
      pdfs: [testFormPdf, secondTestFormPdf],
      userData: {},
    });

    expect(buildPdfPacket).toHaveBeenCalledWith({
      title: "Multi-PDF Packet",
      instructions: ["Step 1"],
      pdfs: [testPdf, secondTestPdf],
      pdfBytes: [firstBytes, secondBytes],
    });
  });

  it("downloads the packet returned by buildPdfPacket, under the given title", async () => {
    vi.mocked(fillPdf).mockResolvedValue(new Uint8Array());

    await downloadFilledPdf({
      title: "Test Packet",
      instructions: [],
      pdfs: [testFormPdf],
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
        pdfs: [testFormPdf],
        userData: {},
      }),
    ).rejects.toThrow("download failed");
  });
});
