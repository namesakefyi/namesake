import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Radio, RadioGroup } from "./RadioGroup";

function renderGroup(groupProps = {}) {
  return render(
    <RadioGroup label="Preferred contact" {...groupProps}>
      <Radio value="email">Email</Radio>
      <Radio value="phone">Phone</Radio>
      <Radio value="mail">Mail</Radio>
    </RadioGroup>,
  );
}

describe("RadioGroup", () => {
  describe("rendering", () => {
    it("renders the group label", () => {
      renderGroup();
      expect(screen.getByText("Preferred contact")).toBeInTheDocument();
    });

    it("renders all radio options", () => {
      renderGroup();
      expect(screen.getByRole("radio", { name: "Email" })).toBeInTheDocument();
      expect(screen.getByRole("radio", { name: "Phone" })).toBeInTheDocument();
      expect(screen.getByRole("radio", { name: "Mail" })).toBeInTheDocument();
    });

    it("renders a radiogroup element", () => {
      renderGroup();
      expect(
        screen.getByRole("radiogroup", { name: "Preferred contact" }),
      ).toBeInTheDocument();
    });

    it("renders all options as unselected by default", () => {
      renderGroup();
      for (const radio of screen.getAllByRole("radio")) {
        expect(radio).not.toBeChecked();
      }
    });

    it("renders description text when provided", () => {
      renderGroup({ description: "We will only use this to contact you" });
      // React Aria duplicates description text in a hidden SSR template
      expect(
        screen.getAllByText("We will only use this to contact you").length,
      ).toBeGreaterThan(0);
    });

    it("renders an error message when isInvalid is true", () => {
      renderGroup({
        errorMessage: "Please select a contact method",
        isInvalid: true,
      });
      expect(
        screen.getByText("Please select a contact method"),
      ).toBeInTheDocument();
    });
  });

  describe("selection", () => {
    it("pre-selects an option from defaultValue", () => {
      renderGroup({ defaultValue: "phone" });
      expect(screen.getByRole("radio", { name: "Phone" })).toBeChecked();
      expect(screen.getByRole("radio", { name: "Email" })).not.toBeChecked();
      expect(screen.getByRole("radio", { name: "Mail" })).not.toBeChecked();
    });

    it("selects a radio when clicked", async () => {
      renderGroup();
      await userEvent.click(screen.getByRole("radio", { name: "Email" }));
      expect(screen.getByRole("radio", { name: "Email" })).toBeChecked();
    });

    it("moves selection when a different radio is clicked", async () => {
      renderGroup({ defaultValue: "email" });
      await userEvent.click(screen.getByRole("radio", { name: "Phone" }));
      expect(screen.getByRole("radio", { name: "Email" })).not.toBeChecked();
      expect(screen.getByRole("radio", { name: "Phone" })).toBeChecked();
    });

    it("calls onChange with the selected value", async () => {
      const onChange = vi.fn();
      renderGroup({ onChange });
      await userEvent.click(screen.getByRole("radio", { name: "Mail" }));
      expect(onChange).toHaveBeenCalledWith("mail");
    });
  });

  describe("disabled state", () => {
    it("disables all radios when the group is disabled", () => {
      renderGroup({ isDisabled: true });
      for (const radio of screen.getAllByRole("radio")) {
        expect(radio).toBeDisabled();
      }
    });

    it("does not change selection when the group is disabled", async () => {
      renderGroup({ isDisabled: true });
      await userEvent.click(screen.getByRole("radio", { name: "Email" }));
      expect(screen.getByRole("radio", { name: "Email" })).not.toBeChecked();
    });

    it("disables only the specified radio via isDisabled on Radio", () => {
      render(
        <RadioGroup label="Preferred contact">
          <Radio value="email">Email</Radio>
          <Radio value="phone" isDisabled>
            Phone
          </Radio>
          <Radio value="mail">Mail</Radio>
        </RadioGroup>,
      );
      expect(screen.getByRole("radio", { name: "Phone" })).toBeDisabled();
      expect(screen.getByRole("radio", { name: "Email" })).not.toBeDisabled();
      expect(screen.getByRole("radio", { name: "Mail" })).not.toBeDisabled();
    });
  });
});
