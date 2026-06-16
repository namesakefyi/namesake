import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Cell, Column, Row, Table, TableBody, TableHeader } from "./Table";

function renderSimpleTable() {
  return render(
    <Table aria-label="Forms">
      <TableHeader>
        <Column isRowHeader>Name</Column>
        <Column>Updated</Column>
      </TableHeader>
      <TableBody>
        <Row id="1">
          <Cell>Court Order</Cell>
          <Cell>January 15, 2025</Cell>
        </Row>
        <Row id="2">
          <Cell>Social Security</Cell>
          <Cell>March 3, 2025</Cell>
        </Row>
      </TableBody>
    </Table>,
  );
}

describe("Table", () => {
  describe("rendering", () => {
    it("renders the table with its accessible name", () => {
      renderSimpleTable();
      expect(screen.getByRole("grid", { name: "Forms" })).toBeInTheDocument();
    });

    it("renders column headers", () => {
      renderSimpleTable();
      expect(
        screen.getByRole("columnheader", { name: "Name" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("columnheader", { name: "Updated" }),
      ).toBeInTheDocument();
    });

    it("renders the correct number of rows (including header)", () => {
      renderSimpleTable();
      expect(screen.getAllByRole("row")).toHaveLength(3);
    });

    it("renders cell content", () => {
      renderSimpleTable();
      expect(
        screen.getByRole("gridcell", { name: "January 15, 2025" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("gridcell", { name: "March 3, 2025" }),
      ).toBeInTheDocument();
    });
  });

  describe("sorting", () => {
    it("sets aria-sort on the active sort column", () => {
      const onSortChange = vi.fn();
      render(
        <Table
          aria-label="Forms"
          sortDescriptor={{ column: "name", direction: "ascending" }}
          onSortChange={onSortChange}
        >
          <TableHeader>
            <Column id="name" isRowHeader allowsSorting>
              Name
            </Column>
          </TableHeader>
          <TableBody>
            <Row id="1">
              <Cell>Court Order</Cell>
            </Row>
          </TableBody>
        </Table>,
      );
      expect(
        screen.getByRole("columnheader", { name: "Name" }),
      ).toHaveAttribute("aria-sort", "ascending");
    });

    it("calls onSortChange when a sortable column header is clicked", async () => {
      const onSortChange = vi.fn();
      render(
        <Table
          aria-label="Forms"
          sortDescriptor={{ column: "name", direction: "ascending" }}
          onSortChange={onSortChange}
        >
          <TableHeader>
            <Column id="name" isRowHeader allowsSorting>
              Name
            </Column>
          </TableHeader>
          <TableBody>
            <Row id="1">
              <Cell>Court Order</Cell>
            </Row>
          </TableBody>
        </Table>,
      );
      await userEvent.click(screen.getByRole("columnheader", { name: "Name" }));
      expect(onSortChange).toHaveBeenCalledOnce();
    });
  });

  describe("selection", () => {
    function renderSelectableTable() {
      return render(
        <Table aria-label="Forms" selectionMode="multiple">
          <TableHeader>
            <Column isRowHeader>Name</Column>
          </TableHeader>
          <TableBody>
            <Row id="1">
              <Cell>Court Order</Cell>
            </Row>
            <Row id="2">
              <Cell>Social Security</Cell>
            </Row>
          </TableBody>
        </Table>,
      );
    }

    it("renders checkboxes in toggle selection mode", () => {
      renderSelectableTable();
      // 1 "select all" checkbox in the header + 1 per row
      expect(screen.getAllByRole("checkbox")).toHaveLength(3);
    });

    it("selects a row when its checkbox is clicked", async () => {
      renderSelectableTable();
      const [, firstRowCheckbox] = screen.getAllByRole("checkbox");
      await userEvent.click(firstRowCheckbox);
      expect(screen.getByRole("row", { name: /Court Order/ })).toHaveAttribute(
        "aria-selected",
        "true",
      );
    });

    it("selects all rows when the header checkbox is clicked", async () => {
      renderSelectableTable();
      const [selectAllCheckbox] = screen.getAllByRole("checkbox");
      await userEvent.click(selectAllCheckbox);
      for (const row of screen.getAllByRole("row", {
        name: /Court Order|Social Security/,
      })) {
        expect(row).toHaveAttribute("aria-selected", "true");
      }
    });
  });
});
