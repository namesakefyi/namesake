import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ListBox, ListBoxItem, ListBoxSection } from "./ListBox";

function renderListBox(props = {}) {
  return render(
    <ListBox aria-label="Documents" selectionMode="single" {...props}>
      <ListBoxItem id="court-order">Court Order</ListBoxItem>
      <ListBoxItem id="social-security">Social Security</ListBoxItem>
      <ListBoxItem id="passport">Passport</ListBoxItem>
    </ListBox>,
  );
}

describe("ListBox", () => {
  describe("rendering", () => {
    it("renders a listbox with its accessible name", () => {
      renderListBox();
      expect(
        screen.getByRole("listbox", { name: "Documents" }),
      ).toBeInTheDocument();
    });

    it("renders all items as options", () => {
      renderListBox();
      expect(
        screen.getByRole("option", { name: "Court Order" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("option", { name: "Social Security" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("option", { name: "Passport" }),
      ).toBeInTheDocument();
    });

    it("renders items as unselected by default", () => {
      renderListBox();
      for (const option of screen.getAllByRole("option")) {
        expect(option).toHaveAttribute("aria-selected", "false");
      }
    });
  });

  describe("single selection", () => {
    it("selects an item when clicked", async () => {
      renderListBox();
      await userEvent.click(
        screen.getByRole("option", { name: "Court Order" }),
      );
      expect(
        screen.getByRole("option", { name: "Court Order" }),
      ).toHaveAttribute("aria-selected", "true");
    });

    it("pre-selects an item from defaultSelectedKeys", () => {
      renderListBox({ defaultSelectedKeys: ["court-order"] });
      expect(
        screen.getByRole("option", { name: "Court Order" }),
      ).toHaveAttribute("aria-selected", "true");
      expect(
        screen.getByRole("option", { name: "Social Security" }),
      ).toHaveAttribute("aria-selected", "false");
    });

    it("moves selection to a new item when clicked", async () => {
      renderListBox({ defaultSelectedKeys: ["court-order"] });
      await userEvent.click(
        screen.getByRole("option", { name: "Social Security" }),
      );
      expect(
        screen.getByRole("option", { name: "Court Order" }),
      ).toHaveAttribute("aria-selected", "false");
      expect(
        screen.getByRole("option", { name: "Social Security" }),
      ).toHaveAttribute("aria-selected", "true");
    });

    it("calls onSelectionChange when an item is clicked", async () => {
      const onSelectionChange = vi.fn();
      renderListBox({ onSelectionChange });
      await userEvent.click(screen.getByRole("option", { name: "Passport" }));
      expect(onSelectionChange).toHaveBeenCalledOnce();
    });
  });

  describe("multiple selection", () => {
    it("allows several items to be selected independently", async () => {
      renderListBox({ selectionMode: "multiple" });
      await userEvent.click(
        screen.getByRole("option", { name: "Court Order" }),
      );
      await userEvent.click(screen.getByRole("option", { name: "Passport" }));
      expect(
        screen.getByRole("option", { name: "Court Order" }),
      ).toHaveAttribute("aria-selected", "true");
      expect(
        screen.getByRole("option", { name: "Social Security" }),
      ).toHaveAttribute("aria-selected", "false");
      expect(screen.getByRole("option", { name: "Passport" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
    });

    it("pre-selects multiple items from defaultSelectedKeys", () => {
      renderListBox({
        selectionMode: "multiple",
        defaultSelectedKeys: ["court-order", "passport"],
      });
      expect(
        screen.getByRole("option", { name: "Court Order" }),
      ).toHaveAttribute("aria-selected", "true");
      expect(
        screen.getByRole("option", { name: "Social Security" }),
      ).toHaveAttribute("aria-selected", "false");
      expect(screen.getByRole("option", { name: "Passport" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
    });

    it("deselects an item when clicked a second time", async () => {
      renderListBox({
        selectionMode: "multiple",
        defaultSelectedKeys: ["court-order"],
      });
      await userEvent.click(
        screen.getByRole("option", { name: "Court Order" }),
      );
      expect(
        screen.getByRole("option", { name: "Court Order" }),
      ).toHaveAttribute("aria-selected", "false");
    });
  });

  describe("disabled items", () => {
    it("marks a disabled item with aria-disabled", () => {
      renderListBox({ disabledKeys: ["social-security"] });
      expect(
        screen.getByRole("option", { name: "Social Security" }),
      ).toHaveAttribute("aria-disabled", "true");
    });

    it("does not select a disabled item when clicked", async () => {
      renderListBox({ disabledKeys: ["social-security"] });
      await userEvent.click(
        screen.getByRole("option", { name: "Social Security" }),
      );
      expect(
        screen.getByRole("option", { name: "Social Security" }),
      ).toHaveAttribute("aria-selected", "false");
    });
  });

  describe("ListBoxSection", () => {
    it("renders items within named sections", () => {
      render(
        <ListBox aria-label="Documents" selectionMode="single">
          <ListBoxSection aria-label="Federal">
            <ListBoxItem id="passport">Passport</ListBoxItem>
            <ListBoxItem id="social-security">Social Security</ListBoxItem>
          </ListBoxSection>
          <ListBoxSection aria-label="State">
            <ListBoxItem id="drivers-license">Driver's License</ListBoxItem>
          </ListBoxSection>
        </ListBox>,
      );
      expect(
        screen.getByRole("option", { name: "Passport" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("option", { name: "Social Security" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("option", { name: "Driver's License" }),
      ).toBeInTheDocument();
    });

    it("groups items under their section's accessible name", () => {
      render(
        <ListBox aria-label="Documents" selectionMode="single">
          <ListBoxSection aria-label="Federal">
            <ListBoxItem id="passport">Passport</ListBoxItem>
          </ListBoxSection>
          <ListBoxSection aria-label="State">
            <ListBoxItem id="drivers-license">Driver's License</ListBoxItem>
          </ListBoxSection>
        </ListBox>,
      );
      expect(
        screen.getByRole("group", { name: "Federal" }),
      ).toBeInTheDocument();
      expect(screen.getByRole("group", { name: "State" })).toBeInTheDocument();
    });
  });
});
