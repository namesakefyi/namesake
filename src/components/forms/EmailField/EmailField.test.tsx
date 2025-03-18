import userEvent from "@testing-library/user-event";
import { renderWithFormProvider, screen } from "@tests/test-utils";
import { describe, expect, it } from "vitest";
import { EmailField } from "./EmailField";

describe("EmailField", () => {
  it("renders email input field", () => {
    renderWithFormProvider(<EmailField name="email" />);

    const emailInput = screen.getByLabelText("Email address");

    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toHaveAttribute("name", "email");
    expect(emailInput).toHaveAttribute("autocomplete", "email");
  });

  it("allows entering an email address", async () => {
    renderWithFormProvider(<EmailField name="email" />);

    const emailInput: HTMLInputElement = screen.getByLabelText("Email address");

    await userEvent.type(emailInput, "user@example.com");
    expect(emailInput.value).toBe("user@example.com");
  });

  it("supports optional children", () => {
    renderWithFormProvider(
      <EmailField name="email">
        <div data-testid="child-component">Additional Info</div>
      </EmailField>,
    );

    const childComponent = screen.getByTestId("child-component");
    expect(childComponent).toBeInTheDocument();
  });
});
