import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithFormProvider, screen } from "../test-utils";
import { CheckboxGroupField } from "./CheckboxGroupField";

const mockOptions = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
];

describe("CheckboxGroupField", () => {
  it("renders checkbox group with correct label", () => {
    const testLabel = "Select an option";

    renderWithFormProvider(
      <CheckboxGroupField
        name="reasonForChangingName"
        label={testLabel}
        options={mockOptions}
      />,
    );

    const groupLabel = screen.getByText(testLabel);
    expect(groupLabel).toBeInTheDocument();
  });

  it("renders all checkbox options", () => {
    renderWithFormProvider(
      <CheckboxGroupField
        name="reasonForChangingName"
        label="Test Label"
        options={mockOptions}
      />,
    );

    for (const option of mockOptions) {
      const checkboxOption = screen.getByText(option.label);
      expect(checkboxOption).toBeInTheDocument();
    }
  });

  it("allows selecting a checkbox option", async () => {
    renderWithFormProvider(
      <CheckboxGroupField
        name="reasonForChangingName"
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
    renderWithFormProvider(
      <CheckboxGroupField
        name="reasonForChangingName"
        label="Test Label"
        options={mockOptions}
      >
        <div data-testid="child-component">Additional Info</div>
      </CheckboxGroupField>,
    );

    const childComponent = screen.getByTestId("child-component");
    expect(childComponent).toBeInTheDocument();
  });

  it("renders prefer not to answer option when enabled", () => {
    renderWithFormProvider(
      <CheckboxGroupField
        name="reasonForChangingName"
        label="Test Label"
        options={mockOptions}
        includePreferNotToAnswer
      />,
    );

    const preferNotToAnswer = screen.getByText("Prefer not to answer");
    expect(preferNotToAnswer).toBeInTheDocument();
  });

  it("disables other options when prefer not to answer is selected", async () => {
    renderWithFormProvider(
      <CheckboxGroupField
        name="reasonForChangingName"
        label="Test Label"
        options={mockOptions}
        includePreferNotToAnswer
      />,
    );

    // Select prefer not to answer
    const preferNotToAnswer = screen.getByText("Prefer not to answer");
    await userEvent.click(preferNotToAnswer);

    // Check that all other options are disabled
    for (const option of mockOptions) {
      const checkbox = screen.getByRole("checkbox", {
        name: option.label,
      }) as HTMLInputElement;
      expect(checkbox.disabled).toBe(true);
      expect(checkbox.checked).toBe(false);
    }

    // Verify prefer not to answer is checked
    const preferNotToAnswerCheckbox = screen.getByRole("checkbox", {
      name: "Prefer not to answer",
    }) as HTMLInputElement;
    expect(preferNotToAnswerCheckbox.checked).toBe(true);

    // Uncheck prefer not to answer
    await userEvent.click(preferNotToAnswer);

    // Verify all options are enabled
    for (const option of mockOptions) {
      const checkbox = screen.getByRole("checkbox", {
        name: option.label,
      }) as HTMLInputElement;
      expect(checkbox.disabled).toBe(false);
    }
  });
});
