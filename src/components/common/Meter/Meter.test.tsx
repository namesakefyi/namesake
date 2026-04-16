import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Meter } from "./Meter";

describe("Meter", () => {
  it("renders a meter element", () => {
    render(<Meter value={50} label="Storage space" />);
    expect(screen.getByRole("meter")).toBeInTheDocument();
  });

  it("renders the label", () => {
    render(<Meter value={50} label="Storage space" />);
    expect(screen.getByText("Storage space")).toBeInTheDocument();
  });

  it("renders no label text when label is omitted", () => {
    render(<Meter value={50} />);
    // Meter still renders but has no visible label text
    expect(screen.getByRole("meter")).toBeInTheDocument();
    expect(screen.queryByRole("label")).not.toBeInTheDocument();
  });

  it("sets aria-valuenow to the current value", () => {
    render(<Meter value={60} label="Progress" />);
    expect(screen.getByRole("meter")).toHaveAttribute("aria-valuenow", "60");
  });

  it("sets aria-valuemin and aria-valuemax from props", () => {
    render(<Meter value={5} minValue={0} maxValue={10} label="Progress" />);
    const meter = screen.getByRole("meter");
    expect(meter).toHaveAttribute("aria-valuemin", "0");
    expect(meter).toHaveAttribute("aria-valuemax", "10");
  });

  it("defaults aria-valuemin to 0 and aria-valuemax to 100", () => {
    render(<Meter value={40} label="Progress" />);
    const meter = screen.getByRole("meter");
    expect(meter).toHaveAttribute("aria-valuemin", "0");
    expect(meter).toHaveAttribute("aria-valuemax", "100");
  });

  it("sets the fill bar width to the computed percentage", () => {
    render(<Meter value={25} minValue={0} maxValue={100} label="Progress" />);
    const fill = document.querySelector(".fill") as HTMLElement;
    expect(fill.style.width).toBe("25%");
  });

  it("computes the fill width correctly for a non-zero minValue", () => {
    // value=6 on a 0–10 scale → 60%
    render(<Meter value={6} minValue={0} maxValue={10} label="Progress" />);
    const fill = document.querySelector(".fill") as HTMLElement;
    expect(fill.style.width).toBe("60%");
  });

  it("displays the default percentage value text", () => {
    render(<Meter value={75} label="Progress" />);
    expect(document.querySelector(".value")).toHaveTextContent("75%");
  });

  it("displays a custom valueLabel when provided", () => {
    render(
      <Meter value={8} maxValue={10} label="Storage" valueLabel="8 of 10 GB" />,
    );
    expect(document.querySelector(".value")).toHaveTextContent("8 of 10 GB");
  });
});
