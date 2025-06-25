import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AppContent } from "./AppContent";

describe("AppContent", () => {
  it("renders children correctly", () => {
    render(
      <AppContent>
        <div data-testid="test-child">Test Content</div>
      </AppContent>,
    );

    expect(screen.getByTestId("test-child")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("applies custom className when provided", () => {
    render(
      <AppContent className="custom-class">
        <div>Content</div>
      </AppContent>,
    );

    const main = screen.getByRole("main");
    expect(main.firstChild).toHaveClass("custom-class");
  });

  it("renders error fallback when child component throws", () => {
    vi.spyOn(console, "error").mockImplementation(() => null);

    const ErrorComponent = () => {
      throw new Error("Test error");
    };

    render(
      <AppContent>
        <ErrorComponent />
      </AppContent>,
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(
      screen.getByText(
        "We’ve been notified of the issue. Refresh the page to try again.",
      ),
    ).toBeInTheDocument();
  });

  it("maintains error boundary around main content", () => {
    render(
      <AppContent>
        <div>Safe Content</div>
      </AppContent>,
    );

    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();

    const error = screen.queryByText("Something went wrong");
    expect(error).not.toBeInTheDocument();
  });
});
