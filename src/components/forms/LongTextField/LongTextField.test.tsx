import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LongTextField } from "./LongTextField";

describe("LongTextField", () => {
  it("renders long text field", () => {
    render(<LongTextField label="Custom field" name="customField" />);

    const customField = screen.getByLabelText("Custom field");

    expect(customField).toBeInTheDocument();
  });

  it("supports optional description", () => {
    render(
      <LongTextField
        label="Custom field"
        name="customField"
        description="A custom description"
      />,
    );

    const description = screen.getByText("A custom description");
    expect(description).toBeInTheDocument();
  });

  it("allows entering text", async () => {
    render(<LongTextField label="Custom field" name="customField" />);

    const customField = screen.getByLabelText("Custom field");
    await userEvent.type(customField, "Hello, world!");
    expect(customField).toHaveValue("Hello, world!");
  });

  it("supports optional children", () => {
    render(
      <LongTextField label="Custom field" name="customField">
        <div data-testid="child-component">Additional Info</div>
      </LongTextField>,
    );

    const childComponent = screen.getByTestId("child-component");
    expect(childComponent).toBeInTheDocument();
  });
});
