import { useTheme } from "@/hooks/useTheme";
import { render, screen } from "@testing-library/react";
import { useQuery } from "convex/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppSidebar } from "./AppSidebar";

describe("AppSidebar", () => {
  const mockSetTheme = vi.fn();
  const mockThemeSelection = new Set(["light"]);

  beforeEach(() => {
    vi.clearAllMocks();
    (useTheme as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      theme: "light",
      themeSelection: mockThemeSelection,
      setTheme: mockSetTheme,
    });
    (useQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      role: "user",
    });
  });

  it("renders children content", () => {
    render(
      <AppSidebar>
        <div>Main Content</div>
      </AppSidebar>,
    );

    expect(screen.getByText("Main Content")).toBeInTheDocument();
  });

  it("renders header when provided", () => {
    render(
      <AppSidebar header={<div>Header Content</div>}>
        <div>Main Content</div>
      </AppSidebar>,
    );

    expect(screen.getByText("Header Content")).toBeInTheDocument();
    expect(screen.getByText("Main Content")).toBeInTheDocument();
  });

  it("renders footer when provided", () => {
    render(
      <AppSidebar footer={<div>Footer Content</div>}>
        <div>Main Content</div>
      </AppSidebar>,
    );

    expect(screen.getByText("Main Content")).toBeInTheDocument();
    expect(screen.getByText("Footer Content")).toBeInTheDocument();
  });

  it("renders all sections when provided", () => {
    render(
      <AppSidebar
        header={<div>Header Content</div>}
        footer={<div>Footer Content</div>}
      >
        <div>Main Content</div>
      </AppSidebar>,
    );

    expect(screen.getByText("Header Content")).toBeInTheDocument();
    expect(screen.getByText("Main Content")).toBeInTheDocument();
    expect(screen.getByText("Footer Content")).toBeInTheDocument();
  });

  it("renders error fallback when child component throws", () => {
    vi.spyOn(console, "error").mockImplementation(() => null);

    const ErrorComponent = () => {
      throw new Error("Test error");
    };

    render(
      <AppSidebar>
        <ErrorComponent />
      </AppSidebar>,
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(
      screen.getByText(
        "We’ve been notified of the issue. Refresh the page to try again.",
      ),
    ).toBeInTheDocument();
  });

  it("maintains error boundary around content", () => {
    render(
      <AppSidebar>
        <div>Safe Content</div>
      </AppSidebar>,
    );

    expect(screen.getByText("Safe Content")).toBeInTheDocument();
    const error = screen.queryByText("Something went wrong");
    expect(error).not.toBeInTheDocument();
  });
});
