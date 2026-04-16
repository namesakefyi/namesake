import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Tab, TabList, TabPanel, Tabs } from "./Tabs";

// SelectionIndicator (SharedElementTransition) schedules a microtask-based
// state update after the initial render. Wrapping render in act(async) flushes
// those microtasks so they don't fire outside of act and produce warnings.
async function renderTabs(props = {}) {
  await act(async () => {
    render(
      <Tabs {...props}>
        <TabList aria-label="Example tabs">
          <Tab id="overview">Overview</Tab>
          <Tab id="settings">Settings</Tab>
          <Tab id="history">History</Tab>
        </TabList>
        <TabPanel id="overview">Overview content</TabPanel>
        <TabPanel id="settings">Settings content</TabPanel>
        <TabPanel id="history">History content</TabPanel>
      </Tabs>,
    );
  });
}

describe("Tabs", () => {
  describe("rendering", () => {
    it("renders the tablist with its accessible name", async () => {
      await renderTabs();
      expect(
        screen.getByRole("tablist", { name: "Example tabs" }),
      ).toBeInTheDocument();
    });

    it("renders all tab buttons", async () => {
      await renderTabs();
      expect(screen.getByRole("tab", { name: "Overview" })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: "Settings" })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: "History" })).toBeInTheDocument();
    });

    it("renders a tab panel", async () => {
      await renderTabs();
      expect(screen.getByRole("tabpanel")).toBeInTheDocument();
    });
  });

  describe("default selection", () => {
    it("selects the first tab by default", async () => {
      await renderTabs();
      expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
      expect(screen.getByRole("tab", { name: "Settings" })).toHaveAttribute(
        "aria-selected",
        "false",
      );
    });

    it("shows the first panel's content by default", async () => {
      await renderTabs();
      expect(screen.getByRole("tabpanel")).toHaveTextContent(
        "Overview content",
      );
    });

    it("pre-selects a tab from defaultSelectedKey", async () => {
      await renderTabs({ defaultSelectedKey: "history" });
      expect(screen.getByRole("tab", { name: "History" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
      expect(screen.getByRole("tabpanel")).toHaveTextContent("History content");
    });
  });

  describe("interaction", () => {
    it("switches to a tab when it is clicked", async () => {
      await renderTabs();
      await userEvent.click(screen.getByRole("tab", { name: "Settings" }));
      expect(screen.getByRole("tab", { name: "Settings" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
      expect(screen.getByRole("tabpanel")).toHaveTextContent(
        "Settings content",
      );
    });

    it("calls onSelectionChange when a tab is clicked", async () => {
      const onSelectionChange = vi.fn();
      await renderTabs({ onSelectionChange });
      await userEvent.click(screen.getByRole("tab", { name: "History" }));
      expect(onSelectionChange).toHaveBeenCalledWith("history");
    });
  });
});
