import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FormSection } from "./FormSection";

describe("FormSection", () => {
  const formSection = {
    title: "What is your legal name?",
    description: "Type your name exactly as it appears on your ID.",
  };

  it("renders title correctly", () => {
    render(<FormSection {...formSection} />);

    const titleElement = screen.getByText(formSection.title);
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass("text-4xl");
    expect(titleElement).toHaveClass("font-medium");
    expect(titleElement).toHaveClass("text-gray-normal");
  });

  it("renders optional description", () => {
    render(<FormSection {...formSection} />);

    const descriptionElement = screen.getByText(formSection.description);
    expect(descriptionElement).toBeInTheDocument();
    expect(descriptionElement).toHaveClass("text-xl");
    expect(descriptionElement).toHaveClass("text-gray-dim");
  });

  it("does not render description when not provided", () => {
    render(<FormSection {...formSection} description={undefined} />);

    const titleElement = screen.getByText(formSection.title);
    expect(titleElement).toBeInTheDocument();

    const descriptionQuery = screen.queryByRole("paragraph");
    expect(descriptionQuery).toBeNull();
  });
});
