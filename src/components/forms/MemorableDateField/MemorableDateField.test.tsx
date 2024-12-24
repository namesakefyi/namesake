import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { MemorableDateField } from "./MemorableDateField";

describe("MemorableDateField", () => {
  it("renders all memorable date input fields", () => {
    render(<MemorableDateField label="Birthdate" />);

    const birthdateLabel = screen.getByText("Birthdate");
    const dayInput = screen.getByRole("spinbutton", {
      name: "day, Birthdate",
    });
    const monthInput = screen.getByRole("spinbutton", {
      name: "month, Birthdate",
    });
    const yearInput = screen.getByRole("spinbutton", {
      name: "year, Birthdate",
    });

    expect(birthdateLabel).toBeInTheDocument();
    expect(dayInput).toBeInTheDocument();
    expect(monthInput).toBeInTheDocument();
    expect(yearInput).toBeInTheDocument();
  });

  it("allows entering a memorable date", async () => {
    const dateField = render(<MemorableDateField label="Birthdate" />);

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
    render(
      <MemorableDateField label="Birthdate">
        <div data-testid="child-component">Additional Info</div>
      </MemorableDateField>,
    );

    const childComponent = screen.getByTestId("child-component");
    expect(childComponent).toBeInTheDocument();
  });
});
