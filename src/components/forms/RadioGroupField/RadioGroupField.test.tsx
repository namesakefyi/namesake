import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { RadioGroupField } from "./RadioGroupField";

const mockOptions = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
];

describe("RadioGroupField", () => {
  it("renders radio group with correct label", () => {
    const testLabel = "Select an option";

    render(
      <RadioGroupField
        name="test-radio"
        label={testLabel}
        options={mockOptions}
      />,
    );

    const groupLabel = screen.getByText(testLabel);
    expect(groupLabel).toBeInTheDocument();
  });

  it("renders all radio options", () => {
    render(
      <RadioGroupField
        name="test-radio"
        label="Test Label"
        options={mockOptions}
      />,
    );

    for (const option of mockOptions) {
      const radioOption = screen.getByText(option.label);
      expect(radioOption).toBeInTheDocument();
    }
  });

  it("displays guidance for radio groups", () => {
    render(
      <RadioGroupField
        name="test-radio"
        label="Test Label"
        options={mockOptions}
      />,
    );

    const guidance = screen.getByText("Select one:");
    expect(guidance).toBeInTheDocument();
  });

  it("allows selecting a radio option", async () => {
    render(
      <RadioGroupField
        name="test-radio"
        label="Test Label"
        options={mockOptions}
      />,
    );

    const secondOption = screen.getByText("Option 2");
    await userEvent.click(secondOption);

    const selectedRadio = screen.getByRole("radio", {
      name: "Option 2",
    }) as HTMLInputElement;
    expect(selectedRadio.checked).toBe(true);
  });

  it("supports optional children", () => {
    render(
      <RadioGroupField
        name="test-radio"
        label="Test Label"
        options={mockOptions}
      >
        <div data-testid="child-component">Additional Info</div>
      </RadioGroupField>,
    );

    const childComponent = screen.getByTestId("child-component");
    expect(childComponent).toBeInTheDocument();
  });
});
