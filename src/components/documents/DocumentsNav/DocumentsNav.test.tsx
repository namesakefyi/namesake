import { usePDFDetails } from "@/hooks/usePDFDetails";
import { useMatchRoute } from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { useQuery } from "convex/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DocumentsNav } from "./DocumentsNav";

vi.mock("convex/react");
vi.mock("@/hooks/usePDFDetails");
vi.mock("@tanstack/react-router");

describe("DocumentsNav", () => {
  const mockDocuments = [
    { pdfId: "cjp27-petition-to-change-name-of-adult" },
    { pdfId: "cjd400-probate-and-family-court-motion" },
  ];
  const mockPDFDetails: Record<string, { data: any; errors: any[] }> = {
    "cjp27-petition-to-change-name-of-adult": {
      data: {
        id: "cjp27-petition-to-change-name-of-adult",
        title: "Petition to Change Name of Adult",
        jurisdiction: "MA",
        pdfPath: "/fake/path1.pdf",
        fields: vi.fn(),
      },
      errors: [],
    },
    "cjd400-probate-and-family-court-motion": {
      data: {
        id: "cjd400-probate-and-family-court-motion",
        title: "Probate and Family Court Motion",
        jurisdiction: "MA",
        pdfPath: "/fake/path2.pdf",
        fields: vi.fn(),
      },
      errors: [],
    },
  };

  beforeEach(() => {
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue(mockDocuments);
    (usePDFDetails as ReturnType<typeof vi.fn>).mockImplementation(
      (pdfId: string) => mockPDFDetails[pdfId] || { data: null, errors: [] },
    );
    (useMatchRoute as ReturnType<typeof vi.fn>).mockReturnValue(() => false);
    vi.clearAllMocks();
  });

  it("renders a nav item for each user document", () => {
    render(<DocumentsNav />);
    expect(
      screen.getByText("Petition to Change Name of Adult"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Probate and Family Court Motion"),
    ).toBeInTheDocument();
  });

  it("renders document titles as links", () => {
    render(<DocumentsNav />);
    expect(
      screen.getByText("Petition to Change Name of Adult").closest("a"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Probate and Family Court Motion").closest("a"),
    ).toBeInTheDocument();
  });

  it("renders null if there are no user documents", () => {
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue([]);
    const { container } = render(<DocumentsNav />);
    expect(container.firstChild).toBeNull();
  });
});
