import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithFormProvider, screen } from "../test-utils";
import { RadioGroupField } from "./RadioGroupField";

const mockOptions = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
];

describe("RadioGroupField", () => {
  it("renders radio group with correct label", () => {
    const testLabel = "Select an option";

    renderWithFormProvider(
      <RadioGroupField
        name="pronouns"
        label={testLabel}
        options={mockOptions}
      />,
    );

    const groupLabel = screen.getByText(testLabel);
    expect(groupLabel).toBeInTheDocument();
  });

  it("renders all radio options", () => {
    renderWithFormProvider(
      <RadioGroupField
        name="pronouns"
        label="Test Label"
        options={mockOptions}
      />,
    );

    for (const option of mockOptions) {
      const radioOption = screen.getByText(option.label);
      expect(radioOption).toBeInTheDocument();
    }
  });

  it("allows selecting a radio option", async () => {
    renderWithFormProvider(
      <RadioGroupField
        name="pronouns"
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

  it("shows a visible label when labelHidden is not set", () => {
    renderWithFormProvider(
      <RadioGroupField
        name="pronouns"
        label="Select an option"
        options={mockOptions}
      />,
    );

    expect(screen.getByText("Select an option")).toBeInTheDocument();
    expect(
      screen.getByRole("radiogroup", { name: "Select an option" }),
    ).not.toHaveAttribute("aria-label");
  });

  it("hides the visible label and sets aria-label when labelHidden is true", () => {
    renderWithFormProvider(
      <RadioGroupField
        name="pronouns"
        label="Select an option"
        options={mockOptions}
        labelHidden
      />,
    );

    expect(screen.queryByText("Select an option")).not.toBeInTheDocument();
    expect(
      screen.getByRole("radiogroup", { name: "Select an option" }),
    ).toBeInTheDocument();
  });

  it("supports optional children", () => {
    renderWithFormProvider(
      <RadioGroupField name="pronouns" label="Test Label" options={mockOptions}>
        <div data-testid="child-component">Additional Info</div>
      </RadioGroupField>,
    );

    const childComponent = screen.getByTestId("child-component");
    expect(childComponent).toBeInTheDocument();
  });

  it("renders prefer not to answer option when includePreferNotToAnswer is true", () => {
    renderWithFormProvider(
      <RadioGroupField
        name="pronouns"
        label="Test Label"
        options={mockOptions}
        includePreferNotToAnswer
      />,
    );

    const preferNotToAnswerOption = screen.getByText("Prefer not to answer");
    expect(preferNotToAnswerOption).toBeInTheDocument();
  });

  it("does not render prefer not to answer option when includePreferNotToAnswer is false", () => {
    renderWithFormProvider(
      <RadioGroupField
        name="pronouns"
        label="Test Label"
        options={mockOptions}
      />,
    );

    const preferNotToAnswerOption = screen.queryByText("Prefer not to answer");
    expect(preferNotToAnswerOption).not.toBeInTheDocument();
  });

  it("allows selecting prefer not to answer option", async () => {
    renderWithFormProvider(
      <RadioGroupField
        name="pronouns"
        label="Test Label"
        options={mockOptions}
        includePreferNotToAnswer={true}
      />,
    );

    const preferNotToAnswerOption = screen.getByText("Prefer not to answer");
    await userEvent.click(preferNotToAnswerOption);

    const selectedRadio = screen.getByRole("radio", {
      name: "Prefer not to answer",
    }) as HTMLInputElement;
    expect(selectedRadio.checked).toBe(true);
  });
});
