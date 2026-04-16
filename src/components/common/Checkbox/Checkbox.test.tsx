import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  describe("rendering", () => {
    it("renders with the label prop", () => {
      render(<Checkbox label="Save progress" />);
      expect(
        screen.getByRole("checkbox", { name: "Save progress" }),
      ).toBeInTheDocument();
    });

    it("renders with children as the label", () => {
      render(<Checkbox>Save progress</Checkbox>);
      expect(
        screen.getByRole("checkbox", { name: "Save progress" }),
      ).toBeInTheDocument();
    });

    it("is unchecked by default", () => {
      render(<Checkbox label="Save progress" />);
      expect(screen.getByRole("checkbox")).not.toBeChecked();
    });

    it("is checked when defaultSelected is true", () => {
      render(<Checkbox label="Save progress" defaultSelected />);
      expect(screen.getByRole("checkbox")).toBeChecked();
    });

    it("marks the checkbox as invalid when isInvalid is true", () => {
      render(<Checkbox label="Save progress" isInvalid />);
      expect(screen.getByRole("checkbox")).toHaveAttribute(
        "aria-invalid",
        "true",
      );
    });
  });

  describe("SVG indicator", () => {
    it("renders a polyline (checkmark) when not indeterminate", () => {
      const { container } = render(<Checkbox label="Select all" />);
      expect(container.querySelector("svg polyline")).toBeInTheDocument();
      expect(container.querySelector("svg rect")).not.toBeInTheDocument();
    });

    it("renders a rect (dash) when isIndeterminate is true", () => {
      const { container } = render(
        <Checkbox label="Select all" isIndeterminate />,
      );
      expect(container.querySelector("svg rect")).toBeInTheDocument();
      expect(container.querySelector("svg polyline")).not.toBeInTheDocument();
    });
  });

  describe("interaction", () => {
    it("toggles to checked when clicked", async () => {
      render(<Checkbox label="Save progress" />);
      await userEvent.click(screen.getByRole("checkbox"));
      expect(screen.getByRole("checkbox")).toBeChecked();
    });

    it("toggles back to unchecked when clicked again", async () => {
      render(<Checkbox label="Save progress" defaultSelected />);
      await userEvent.click(screen.getByRole("checkbox"));
      expect(screen.getByRole("checkbox")).not.toBeChecked();
    });

    it("calls onChange with the new checked state", async () => {
      const onChange = vi.fn();
      render(<Checkbox label="Save progress" onChange={onChange} />);
      await userEvent.click(screen.getByRole("checkbox"));
      expect(onChange).toHaveBeenCalledWith(true);
    });
  });

  describe("disabled state", () => {
    it("renders as disabled", () => {
      render(<Checkbox label="Save progress" isDisabled />);
      expect(screen.getByRole("checkbox")).toBeDisabled();
    });

    it("does not toggle when disabled", async () => {
      render(<Checkbox label="Save progress" isDisabled />);
      await userEvent.click(screen.getByRole("checkbox"));
      expect(screen.getByRole("checkbox")).not.toBeChecked();
    });
  });
});
