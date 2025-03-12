import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FormSection, FormSubSection } from "./FormSection";

describe("FormSection", () => {
  const formSection = {
    title: "What is your legal name?",
    description: "Type your name exactly as it appears on your ID.",
  };

  it("renders title correctly", () => {
    render(<FormSection {...formSection} />);

    const titleElement = screen.getByText(formSection.title);
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass("text-3xl");
    expect(titleElement).toHaveClass("font-medium");
    expect(titleElement).toHaveClass("text-gray-normal");
  });

  it("renders optional description", () => {
    render(<FormSection {...formSection} />);

    const descriptionElement = screen.getByText(formSection.description);
    expect(descriptionElement).toBeInTheDocument();
    expect(descriptionElement).toHaveClass("text-lg");
    expect(descriptionElement).toHaveClass("text-gray-dim");
  });

  it("does not render description when not provided", () => {
    render(<FormSection {...formSection} description={undefined} />);

    const titleElement = screen.getByText(formSection.title);
    expect(titleElement).toBeInTheDocument();

    const descriptionQuery = screen.queryByRole("paragraph");
    expect(descriptionQuery).toBeNull();
  });

  it("formats the question title as id and omits punctuation", () => {
    render(<FormSection {...formSection} title="What is your legal name?" />);
    const section = screen.getByTestId("form-section");
    expect(section).toHaveAttribute("id", "what-is-your-legal-name");
  });

  it("omits apostrophes from the id", () => {
    render(
      <FormSection
        {...formSection}
        title="What is the reason you're changing your name?"
      />,
    );
    const section = screen.getByTestId("form-section");
    expect(section).toHaveAttribute(
      "id",
      "what-is-the-reason-youre-changing-your-name",
    );
  });
});

describe("FormSubSection", () => {
  it("renders title", () => {
    render(<FormSubSection title="What is your legal name?" />);

    const titleElement = screen.getByText("What is your legal name?");
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass("text-2xl");
  });

  it("does not render title when not provided", () => {
    render(<FormSubSection title={undefined} />);

    const titleElement = screen.queryByText("What is your legal name?");
    expect(titleElement).toBeNull();
  });

  it("renders children", () => {
    render(
      <FormSubSection title="What is your legal name?">
        <div>Test content</div>
      </FormSubSection>,
    );
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("does not render when not visible", () => {
    render(
      <FormSubSection title="What is your legal name?" isVisible={false} />,
    );

    const titleElement = screen.queryByText("What is your legal name?");
    expect(titleElement).toBeNull();
  });
});
