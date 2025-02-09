import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CheckboxGroupField } from "./CheckboxGroupField";

const mockOptions = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
];

describe("CheckboxGroupField", () => {
  it("renders checkbox group with correct label", () => {
    const testLabel = "Select an option";

    render(
      <CheckboxGroupField
        name="test-checkbox"
        label={testLabel}
        options={mockOptions}
      />,
    );

    const groupLabel = screen.getByText(testLabel);
    expect(groupLabel).toBeInTheDocument();
  });

  it("renders all checkbox options", () => {
    render(
      <CheckboxGroupField
        name="test-checkbox"
        label="Test Label"
        options={mockOptions}
      />,
    );

    for (const option of mockOptions) {
      const checkboxOption = screen.getByText(option.label);
      expect(checkboxOption).toBeInTheDocument();
    }
  });

  it("displays guidance for checkbox groups", () => {
    render(
      <CheckboxGroupField
        name="test-checkbox"
        label="Test Label"
        options={mockOptions}
      />,
    );

    const guidance = screen.getByText("Select all that apply:");
    expect(guidance).toBeInTheDocument();
  });

  it("allows selecting a checkbox option", async () => {
    render(
      <CheckboxGroupField
        name="test-checkbox"
        label="Test Label"
        options={mockOptions}
      />,
    );

    const secondOption = screen.getByText("Option 2");
    await userEvent.click(secondOption);

    const selectedCheckbox = screen.getByRole("checkbox", {
      name: "Option 2",
    }) as HTMLInputElement;
    expect(selectedCheckbox.checked).toBe(true);
  });

  it("supports optional children", () => {
    render(
      <CheckboxGroupField
        name="test-checkbox"
        label="Test Label"
        options={mockOptions}
      >
        <div data-testid="child-component">Additional Info</div>
      </CheckboxGroupField>,
    );

    const childComponent = screen.getByTestId("child-component");
    expect(childComponent).toBeInTheDocument();
  });
});
