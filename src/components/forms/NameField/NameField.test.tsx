import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { NameField } from "./NameField";

describe("NameField", () => {
  it("renders all name input fields", () => {
    render(<NameField />);

    const firstNameInput = screen.getByLabelText("First name");
    const middleNameInput = screen.getByLabelText("Middle name");
    const lastNameInput = screen.getByLabelText("Last name");

    expect(firstNameInput).toBeInTheDocument();
    expect(middleNameInput).toBeInTheDocument();
    expect(lastNameInput).toBeInTheDocument();
  });

  it("has correct autocomplete attributes", () => {
    render(<NameField />);

    const firstNameInput = screen.getByLabelText("First name");
    const middleNameInput = screen.getByLabelText("Middle name");
    const lastNameInput = screen.getByLabelText("Last name");

    expect(firstNameInput).toHaveAttribute("autocomplete", "given-name");
    expect(middleNameInput).toHaveAttribute("autocomplete", "additional-name");
    expect(lastNameInput).toHaveAttribute("autocomplete", "family-name");
  });

  it("allows entering text in all name fields", async () => {
    render(<NameField />);

    const firstNameInput: HTMLInputElement =
      screen.getByLabelText("First name");
    const middleNameInput: HTMLInputElement =
      screen.getByLabelText("Middle name");
    const lastNameInput: HTMLInputElement = screen.getByLabelText("Last name");

    await userEvent.type(firstNameInput, "John");
    await userEvent.type(middleNameInput, "Michael");
    await userEvent.type(lastNameInput, "Doe");

    expect(firstNameInput.value).toBe("John");
    expect(middleNameInput.value).toBe("Michael");
    expect(lastNameInput.value).toBe("Doe");
  });

  it("supports optional children", () => {
    render(
      <NameField>
        <div data-testid="child-component">Additional Info</div>
      </NameField>,
    );

    const childComponent = screen.getByTestId("child-component");
    expect(childComponent).toBeInTheDocument();
  });
});
