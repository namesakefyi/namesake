import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CheckboxField } from "./CheckboxField";

describe("CheckboxField", () => {
  it("renders checkbox group with correct label", () => {
    const testLabel = "I would like my documents returned";

    render(<CheckboxField name="test-checkbox" label={testLabel} />);

    const groupLabel = screen.getByText(testLabel);
    expect(groupLabel).toBeInTheDocument();
  });

  it("allows selecting the checkbox", async () => {
    render(
      <CheckboxField
        name="test-checkbox"
        label="I would like my documents returned"
      />,
    );

    const checkboxLabel = screen.getByText(
      "I would like my documents returned",
    );
    await userEvent.click(checkboxLabel);

    const checkbox = screen.getByRole("checkbox", {
      name: "I would like my documents returned",
    }) as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it("supports optional children", () => {
    render(
      <CheckboxField
        name="test-checkbox"
        label="I would like my documents returned"
      >
        <div data-testid="child-component">Additional Info</div>
      </CheckboxField>,
    );

    const childComponent = screen.getByTestId("child-component");
    expect(childComponent).toBeInTheDocument();
  });
});
