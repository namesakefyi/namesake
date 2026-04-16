import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Switch } from "./Switch";

describe("Switch", () => {
  it("renders its label", () => {
    render(<Switch>Wi-Fi</Switch>);
    expect(screen.getByText("Wi-Fi")).toBeInTheDocument();
  });

  it("has role switch", () => {
    render(<Switch>Wi-Fi</Switch>);
    expect(screen.getByRole("switch", { name: "Wi-Fi" })).toBeInTheDocument();
  });

  it("is unchecked by default", () => {
    render(<Switch>Wi-Fi</Switch>);
    expect(screen.getByRole("switch")).not.toBeChecked();
  });

  it("is checked when defaultSelected is true", () => {
    render(<Switch defaultSelected>Wi-Fi</Switch>);
    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("toggles on when clicked while unchecked", async () => {
    render(<Switch>Wi-Fi</Switch>);
    await userEvent.click(screen.getByRole("switch"));
    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("toggles off when clicked while checked", async () => {
    render(<Switch defaultSelected>Wi-Fi</Switch>);
    await userEvent.click(screen.getByRole("switch"));
    expect(screen.getByRole("switch")).not.toBeChecked();
  });

  it("calls onChange when toggled", async () => {
    const onChange = vi.fn();
    render(<Switch onChange={onChange}>Wi-Fi</Switch>);
    await userEvent.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("is disabled when isDisabled is true", () => {
    render(<Switch isDisabled>Wi-Fi</Switch>);
    expect(screen.getByRole("switch")).toBeDisabled();
  });

  it("does not toggle when disabled", async () => {
    const onChange = vi.fn();
    render(
      <Switch isDisabled onChange={onChange}>
        Wi-Fi
      </Switch>,
    );
    await userEvent.click(screen.getByRole("switch"));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole("switch")).not.toBeChecked();
  });

  it("renders the indicator element", () => {
    render(<Switch>Wi-Fi</Switch>);
    expect(document.querySelector(".indicator")).toBeInTheDocument();
  });
});
