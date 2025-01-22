import { STATUS } from "@convex/constants";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { StatusSelect } from "./StatusSelect";

describe("StatusSelect", () => {
  it("renders the current status badge", () => {
    const mockOnChange = vi.fn();
    render(<StatusSelect status="inProgress" onChange={mockOnChange} />);

    const statusBadge = screen.getByText(STATUS.inProgress.label);
    expect(statusBadge).toBeInTheDocument();
  });

  it("changes the current status when clicked", async () => {
    const mockOnChange = vi.fn();
    render(<StatusSelect status="inProgress" onChange={mockOnChange} />);

    const triggerButton = screen.getByRole("button");
    await userEvent.click(triggerButton);

    const completedStatusItem = screen.getByLabelText(STATUS.complete.label);
    await userEvent.click(completedStatusItem);

    expect(mockOnChange).toHaveBeenCalledWith("complete");
  });

  it("allows the user to select a new status using the keyboard", async () => {
    const mockOnChange = vi.fn();
    render(<StatusSelect status="inProgress" onChange={mockOnChange} />);

    const triggerButton = screen.getByRole("button");
    await userEvent.click(triggerButton);
    expect(screen.getByRole("menu")).toBeInTheDocument();
    await userEvent.keyboard("[ArrowDown]");
    await userEvent.keyboard("[Enter]");
    expect(mockOnChange).toHaveBeenCalledWith("complete");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
