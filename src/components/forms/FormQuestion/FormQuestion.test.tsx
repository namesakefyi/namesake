import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FormQuestion } from "./FormQuestion";

describe("FormQuestion", () => {
  it("renders title correctly", () => {
    const testTitle = "What is your legal name?";
    render(
      <FormQuestion title={testTitle}>
        <div>Form Content</div>
      </FormQuestion>,
    );

    const titleElement = screen.getByText(testTitle);
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass("text-2xl");
    expect(titleElement).toHaveClass("font-semibold");
    expect(titleElement).toHaveClass("text-gray-normal");
  });

  it("renders optional description", () => {
    const testTitle = "What is your legal name?";
    const testDescription = "Type your name exactly as it appears on your ID.";

    render(
      <FormQuestion title={testTitle} description={testDescription}>
        <div>Form Content</div>
      </FormQuestion>,
    );

    const descriptionElement = screen.getByText(testDescription);
    expect(descriptionElement).toBeInTheDocument();
    expect(descriptionElement).toHaveClass("text-base");
    expect(descriptionElement).toHaveClass("text-gray-dim");
  });

  it("does not render description when not provided", () => {
    const testTitle = "Basic Information";

    render(
      <FormQuestion title={testTitle}>
        <div>Form Content</div>
      </FormQuestion>,
    );

    const titleElement = screen.getByText(testTitle);
    expect(titleElement).toBeInTheDocument();

    const descriptionQuery = screen.queryByRole("paragraph");
    expect(descriptionQuery).toBeNull();
  });

  it("renders children correctly", () => {
    render(
      <FormQuestion title="Test Question">
        <input data-testid="test-input" />
      </FormQuestion>,
    );

    const childElement = screen.getByTestId("test-input");
    expect(childElement).toBeInTheDocument();
  });
});
