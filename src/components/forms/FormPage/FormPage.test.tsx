import type { Id } from "@convex/_generated/dataModel";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FormPage } from "./FormPage";

describe("FormPage", () => {
  const mockPage = {
    _id: "1234" as Id<"formPages">,
    _creationTime: 1234,
    formId: "1234" as Id<"forms">,
    title: "What is your legal name?",
    description: "Type your name exactly as it appears on your ID.",
  };

  it("renders title correctly", () => {
    render(<FormPage page={mockPage} />);

    const titleElement = screen.getByText(mockPage.title);
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass("text-2xl");
    expect(titleElement).toHaveClass("font-semibold");
    expect(titleElement).toHaveClass("text-gray-normal");
  });

  it("renders optional description", () => {
    render(<FormPage page={mockPage} />);

    const descriptionElement = screen.getByText(mockPage.description);
    expect(descriptionElement).toBeInTheDocument();
    expect(descriptionElement).toHaveClass("text-base");
    expect(descriptionElement).toHaveClass("text-gray-dim");
  });

  it("does not render description when not provided", () => {
    render(<FormPage page={{ ...mockPage, description: undefined }} />);

    const titleElement = screen.getByText(mockPage.title);
    expect(titleElement).toBeInTheDocument();

    const descriptionQuery = screen.queryByRole("paragraph");
    expect(descriptionQuery).toBeNull();
  });
});
