import { User } from "@react-aria/test-utils";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GridList, GridListItem } from "./GridList";

const testUtilUser = new User({ interactionType: "mouse" });

function renderGridList(props = {}, itemProps = {}) {
  render(
    <GridList aria-label="Documents" {...props}>
      <GridListItem id="court-order" {...itemProps}>
        Court Order
      </GridListItem>
      <GridListItem id="social-security">Social Security</GridListItem>
      <GridListItem id="passport">Passport</GridListItem>
    </GridList>,
  );
  return testUtilUser.createTester("GridList", {
    root: screen.getByRole("grid"),
  });
}

describe("GridList", () => {
  describe("rendering", () => {
    it("renders the gridlist with its accessible name", () => {
      renderGridList();
      expect(
        screen.getByRole("grid", { name: "Documents" }),
      ).toBeInTheDocument();
    });

    it("renders all items as rows", () => {
      const tester = renderGridList();
      expect(tester.rows).toHaveLength(3);
      expect(
        tester.findRow({ rowIndexOrText: "Court Order" }),
      ).toHaveTextContent("Court Order");
      expect(
        tester.findRow({ rowIndexOrText: "Social Security" }),
      ).toHaveTextContent("Social Security");
      expect(tester.findRow({ rowIndexOrText: "Passport" })).toHaveTextContent(
        "Passport",
      );
    });

    it("renders items by index", () => {
      const tester = renderGridList();
      expect(tester.findRow({ rowIndexOrText: 0 })).toHaveTextContent(
        "Court Order",
      );
    });
  });

  describe("single selection", () => {
    it("selects a row when clicked", async () => {
      const tester = renderGridList({ selectionMode: "single" });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await tester.toggleRowSelection({ row: "Court Order" } as any);
      expect(tester.selectedRows).toHaveLength(1);
      expect(tester.selectedRows[0]).toHaveTextContent("Court Order");
    });

    it("moves selection when a different row is clicked", async () => {
      const tester = renderGridList({
        selectionMode: "single",
        defaultSelectedKeys: ["court-order"],
      });
      expect(tester.selectedRows).toHaveLength(1);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await tester.toggleRowSelection({ row: "Passport" } as any);
      expect(tester.selectedRows).toHaveLength(1);
      expect(tester.selectedRows[0]).toHaveTextContent("Passport");
    });

    it("calls onSelectionChange when a row is selected", async () => {
      const onSelectionChange = vi.fn();
      const tester = renderGridList({
        selectionMode: "single",
        onSelectionChange,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await tester.toggleRowSelection({ row: "Social Security" } as any);
      expect(onSelectionChange).toHaveBeenCalledOnce();
    });
  });

  describe("multiple selection", () => {
    it("renders a checkbox for each row in toggle mode", () => {
      renderGridList({ selectionMode: "multiple" });
      // One checkbox per row in multiple+toggle mode
      expect(screen.getAllByRole("checkbox")).toHaveLength(3);
    });

    it("selects multiple rows independently", async () => {
      const tester = renderGridList({ selectionMode: "multiple" });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await tester.toggleRowSelection({ row: "Court Order" } as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await tester.toggleRowSelection({ row: "Passport" } as any);
      expect(tester.selectedRows).toHaveLength(2);
    });

    it("pre-selects rows from defaultSelectedKeys", () => {
      const tester = renderGridList({
        selectionMode: "multiple",
        defaultSelectedKeys: ["court-order", "social-security"],
      });
      expect(tester.selectedRows).toHaveLength(2);
    });

    it("deselects a row when toggled a second time", async () => {
      const tester = renderGridList({
        selectionMode: "multiple",
        defaultSelectedKeys: ["court-order"],
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await tester.toggleRowSelection({ row: "Court Order" } as any);
      expect(tester.selectedRows).toHaveLength(0);
    });
  });

  describe("row actions", () => {
    it("calls onAction when a row is activated", async () => {
      const onAction = vi.fn();
      const tester = renderGridList({ onAction });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await tester.triggerRowAction({ row: "Social Security" } as any);
      expect(onAction).toHaveBeenCalledWith("social-security");
    });
  });

  describe("disabled items", () => {
    it("marks a disabled item with aria-disabled", () => {
      renderGridList({ disabledKeys: ["social-security"] });
      const row = screen.getByRole("row", { name: "Social Security" });
      expect(row).toHaveAttribute("aria-disabled", "true");
    });

    it("does not select a disabled item when clicked", async () => {
      const tester = renderGridList({
        selectionMode: "single",
        disabledKeys: ["social-security"],
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await tester.toggleRowSelection({ row: "Social Security" } as any);
      expect(tester.selectedRows).toHaveLength(0);
    });
  });
});
