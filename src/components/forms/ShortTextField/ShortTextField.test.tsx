import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ShortTextField } from "./ShortTextField";

describe("ShortTextField", () => {
  it("renders field", () => {
    render(<ShortTextField label="Custom field" name="customField" />);

    const customField = screen.getByLabelText("Custom field");
    expect(customField).toBeInTheDocument();
    expect(customField).toHaveAttribute("name", "customField");
  });

  it("supports optional description", () => {
    render(
      <ShortTextField
        label="Custom field"
        name="customField"
        description="A custom description"
      />,
    );

    const description = screen.getByText("A custom description");
    expect(description).toBeInTheDocument();
  });

  it("allows entering text", async () => {
    render(<ShortTextField label="Custom field" name="customField" />);

    const customField = screen.getByLabelText("Custom field");
    await userEvent.type(customField, "Hello, world!");
    expect(customField).toHaveValue("Hello, world!");
  });

  it("supports optional children", () => {
    render(
      <ShortTextField label="Custom field" name="customField">
        <div data-testid="child-component">Additional Info</div>
      </ShortTextField>,
    );

    const childComponent = screen.getByTestId("child-component");
    expect(childComponent).toBeInTheDocument();
  });
});
