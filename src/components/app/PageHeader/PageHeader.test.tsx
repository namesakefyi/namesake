import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useIsMobile } from "@/hooks/useIsMobile";
import { PageHeader } from "./PageHeader";

// Mock the useIsMobile hook
vi.mock("@/hooks/useIsMobile");

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

  it("applies max-w-full when fullWidth is true", () => {
    render(<PageHeader title="Test Page" fullWidth={true} />);
    const header = screen.getByRole("banner");
    const container = header.firstChild as HTMLElement;
    expect(container).toHaveClass("max-w-full");
  });

  it("applies default container width when fullWidth is false", () => {
    render(<PageHeader title="Test Page" fullWidth={false} />);
    const header = screen.getByRole("banner");
    const container = header.firstChild as HTMLElement;
    expect(container).toHaveClass("max-w-(--container-width)");
  });

  it("does not render back link on desktop", () => {
    (useIsMobile as unknown as ReturnType<typeof vi.fn>).mockReturnValue(false);

    render(
      <PageHeader title="Test Page" mobileBackLink={{ to: "/settings" }} />,
    );
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders back link on mobile when mobileBackLink is provided", () => {
    (useIsMobile as unknown as ReturnType<typeof vi.fn>).mockReturnValue(true);

    render(
      <PageHeader title="Test Page" mobileBackLink={{ to: "/settings" }} />,
    );
    const backLink = screen.getByRole("link");
    expect(backLink).toBeInTheDocument();
    const icon = backLink.querySelector("svg");
    expect(icon).toHaveClass("lucide-arrow-left");
  });

  it("does not render back link on mobile when mobileBackLink is not provided", () => {
    (useIsMobile as unknown as ReturnType<typeof vi.fn>).mockReturnValue(true);

    render(<PageHeader title="Test Page" />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders back link with correct styling on mobile", () => {
    (useIsMobile as unknown as ReturnType<typeof vi.fn>).mockReturnValue(true);

    render(
      <PageHeader title="Test Page" mobileBackLink={{ to: "/settings" }} />,
    );
    const backLink = screen.getByRole("link");
    expect(backLink).toHaveClass("-ml-2");
    expect(backLink).toHaveClass("-mr-1");
  });
});
