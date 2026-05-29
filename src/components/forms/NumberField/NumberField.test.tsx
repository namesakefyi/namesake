import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithFormProvider, screen } from "../test-utils";
import { NumberField } from "./NumberField";

describe("NumberField", () => {
  it("renders the label", () => {
    renderWithFormProvider(
      <NumberField label="Household size" name="householdSize" />,
    );
    expect(screen.getByText("Household size")).toBeInTheDocument();
  });

  it("renders a number input", () => {
    renderWithFormProvider(
      <NumberField label="Household size" name="householdSize" />,
    );
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders increment and decrement buttons", () => {
    renderWithFormProvider(
      <NumberField label="Household size" name="householdSize" />,
    );
    expect(
      screen.getByRole("button", { name: /Increment/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Decrement/ }),
    ).toBeInTheDocument();
  });

  it("supports optional description", () => {
    renderWithFormProvider(
      <NumberField
        label="Household size"
        name="householdSize"
        description="Including yourself"
      />,
    );
    expect(screen.getByText("Including yourself")).toBeInTheDocument();
  });

  it("allows entering a number", async () => {
    renderWithFormProvider(
      <NumberField label="Household size" name="householdSize" />,
    );
    const input = screen.getByRole("textbox");
    await userEvent.click(input);
    await userEvent.keyboard("3");
    expect(input).toHaveValue("3");
  });

  it("supports optional children", () => {
    renderWithFormProvider(
      <NumberField label="Household size" name="householdSize">
        <div data-testid="child">Extra info</div>
      </NumberField>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});
