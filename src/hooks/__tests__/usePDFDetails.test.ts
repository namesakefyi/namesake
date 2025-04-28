import type { PDFDefinition, PDFId } from "@/constants/forms";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePDFDetails } from "../usePDFDetails";

// Mock getPdfDefinition from @/forms
vi.mock("@/forms", () => ({
  getPdfDefinition: vi.fn(),
}));

import { getPdfDefinition } from "@/forms";

const mockPDF: PDFDefinition = {
  id: "cjp27-petition-to-change-name-of-adult",
  title: "Petition to Change Name of Adult",
  code: "CJP 27",
  jurisdiction: "MA",
  pdfPath: "/forms/cjp27-petition-to-change-name-of-adult.pdf",
  fields: () => ({}),
};

describe("usePDFDetails", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null and no errors initially", () => {
    (getPdfDefinition as ReturnType<typeof vi.fn>).mockResolvedValue(mockPDF);
    const { result } = renderHook(() =>
      usePDFDetails("cjp27-petition-to-change-name-of-adult" as PDFId),
    );
    expect(result.current.data).toBeNull();
    expect(result.current.errors).toEqual([]);
  });

  it("fetches and returns PDF details for a single PDFId", async () => {
    (getPdfDefinition as ReturnType<typeof vi.fn>).mockResolvedValue(mockPDF);
    const { result } = renderHook(() =>
      usePDFDetails("cjp27-petition-to-change-name-of-adult" as PDFId),
    );
    await waitFor(() => {
      expect(result.current.data).toEqual(mockPDF);
      expect(result.current.errors).toEqual([]);
    });
    expect(getPdfDefinition).toHaveBeenCalledWith(
      "cjp27-petition-to-change-name-of-adult",
    );
  });

  it("returns null and error if getPdfDefinition throws", async () => {
    (getPdfDefinition as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Not found"),
    );
    const { result } = renderHook(() =>
      usePDFDetails("cjp27-petition-to-change-name-of-adult" as PDFId),
    );
    await waitFor(() => {
      expect(result.current.data).toBeNull();
      expect(result.current.errors.length).toBe(1);
      expect(result.current.errors[0].message).toBe("Not found");
    });
  });

  it("returns null and no errors if pdfId is undefined", async () => {
    // @ts-expect-error
    const { result } = renderHook(() => usePDFDetails(undefined));
    await waitFor(() => {
      expect(result.current.data).toBeNull();
      expect(result.current.errors).toEqual([]);
    });
    expect(getPdfDefinition).not.toHaveBeenCalled();
  });
});
