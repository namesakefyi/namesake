import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "../Checkbox";
import { CheckboxGroup } from "./CheckboxGroup";

function renderGroup(groupProps = {}) {
  return render(
    <CheckboxGroup label="Documents" {...groupProps}>
      <Checkbox value="court-order">Court Order</Checkbox>
      <Checkbox value="social-security">Social Security</Checkbox>
      <Checkbox value="passport">Passport</Checkbox>
    </CheckboxGroup>,
  );
}

describe("CheckboxGroup", () => {
  describe("rendering", () => {
    it("renders the group label", () => {
      renderGroup();
      expect(screen.getByText("Documents")).toBeInTheDocument();
    });

    it("renders all checkboxes", () => {
      renderGroup();
      expect(
        screen.getByRole("checkbox", { name: "Court Order" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("checkbox", { name: "Social Security" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("checkbox", { name: "Passport" }),
      ).toBeInTheDocument();
    });

    it("renders description text when provided", () => {
      renderGroup({ description: "Select all that apply" });
      // React Aria duplicates description text in a hidden SSR template
      expect(
        screen.getAllByText("Select all that apply").length,
      ).toBeGreaterThan(0);
    });

    it("renders an error message when isInvalid is true", () => {
      renderGroup({
        errorMessage: "Select at least one document",
        isInvalid: true,
      });
      expect(
        screen.getByText("Select at least one document"),
      ).toBeInTheDocument();
    });
  });

  describe("selection", () => {
    it("pre-selects checkboxes from defaultValue", () => {
      renderGroup({ defaultValue: ["court-order", "passport"] });
      expect(
        screen.getByRole("checkbox", { name: "Court Order" }),
      ).toBeChecked();
      expect(
        screen.getByRole("checkbox", { name: "Social Security" }),
      ).not.toBeChecked();
      expect(screen.getByRole("checkbox", { name: "Passport" })).toBeChecked();
    });

    it("calls onChange with the updated selection when a checkbox is clicked", async () => {
      const onChange = vi.fn();
      renderGroup({ onChange });
      await userEvent.click(
        screen.getByRole("checkbox", { name: "Court Order" }),
      );
      expect(onChange).toHaveBeenCalledWith(["court-order"]);
    });

    it("allows multiple checkboxes to be checked independently", async () => {
      renderGroup();
      await userEvent.click(
        screen.getByRole("checkbox", { name: "Court Order" }),
      );
      await userEvent.click(screen.getByRole("checkbox", { name: "Passport" }));
      expect(
        screen.getByRole("checkbox", { name: "Court Order" }),
      ).toBeChecked();
      expect(
        screen.getByRole("checkbox", { name: "Social Security" }),
      ).not.toBeChecked();
      expect(screen.getByRole("checkbox", { name: "Passport" })).toBeChecked();
    });

    it("unchecks a checked checkbox when clicked again", async () => {
      renderGroup({ defaultValue: ["court-order"] });
      await userEvent.click(
        screen.getByRole("checkbox", { name: "Court Order" }),
      );
      expect(
        screen.getByRole("checkbox", { name: "Court Order" }),
      ).not.toBeChecked();
    });
  });

  describe("disabled state", () => {
    it("disables all checkboxes when isDisabled is true", () => {
      renderGroup({ isDisabled: true });
      for (const checkbox of screen.getAllByRole("checkbox")) {
        expect(checkbox).toBeDisabled();
      }
    });

    it("does not change selection when the group is disabled", async () => {
      renderGroup({ isDisabled: true });
      await userEvent.click(
        screen.getByRole("checkbox", { name: "Court Order" }),
      );
      expect(
        screen.getByRole("checkbox", { name: "Court Order" }),
      ).not.toBeChecked();
    });
  });
});
