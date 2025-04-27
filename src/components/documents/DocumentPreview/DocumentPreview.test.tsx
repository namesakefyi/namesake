import type { PDFDefinition } from "@/constants";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DocumentPreview } from "./DocumentPreview";

// Mock useFilledPdf
vi.mock("@/hooks/useFilledPdf", () => ({
  useFilledPdf: vi.fn(),
}));
import { useFilledPdf } from "@/hooks/useFilledPdf";

const mockPdf: PDFDefinition = {
  id: "cjp27-petition-to-change-name-of-adult",
  title: "Petition to Change Name of Adult",
  code: "CJP 27",
  jurisdiction: "MA",
  pdfPath: "/fake/path.pdf",
  fields: () => ({}),
};

describe("DocumentPreview", () => {
  let createObjectURL: typeof URL.createObjectURL;
  let revokeObjectURL: typeof URL.revokeObjectURL;

  beforeEach(() => {
    // Store original functions
    createObjectURL = URL.createObjectURL;
    revokeObjectURL = URL.revokeObjectURL;

    // Mock URL.createObjectURL
    URL.createObjectURL = vi.fn().mockReturnValue("blob:mock-url");
    URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
    // Restore original functions
    URL.createObjectURL = createObjectURL;
    URL.revokeObjectURL = revokeObjectURL;
  });

  it("renders loading state", () => {
    (useFilledPdf as any).mockReturnValue({
      pdfBytes: null,
      loading: true,
      error: null,
    });
    render(<DocumentPreview pdf={mockPdf} />);
    expect(screen.getByText(/Loading PDF/i)).toBeInTheDocument();
  });

  it("renders error state", () => {
    (useFilledPdf as any).mockReturnValue({
      pdfBytes: null,
      loading: false,
      error: new Error("fail"),
    });
    render(<DocumentPreview pdf={mockPdf} />);
    expect(screen.getByText(/Error loading PDF/i)).toBeInTheDocument();
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });

  it("renders PDF in iframe when loaded", () => {
    // Mock a fake PDF bytes array
    const fakeBytes = new Uint8Array([1, 2, 3]);
    (useFilledPdf as any).mockReturnValue({
      pdfBytes: fakeBytes,
      loading: false,
      error: null,
    });
    render(<DocumentPreview pdf={mockPdf} />);
    // The iframe is dynamically created, so check for its presence
    const iframe = document.querySelector("iframe");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("src");
    // The container should be present
    expect(document.querySelector(".flex-1.w-full")).toBeInTheDocument();
  });
});
