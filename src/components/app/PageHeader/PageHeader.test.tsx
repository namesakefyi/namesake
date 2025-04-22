import { useIsMobile } from "@/utils/useIsMobile";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PageHeader } from "./PageHeader";

// Mock the useIsMobile hook
vi.mock("@/utils/useIsMobile");

describe("PageHeader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useIsMobile as unknown as ReturnType<typeof vi.fn>).mockReturnValue(false);
  });

  it("renders the title correctly", () => {
    render(<PageHeader title="Test Page" />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Test Page",
    );
  });

  it("renders children in the right section", () => {
    render(
      <PageHeader title="Test Page">
        <button type="button">Action Button</button>
      </PageHeader>,
    );
    expect(screen.getByText("Action Button")).toBeInTheDocument();
  });

  it("renders badge when provided", () => {
    render(
      <PageHeader
        title="Test Page"
        badge={<span data-testid="test-badge">Badge</span>}
      />,
    );
    expect(screen.getByTestId("test-badge")).toBeInTheDocument();
    expect(screen.getByText("Badge")).toBeInTheDocument();
  });

  it("applies custom className when provided", () => {
    render(<PageHeader title="Test Page" className="custom-class" />);
    expect(screen.getByRole("banner")).toHaveClass("custom-class");
  });

  describe("mobile back link", () => {
    it("does not render back link on desktop", () => {
      (useIsMobile as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
        false,
      );

      render(
        <PageHeader title="Test Page" mobileBackLink={{ to: "/settings" }} />,
      );
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });

    it("renders back link on mobile when mobileBackLink is provided", () => {
      (useIsMobile as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
        true,
      );

      render(
        <PageHeader title="Test Page" mobileBackLink={{ to: "/settings" }} />,
      );
      const backLink = screen.getByRole("link");
      expect(backLink).toBeInTheDocument();
      const icon = backLink.querySelector("svg");
      expect(icon).toHaveClass("lucide-arrow-left");
    });

    it("does not render back link on mobile when mobileBackLink is not provided", () => {
      (useIsMobile as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
        true,
      );

      render(<PageHeader title="Test Page" />);
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });
  });
});
