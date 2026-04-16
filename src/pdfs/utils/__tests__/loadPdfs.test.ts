import { beforeEach, describe, expect, it, vi } from "vitest";
import { loadPdfs } from "../loadPdfs";

vi.mock("../..", () => ({
  getPdfDefinition: vi.fn(),
}));

import { getPdfDefinition } from "../..";

describe("loadPdfs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should load PDFs for all included pdfIds", async () => {
    const mockPdf1 = {
      id: "test-form-1" as any,
      title: "Test Form 1",
      jurisdiction: "MA",
      pdfPath: "public/forms/test-form-1.pdf",
      fields: () => ({}),
    };

    const mockPdf2 = {
      id: "test-form-2" as any,
      title: "Test Form 2",
      jurisdiction: "MA",
      pdfPath: "public/forms/test-form-2.pdf",
      fields: () => ({}),
    };

    (getPdfDefinition as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce(mockPdf1)
      .mockResolvedValueOnce(mockPdf2);

    const result = await loadPdfs([
      { pdfId: "test-form-1" as any },
      { pdfId: "test-form-2" as any },
    ]);

    expect(result).toEqual([mockPdf1, mockPdf2]);
    expect(getPdfDefinition).toHaveBeenCalledTimes(2);
    expect(getPdfDefinition).toHaveBeenCalledWith("test-form-1");
    expect(getPdfDefinition).toHaveBeenCalledWith("test-form-2");
  });

  it("should exclude PDFs when include is false", async () => {
    const mockPdf = {
      id: "test-form-1" as any,
      title: "Test Form 1",
      jurisdiction: "MA",
      pdfPath: "public/forms/test-form-1.pdf",
      fields: () => ({}),
    };

    (getPdfDefinition as ReturnType<typeof vi.fn>).mockResolvedValue(mockPdf);

    const result = await loadPdfs([
      { pdfId: "test-form-1" as any, include: true },
      { pdfId: "test-form-2" as any, include: false },
      { pdfId: "test-form-3" as any }, // defaults to true
    ]);

    expect(result).toHaveLength(2);
    expect(getPdfDefinition).toHaveBeenCalledTimes(2);
    expect(getPdfDefinition).toHaveBeenCalledWith("test-form-1");
    expect(getPdfDefinition).toHaveBeenCalledWith("test-form-3");
    expect(getPdfDefinition).not.toHaveBeenCalledWith("test-form-2");
  });

  it("should return empty array when all PDFs are excluded", async () => {
    const result = await loadPdfs([
      { pdfId: "test-form-1" as any, include: false },
      { pdfId: "test-form-2" as any, include: false },
    ]);

    expect(result).toEqual([]);
    expect(getPdfDefinition).not.toHaveBeenCalled();
  });

  it("should handle empty input array", async () => {
    const result = await loadPdfs([]);

    expect(result).toEqual([]);
    expect(getPdfDefinition).not.toHaveBeenCalled();
  });

  it("should handle getPdfDefinition errors", async () => {
    (getPdfDefinition as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("PDF not found"),
    );

    await expect(
      loadPdfs([{ pdfId: "nonexistent-form" as any }]),
    ).rejects.toThrow("PDF not found");

    expect(getPdfDefinition).toHaveBeenCalledWith("nonexistent-form");
  });
});
