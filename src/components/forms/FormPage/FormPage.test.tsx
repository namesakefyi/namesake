import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FormPage } from "./FormPage";

describe("FormPage", () => {
  it("renders title correctly", () => {
    const testTitle = "What is your legal name?";
    render(<FormPage title={testTitle} />);

    const titleElement = screen.getByText(testTitle);
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass("text-2xl");
    expect(titleElement).toHaveClass("font-semibold");
    expect(titleElement).toHaveClass("text-gray-normal");
  });

  it("renders optional description", () => {
    const testTitle = "What is your legal name?";
    const testDescription = "Type your name exactly as it appears on your ID.";

    render(<FormPage title={testTitle} description={testDescription} />);

    const descriptionElement = screen.getByText(testDescription);
    expect(descriptionElement).toBeInTheDocument();
    expect(descriptionElement).toHaveClass("text-base");
    expect(descriptionElement).toHaveClass("text-gray-dim");
  });

  it("does not render description when not provided", () => {
    const testTitle = "Basic Information";

    render(<FormPage title={testTitle} />);

    const titleElement = screen.getByText(testTitle);
    expect(titleElement).toBeInTheDocument();

    const descriptionQuery = screen.queryByRole("paragraph");
    expect(descriptionQuery).toBeNull();
  });
});
