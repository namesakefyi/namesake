import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithFormProvider, screen } from "../../forms/test-utils";
import { NumberField } from "./NumberField";

describe("NumberField", () => {
  describe("label", () => {
    it("renders the label", () => {
      renderWithFormProvider(<NumberField label="Cookies" />);
      expect(screen.getByText("Cookies")).toBeInTheDocument();
    });
  });

  describe("input", () => {
    it("renders a number input", () => {
      renderWithFormProvider(<NumberField label="Cookies" />);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("displays the default value", () => {
      renderWithFormProvider(<NumberField label="Cookies" defaultValue={5} />);
      expect(screen.getByRole("textbox")).toHaveValue("5");
    });
  });

  describe("increment and decrement buttons", () => {
    it("renders an increment button", () => {
      renderWithFormProvider(<NumberField label="Cookies" />);
      expect(
        screen.getByRole("button", { name: /Increment/ }),
      ).toBeInTheDocument();
    });

    it("renders a decrement button", () => {
      renderWithFormProvider(<NumberField label="Cookies" />);
      expect(
        screen.getByRole("button", { name: /Decrement/ }),
      ).toBeInTheDocument();
    });

    it("increments the value when the increment button is clicked", async () => {
      renderWithFormProvider(<NumberField label="Cookies" defaultValue={5} />);
      await userEvent.click(screen.getByRole("button", { name: /Increment/ }));
      expect(screen.getByRole("textbox")).toHaveValue("6");
    });

    it("decrements the value when the decrement button is clicked", async () => {
      renderWithFormProvider(<NumberField label="Cookies" defaultValue={5} />);
      await userEvent.click(screen.getByRole("button", { name: /Decrement/ }));
      expect(screen.getByRole("textbox")).toHaveValue("4");
    });

    it("does not exceed maxValue when incrementing", async () => {
      renderWithFormProvider(
        <NumberField label="Cookies" defaultValue={10} maxValue={10} />,
      );
      await userEvent.click(screen.getByRole("button", { name: /Increment/ }));
      expect(screen.getByRole("textbox")).toHaveValue("10");
    });

    it("does not go below minValue when decrementing", async () => {
      renderWithFormProvider(
        <NumberField label="Cookies" defaultValue={0} minValue={0} />,
      );
      await userEvent.click(screen.getByRole("button", { name: /Decrement/ }));
      expect(screen.getByRole("textbox")).toHaveValue("0");
    });
  });

  describe("description", () => {
    it("renders description text when provided", () => {
      renderWithFormProvider(
        <NumberField
          label="Cookies"
          description="Enter a number of cookies."
        />,
      );
      expect(
        screen.getByText("Enter a number of cookies."),
      ).toBeInTheDocument();
    });

    it("does not render description when omitted", () => {
      renderWithFormProvider(<NumberField label="Cookies" />);
      expect(
        screen.queryByText("Enter a number of cookies."),
      ).not.toBeInTheDocument();
    });
  });

  describe("error message", () => {
    it("renders a string error message when invalid", () => {
      renderWithFormProvider(
        <NumberField
          label="Cookies"
          isInvalid
          errorMessage="Must be a positive number."
        />,
      );
      expect(
        screen.getByText("Must be a positive number."),
      ).toBeInTheDocument();
    });

    it("renders an error message from a function when invalid", () => {
      renderWithFormProvider(
        <NumberField
          label="Cookies"
          isInvalid
          errorMessage={() => "Computed error."}
        />,
      );
      expect(screen.getByText("Computed error.")).toBeInTheDocument();
    });
  });
});
