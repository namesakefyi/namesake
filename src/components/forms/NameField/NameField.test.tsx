import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithFormProvider, screen } from "../test-utils";
import { NameField } from "./NameField";

describe("NameField", () => {
  it("renders all name input fields", () => {
    renderWithFormProvider(<NameField type="newName" />);

    const firstNameInput = screen.getByLabelText("First name");
    const middleNameInput = screen.getByLabelText("Middle name");
    const lastNameInput = screen.getByLabelText("Last or family name");

    expect(firstNameInput).toBeInTheDocument();
    expect(middleNameInput).toBeInTheDocument();
    expect(lastNameInput).toBeInTheDocument();
  });

  it("has correct autocomplete attributes", () => {
    renderWithFormProvider(<NameField type="newName" />);

    const firstNameInput = screen.getByLabelText("First name");
    const middleNameInput = screen.getByLabelText("Middle name");
    const lastNameInput = screen.getByLabelText("Last or family name");

    expect(firstNameInput).toHaveAttribute("autocomplete", "given-name");
    expect(middleNameInput).toHaveAttribute("autocomplete", "additional-name");
    expect(lastNameInput).toHaveAttribute("autocomplete", "family-name");
  });

  it("allows entering text in all name fields", async () => {
    renderWithFormProvider(<NameField type="newName" />);

    const firstNameInput: HTMLInputElement =
      screen.getByLabelText("First name");
    const middleNameInput: HTMLInputElement =
      screen.getByLabelText("Middle name");
    const lastNameInput: HTMLInputElement = screen.getByLabelText(
      "Last or family name",
    );

    await userEvent.type(firstNameInput, "John");
    await userEvent.type(middleNameInput, "Michael");
    await userEvent.type(lastNameInput, "Doe");

    expect(firstNameInput.value).toBe("John");
    expect(middleNameInput.value).toBe("Michael");
    expect(lastNameInput.value).toBe("Doe");
  });

  it("supports optional children", () => {
    renderWithFormProvider(
      <NameField type="newName">
        <div data-testid="child-component">Additional Info</div>
      </NameField>,
    );

    const childComponent = screen.getByTestId("child-component");
    expect(childComponent).toBeInTheDocument();
  });
});
