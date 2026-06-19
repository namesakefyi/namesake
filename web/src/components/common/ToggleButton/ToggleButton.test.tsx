import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ToggleButtonGroup } from "../ToggleButtonGroup";
import { ToggleButton } from "./ToggleButton";

// ─── ToggleButton ─────────────────────────────────────────────────────────────

describe("ToggleButton", () => {
  it("renders a button with its label", () => {
    render(<ToggleButton>Pin</ToggleButton>);
    expect(screen.getByRole("button", { name: "Pin" })).toBeInTheDocument();
  });

  it("is not pressed by default", () => {
    render(<ToggleButton>Pin</ToggleButton>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
  });

  it("is pressed when defaultSelected is true", () => {
    render(<ToggleButton defaultSelected>Pin</ToggleButton>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("toggles to pressed when clicked", async () => {
    render(<ToggleButton>Pin</ToggleButton>);
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("toggles back to unpressed when clicked again", async () => {
    render(<ToggleButton defaultSelected>Pin</ToggleButton>);
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onChange with the new selected state when toggled", async () => {
    const onChange = vi.fn();
    render(<ToggleButton onChange={onChange}>Pin</ToggleButton>);
    await userEvent.click(screen.getByRole("button"));
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("is disabled when isDisabled is true", () => {
    render(<ToggleButton isDisabled>Pin</ToggleButton>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("does not toggle when disabled", async () => {
    const onChange = vi.fn();
    render(
      <ToggleButton isDisabled onChange={onChange}>
        Pin
      </ToggleButton>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
  });
});

// ─── ToggleButtonGroup ────────────────────────────────────────────────────────

describe("ToggleButtonGroup", () => {
  function renderGroup(groupProps = {}) {
    return render(
      <ToggleButtonGroup {...groupProps}>
        <ToggleButton id="left">Left</ToggleButton>
        <ToggleButton id="center">Center</ToggleButton>
        <ToggleButton id="right">Right</ToggleButton>
      </ToggleButtonGroup>,
    );
  }

  it("renders all buttons", () => {
    renderGroup();
    expect(screen.getByRole("radio", { name: "Left" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Center" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Right" })).toBeInTheDocument();
  });

  it("has no button selected by default", () => {
    renderGroup();
    for (const btn of screen.getAllByRole("radio")) {
      expect(btn).toHaveAttribute("aria-checked", "false");
    }
  });

  it("selects a button when clicked", async () => {
    renderGroup();
    await userEvent.click(screen.getByRole("radio", { name: "Left" }));
    expect(screen.getByRole("radio", { name: "Left" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("pre-selects buttons from defaultSelectedKeys", () => {
    renderGroup({ defaultSelectedKeys: ["center"] });
    expect(screen.getByRole("radio", { name: "Center" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("radio", { name: "Left" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("deselects the previous button when a new one is selected (single mode)", async () => {
    renderGroup({ defaultSelectedKeys: ["left"] });
    await userEvent.click(screen.getByRole("radio", { name: "Right" }));
    expect(screen.getByRole("radio", { name: "Left" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
    expect(screen.getByRole("radio", { name: "Right" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("allows multiple buttons to be selected in multiple mode", async () => {
    // In multiple mode React Aria renders a toolbar with aria-pressed buttons
    renderGroup({ selectionMode: "multiple" });
    await userEvent.click(screen.getByRole("button", { name: "Left" }));
    await userEvent.click(screen.getByRole("button", { name: "Right" }));
    expect(screen.getByRole("button", { name: "Left" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Right" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("calls onSelectionChange when a button is selected", async () => {
    const onSelectionChange = vi.fn();
    renderGroup({ onSelectionChange });
    await userEvent.click(screen.getByRole("radio", { name: "Center" }));
    expect(onSelectionChange).toHaveBeenCalledOnce();
  });
});
