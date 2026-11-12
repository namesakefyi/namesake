import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithFormProvider, screen } from "../test-utils";
import { CheckboxGroupField } from "./CheckboxGroupField";

const mockOptions = {
  option1: "Option 1",
  option2: "Option 2",
  option3: "Option 3",
};

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

    for (const label of Object.values(mockOptions)) {
      const checkboxOption = screen.getByText(label);
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

    const selectedCheckbox = screen.getByRole("checkbox", {
      name: "Option 2",
    }) as HTMLInputElement;
    await userEvent.click(selectedCheckbox);
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

  it("disables other options when prefer not to answer is selected", async () => {
    renderWithFormProvider(
      <CheckboxGroupField
        name="reasonForChangingName"
        label="Test Label"
        options={{
          ...mockOptions,
          preferNotToAnswer: "Prefer not to answer",
        }}
      />,
    );

    // Select prefer not to answer
    const preferNotToAnswer = screen.getByRole("checkbox", {
      name: "Prefer not to answer",
    });
    await userEvent.click(preferNotToAnswer);

    // Check that all other options are disabled
    for (const label of Object.values(mockOptions)) {
      const checkbox = screen.getByRole("checkbox", {
        name: label,
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
    await userEvent.click(
      screen.getByRole("checkbox", { name: "Prefer not to answer" }),
    );

    // Verify all options are enabled
    for (const label of Object.values(mockOptions)) {
      const checkbox = screen.getByRole("checkbox", {
        name: label,
      }) as HTMLInputElement;
      expect(checkbox.disabled).toBe(false);
    }
  });
});
