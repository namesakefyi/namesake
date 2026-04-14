import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Select, SelectItem } from "./Select";

function renderSelect(props = {}) {
  return render(
    <Select label="Favorite color" {...props}>
      <SelectItem id="red">Red</SelectItem>
      <SelectItem id="green">Green</SelectItem>
      <SelectItem id="blue">Blue</SelectItem>
    </Select>,
  );
}

describe("Select", () => {
  describe("rendering", () => {
    it("renders the label", () => {
      renderSelect();
      expect(screen.getByText("Favorite color")).toBeInTheDocument();
    });

    it("renders the trigger button", () => {
      renderSelect();
      expect(
        screen.getByRole("button", { name: /Favorite color/ }),
      ).toBeInTheDocument();
    });

    it("renders description text when provided", () => {
      renderSelect({ description: "Pick your favorite color" });
      // React Aria duplicates description text (once in a hidden SSR template,
      // once in the live DOM), so use getAllByText and assert presence.
      expect(
        screen.getAllByText("Pick your favorite color").length,
      ).toBeGreaterThan(0);
    });

    it("renders an error message when isInvalid is true", () => {
      renderSelect({ errorMessage: "This field is required", isInvalid: true });
      expect(screen.getByText("This field is required")).toBeInTheDocument();
    });

    it("disables the trigger when isDisabled is true", () => {
      renderSelect({ isDisabled: true });
      expect(
        screen.getByRole("button", { name: /Favorite color/ }),
      ).toBeDisabled();
    });
  });

  describe("interaction", () => {
    it("opens the listbox when the trigger is clicked", async () => {
      renderSelect();
      await userEvent.click(
        screen.getByRole("button", { name: /Favorite color/ }),
      );
      expect(screen.getByRole("listbox")).toBeInTheDocument();
      expect(screen.getByRole("option", { name: "Red" })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: "Green" })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: "Blue" })).toBeInTheDocument();
    });

    it("selects an option and reflects it in the button label", async () => {
      renderSelect();
      await userEvent.click(
        screen.getByRole("button", { name: /Favorite color/ }),
      );
      await userEvent.click(screen.getByRole("option", { name: "Green" }));
      expect(screen.getByRole("button", { name: /Green/ })).toBeInTheDocument();
    });

    it("calls onSelectionChange with the selected key", async () => {
      const onSelectionChange = vi.fn();
      renderSelect({ onSelectionChange });
      await userEvent.click(
        screen.getByRole("button", { name: /Favorite color/ }),
      );
      await userEvent.click(screen.getByRole("option", { name: "Blue" }));
      expect(onSelectionChange).toHaveBeenCalledWith("blue");
    });

    it("does not open the listbox when disabled", async () => {
      renderSelect({ isDisabled: true });
      await userEvent.click(
        screen.getByRole("button", { name: /Favorite color/ }),
      );
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
  });
});
