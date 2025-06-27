import userEvent from "@testing-library/user-event";
import { renderWithFormProvider, screen } from "@tests/test-utils";
import { describe, expect, it } from "vitest";
import { SelectField } from "./SelectField";

const mockOptions = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
];

describe("SelectField", () => {
  it("renders select with correct label", () => {
    const testLabel = "Select an option";

    renderWithFormProvider(
      <SelectField name="pronouns" label={testLabel} options={mockOptions} />,
    );

    const groupLabel = screen.getByText(testLabel);
    expect(groupLabel).toBeInTheDocument();
  });

  it("renders all options in the dropdown", async () => {
    renderWithFormProvider(
      <SelectField name="pronouns" label="Test Label" options={mockOptions} />,
    );

    for (const option of mockOptions) {
      const selectOption = screen.getByText(option.label);
      expect(selectOption).toBeInTheDocument();
    }
  });

  it("allows selecting an option", async () => {
    renderWithFormProvider(
      <SelectField
        name="pronouns"
        label="Test Label"
        placeholder="Select an option"
        options={mockOptions}
      />,
    );

    const select = screen.getByLabelText("Test Label");
    expect(select).toHaveTextContent("Select an option");
    await userEvent.click(select);

    const option = screen.getByRole("option", {
      name: "Option 2",
    });
    await userEvent.click(option);

    expect(select).toHaveTextContent("Option 2");
  });

  it("supports optional children", () => {
    renderWithFormProvider(
      <SelectField name="pronouns" label="Test Label" options={mockOptions}>
        <div data-testid="child-component">Additional Info</div>
      </SelectField>,
    );

    const childComponent = screen.getByTestId("child-component");
    expect(childComponent).toBeInTheDocument();
  });
});
