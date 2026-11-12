import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildPdfPacket } from "../buildPdfPacket";
import { downloadPdfPacket } from "../downloadPdfPacket";
import { fetchPdf } from "../fetchPdf";
import { fillPdf } from "../fillPdf";
import {
  secondTestFormPdf,
  secondTestPdf,
  testFormPdf,
  testPdf,
} from "./helpers";

vi.mock("../buildPdfPacket", () => ({ buildPdfPacket: vi.fn() }));
vi.mock("../fetchPdf", () => ({ fetchPdf: vi.fn() }));
vi.mock("../fillPdf", () => ({ fillPdf: vi.fn() }));

const packetBytes = new Uint8Array([9, 9, 9]);

describe("downloadPdfPacket", () => {
  const { createObjectURL, revokeObjectURL } = URL;
  let link: { href: string; download: string; click: () => void };

  beforeEach(() => {
    vi.mocked(buildPdfPacket).mockResolvedValue(packetBytes);
    URL.createObjectURL = vi.fn().mockReturnValue("blob:packet");
    URL.revokeObjectURL = vi.fn();
    link = { href: "", download: "", click: vi.fn() };
    vi.spyOn(document, "createElement").mockReturnValue(
      link as unknown as HTMLAnchorElement,
    );
  });

  afterEach(() => {
    URL.createObjectURL = createObjectURL;
    URL.revokeObjectURL = revokeObjectURL;
    vi.mocked(document.createElement).mockRestore();
    vi.useRealTimers();
  });

  it("fills each PDF with the given data", async () => {
    vi.mocked(fillPdf).mockResolvedValue(new Uint8Array());

    await downloadPdfPacket({
      title: "Test Packet",
      instructions: [],
      pdfs: [testFormPdf, secondTestFormPdf],
      data: { newFirstName: "Jamie" },
    });

    expect(fillPdf).toHaveBeenCalledWith(testPdf, {
      newFirstName: "Jamie",
      oldFirstName: undefined,
      shouldReturnOriginalDocuments: undefined,
    });
    expect(fillPdf).toHaveBeenCalledWith(secondTestPdf, { field1: "Jamie" });
    expect(fetchPdf).not.toHaveBeenCalled();
  });

  it("fetches each PDF unfilled when there's no data", async () => {
    vi.mocked(fetchPdf).mockResolvedValue(new Uint8Array([1, 2, 3]).buffer);

    await downloadPdfPacket({
      title: "Test Packet",
      instructions: [],
      pdfs: [testFormPdf, secondTestFormPdf],
    });

    expect(fetchPdf).toHaveBeenCalledWith(testPdf.file);
    expect(fetchPdf).toHaveBeenCalledWith(secondTestPdf.file);
    expect(fillPdf).not.toHaveBeenCalled();
  });

  it("builds the packet from each PDF and its bytes, in order", async () => {
    const firstBytes = new Uint8Array([1]);
    const secondBytes = new Uint8Array([2]);
    vi.mocked(fillPdf)
      .mockResolvedValueOnce(firstBytes)
      .mockResolvedValueOnce(secondBytes);

    await downloadPdfPacket({
      title: "Multi-PDF Packet",
      instructions: ["Step 1"],
      pdfs: [testFormPdf, secondTestFormPdf],
      data: {},
    });

    expect(buildPdfPacket).toHaveBeenCalledWith({
      title: "Multi-PDF Packet",
      instructions: ["Step 1"],
      documents: [
        { pdf: testPdf, bytes: firstBytes },
        { pdf: secondTestPdf, bytes: secondBytes },
      ],
    });
  });

  it("downloads the built packet under the given title", async () => {
    vi.mocked(fillPdf).mockResolvedValue(new Uint8Array());

    await downloadPdfPacket({
      title: "Test Packet",
      instructions: [],
      pdfs: [testFormPdf],
      data: {},
    });

    expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(link.href).toBe("blob:packet");
    expect(link.download).toBe("Test Packet.pdf");
    expect(link.click).toHaveBeenCalled();
  });

  it("frees the packet's URL once the download has had time to start", async () => {
    vi.useFakeTimers();
    vi.mocked(fillPdf).mockResolvedValue(new Uint8Array());

    await downloadPdfPacket({
      title: "Test Packet",
      instructions: [],
      pdfs: [testFormPdf],
      data: {},
    });

    expect(URL.revokeObjectURL).not.toHaveBeenCalled();
    vi.runAllTimers();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:packet");
  });

  it("propagates a rejection from building the packet", async () => {
    vi.mocked(fillPdf).mockResolvedValue(new Uint8Array());
    vi.mocked(buildPdfPacket).mockRejectedValue(new Error("build failed"));

    await expect(
      downloadPdfPacket({
        title: "Test Packet",
        instructions: [],
        pdfs: [testFormPdf],
        data: {},
      }),
    ).rejects.toThrow("build failed");
  });
});
