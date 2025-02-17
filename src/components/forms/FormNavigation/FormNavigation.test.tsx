import { FormNavigation, FormSection } from "@/components/forms";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("FormNavigation", () => {
  const mockSections = ["First Question", "Second Question", "Third Question"];

  beforeEach(() => {
    // Mock the DOM structure that FormNavigation expects
    for (const title of mockSections) {
      render(<FormSection title={title} />);
    }

    // Mock IntersectionObserver
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      disconnect: () => null,
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders navigation controls", () => {
    render(<FormNavigation />);

    expect(screen.getByLabelText("Previous question")).toBeInTheDocument();
    expect(screen.getByLabelText("Next question")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "All questions" }),
    ).toBeInTheDocument();
  });

  it("renders all questions in menu popover", async () => {
    render(<FormNavigation />);

    userEvent.click(screen.getByRole("button", { name: "All questions" }));

    const menu = await screen.findByRole("menu");
    expect(menu).toBeInTheDocument();

    for (const title of mockSections) {
      expect(screen.getByRole("menuitem", { name: title })).toBeInTheDocument();
    }
  });

  it("disables previous button when at first section", async () => {
    render(<FormNavigation />);

    // Simulate first section being visible
    const observer = window.IntersectionObserver.mock.calls[0][0];
    observer([
      {
        target: document.getElementById("first-question"),
        isIntersecting: true,
      },
    ]);

    await waitFor(() => {
      expect(screen.getByLabelText("Previous question")).toHaveAttribute(
        "aria-disabled",
        "true",
      );
      expect(screen.getByLabelText("Next question")).not.toHaveAttribute(
        "aria-disabled",
        "true",
      );
    });
  });

  it("disables next button when at last section", async () => {
    render(<FormNavigation />);

    // Simulate last section being visible
    const observer = window.IntersectionObserver.mock.calls[0][0];
    observer([
      {
        target: document.getElementById("third-question"),
        isIntersecting: true,
      },
    ]);

    await waitFor(() => {
      expect(screen.getByLabelText("Previous question")).not.toHaveAttribute(
        "aria-disabled",
        "true",
      );
      expect(screen.getByLabelText("Next question")).toHaveAttribute(
        "aria-disabled",
        "true",
      );
    });
  });
});
