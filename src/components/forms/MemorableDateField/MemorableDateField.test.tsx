import userEvent from "@testing-library/user-event";
import { renderWithFormProvider, screen } from "@tests/test-utils";
import { describe, expect, it } from "vitest";
import { MemorableDateField } from "./MemorableDateField";

describe("MemorableDateField", () => {
  it("renders all memorable date input fields", () => {
    const dateField = renderWithFormProvider(
      <MemorableDateField label="Birthdate" name="dateOfBirth" />,
    );

    const birthdateLabel = screen.getByText("Birthdate");
    const dayInput = dateField.getByRole("spinbutton", {
      name: "day, Birthdate",
    });
    const monthInput = dateField.getByRole("spinbutton", {
      name: "month, Birthdate",
    });
    const yearInput = dateField.getByRole("spinbutton", {
      name: "year, Birthdate",
    });
    const nativeInput = dateField.getByRole("textbox", {
      hidden: true,
    });

    expect(birthdateLabel).toBeInTheDocument();
    expect(dayInput).toBeInTheDocument();
    expect(monthInput).toBeInTheDocument();
    expect(yearInput).toBeInTheDocument();

    expect(nativeInput).toBeInTheDocument();
    expect(nativeInput).toHaveAttribute("name", "dateOfBirth");
  });

  it("allows entering a memorable date", async () => {
    const dateField = renderWithFormProvider(
      <MemorableDateField label="Birthdate" name="dateOfBirth" />,
    );

    await userEvent.tab();
    await userEvent.keyboard("01011970");

    const dayInput = dateField.getByRole("spinbutton", {
      name: "day, Birthdate",
    });
    const monthInput = dateField.getByRole("spinbutton", {
      name: "month, Birthdate",
    });
    const yearInput = dateField.getByRole("spinbutton", {
      name: "year, Birthdate",
    });

    expect(dayInput).toHaveValue(1);
    expect(monthInput).toHaveValue(1);
    expect(yearInput).toHaveValue(1970);
  });

  it("supports optional children", () => {
    const dateField = renderWithFormProvider(
      <MemorableDateField label="Birthdate" name="dateOfBirth">
        <div data-testid="child-component">Additional Info</div>
      </MemorableDateField>,
    );

    const childComponent = dateField.getByTestId("child-component");
    expect(childComponent).toBeInTheDocument();
  });
});
