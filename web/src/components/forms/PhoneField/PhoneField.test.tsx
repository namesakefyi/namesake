import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithFormProvider, screen } from "../test-utils";
import { PhoneField } from "./PhoneField";

describe("PhoneField", () => {
  it("renders the phone number input field", () => {
    renderWithFormProvider(<PhoneField name="phoneNumber" />);

    const phoneInput = screen.getByLabelText("Phone number");
    expect(phoneInput).toBeInTheDocument();
    expect(phoneInput).toHaveValue("");
    expect(phoneInput).toHaveAttribute("type", "tel");
    expect(phoneInput).toHaveAttribute("name", "phoneNumber");
    expect(phoneInput).toHaveAttribute("autocomplete", "tel");
  });

  it("allows entering and formatting a phone number", async () => {
    renderWithFormProvider(<PhoneField name="phoneNumber" />);
    const phoneInput = screen.getByLabelText(
      "Phone number",
    ) as HTMLInputElement;
    await userEvent.type(phoneInput, "4567890123");
    expect(phoneInput.value).toBe("+1 (456) 789-0123");
  });

  it("does not allow non-numeric characters", async () => {
    renderWithFormProvider(<PhoneField name="phoneNumber" />);
    const phoneInput = screen.getByLabelText(
      "Phone number",
    ) as HTMLInputElement;
    await userEvent.type(phoneInput, "abcdg890jklmnop3456asdf789");
    expect(phoneInput.value).toBe("+1 (890) 345-6789");
  });

  it("does not allow more than 10 digits", async () => {
    renderWithFormProvider(<PhoneField name="phoneNumber" />);
    const phoneInput = screen.getByLabelText(
      "Phone number",
    ) as HTMLInputElement;
    await userEvent.type(phoneInput, "4567890123456789012345");
    expect(phoneInput.value).toBe("+1 (456) 789-0123");
  });

  it("supports optional children", () => {
    renderWithFormProvider(
      <PhoneField name="phoneNumber">
        <div data-testid="child-component">Additional Info</div>
      </PhoneField>,
    );

    const childComponent = screen.getByTestId("child-component");
    expect(childComponent).toBeInTheDocument();
  });
});
