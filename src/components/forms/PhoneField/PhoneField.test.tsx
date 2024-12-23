import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PhoneField } from "./PhoneField";

describe("PhoneField", () => {
  it("renders the phone number input field", () => {
    render(<PhoneField />);

    const phoneInput = screen.getByLabelText("Phone number");
    expect(phoneInput).toBeInTheDocument();
    expect(phoneInput).toHaveValue("");
    expect(phoneInput).toHaveAttribute("type", "tel");
    expect(phoneInput).toHaveAttribute("name", "phone");
    expect(phoneInput).toHaveAttribute("autocomplete", "tel");
  });

  it("allows entering and formatting a phone number", async () => {
    render(<PhoneField />);
    const phoneInput = screen.getByLabelText(
      "Phone number",
    ) as HTMLInputElement;
    await userEvent.type(phoneInput, "4567890123");
    expect(phoneInput.value).toBe("+1 (456) 789-0123");
    await userEvent.type(
      phoneInput,
      "{backspace}{backspace}{backspace}{backspace}",
    );
    expect(phoneInput.value).toBe("+1 (456) 789");
  });

  it("does not allow non-numeric characters", async () => {
    render(<PhoneField />);
    const phoneInput = screen.getByLabelText(
      "Phone number",
    ) as HTMLInputElement;
    await userEvent.type(phoneInput, "abcdg890jklmnop3456asdf789");
    expect(phoneInput.value).toBe("+1 (890) 345-6789");
  });

  it("does not allow more than 10 digits", async () => {
    render(<PhoneField />);
    const phoneInput = screen.getByLabelText(
      "Phone number",
    ) as HTMLInputElement;
    await userEvent.type(phoneInput, "4567890123456789012345");
    expect(phoneInput.value).toBe("+1 (456) 789-0123");
  });

  it("supports optional children", () => {
    render(
      <PhoneField>
        <div data-testid="child-component">Additional Info</div>
      </PhoneField>,
    );

    const childComponent = screen.getByTestId("child-component");
    expect(childComponent).toBeInTheDocument();
  });
});
