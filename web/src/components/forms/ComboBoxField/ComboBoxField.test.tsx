import { User } from "@react-aria/test-utils";
import { describe, expect, it } from "vitest";
import { renderWithFormProvider, screen } from "../test-utils";
import { ComboBoxField } from "./ComboBoxField";

const mockOptions = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
];

describe("ComboBoxField", () => {
  const testUtilUser = new User({ interactionType: "keyboard" });

  it("renders with correct label", () => {
    const testLabel = "Select an option";

    renderWithFormProvider(
      <ComboBoxField name="pronouns" label={testLabel} options={mockOptions} />,
    );

    expect(
      screen.getByRole("combobox", { name: testLabel }),
    ).toBeInTheDocument();
  });

  it("renders all options in the dropdown", async () => {
    renderWithFormProvider(
      <ComboBoxField
        name="pronouns"
        label="Test Label"
        options={mockOptions}
      />,
    );

    const comboboxTester = testUtilUser.createTester("ComboBox", {
      root: screen.getByRole("combobox", { name: "Test Label" }),
      interactionType: "keyboard",
    });

    await comboboxTester.open();
    expect(comboboxTester.listbox).toBeInTheDocument();

    for (const option of mockOptions) {
      expect(
        screen.getByRole("option", { name: option.label }),
      ).toBeInTheDocument();
    }
  });

  it("allows selecting an option", async () => {
    renderWithFormProvider(
      <ComboBoxField
        name="pronouns"
        label="Test Label"
        placeholder="Select an option"
        options={mockOptions}
      />,
    );

    const combobox = screen.getByRole("combobox", { name: "Test Label" });
    expect(combobox).toHaveAttribute("placeholder", "Select an option");

    const comboboxTester = testUtilUser.createTester("ComboBox", {
      root: combobox,
      interactionType: "keyboard",
    });

    await comboboxTester.open();
    await comboboxTester.selectOption({ option: "Option 2" });

    expect(comboboxTester.trigger).toHaveValue("Option 2");
  });

  it("supports optional children", () => {
    renderWithFormProvider(
      <ComboBoxField name="pronouns" label="Test Label" options={mockOptions}>
        <div data-testid="child-component">Additional Info</div>
      </ComboBoxField>,
    );

    expect(screen.getByTestId("child-component")).toBeInTheDocument();
  });
});
