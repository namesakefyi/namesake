import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { EmailField } from "./EmailField";

describe("EmailField", () => {
  it("renders email input field", () => {
    render(<EmailField />);

    const emailInput = screen.getByLabelText("Email");

    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toHaveAttribute("name", "email");
    expect(emailInput).toHaveAttribute("autocomplete", "email");
  });

  it("allows entering an email address", async () => {
    render(<EmailField />);

    const emailInput: HTMLInputElement = screen.getByLabelText("Email");

    await userEvent.type(emailInput, "user@example.com");
    expect(emailInput.value).toBe("user@example.com");
  });

  it("supports optional children", () => {
    render(
      <EmailField>
        <div data-testid="child-component">Additional Info</div>
      </EmailField>,
    );

    const childComponent = screen.getByTestId("child-component");
    expect(childComponent).toBeInTheDocument();
  });
});
