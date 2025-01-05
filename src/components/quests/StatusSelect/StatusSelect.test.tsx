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

  it("renders all statuses when isCore is true", async () => {
    const mockOnChange = vi.fn();
    render(
      <StatusSelect
        status="inProgress"
        isCore={true}
        onChange={mockOnChange}
      />,
    );

    await userEvent.click(screen.getByRole("button"));

    for (const [_, details] of Object.entries(STATUS)) {
      const statusItem = screen.getByRole("menuitemradio", {
        name: details.label,
      });
      expect(statusItem).toBeInTheDocument();
    }
  });

  it("renders a subset of statuses when isCore is false", async () => {
    const mockOnChange = vi.fn();
    render(
      <StatusSelect
        status="inProgress"
        isCore={false}
        onChange={mockOnChange}
      />,
    );

    await userEvent.click(screen.getByRole("button"));

    for (const [_, details] of Object.entries(STATUS)) {
      const statusItem = screen.queryByRole("menuitemradio", {
        name: details.label,
      });

      if (details.isCoreOnly) {
        expect(statusItem).not.toBeInTheDocument();
      } else {
        expect(statusItem).toBeInTheDocument();
      }
    }
  });
});
