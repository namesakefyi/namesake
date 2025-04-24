import { STATUS } from "@convex/constants";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { StatusBadge, StatusSelect } from "./StatusSelect";

describe("StatusSelect", () => {
  it("renders the current status badge", () => {
    const mockOnChange = vi.fn();
    const mockOnRemove = vi.fn();
    render(
      <StatusSelect
        status="inProgress"
        onChange={mockOnChange}
        onRemove={mockOnRemove}
      />,
    );

    const statusBadge = screen.getByText(STATUS.inProgress.label);
    expect(statusBadge).toBeInTheDocument();
  });

  it("changes the current status when clicked", async () => {
    const mockOnChange = vi.fn();
    const mockOnRemove = vi.fn();

    render(
      <StatusSelect
        status="inProgress"
        onChange={mockOnChange}
        onRemove={mockOnRemove}
      />,
    );

    const triggerButton = screen.getByRole("button");
    await userEvent.click(triggerButton);

    const completedStatusItem = screen.getByLabelText(STATUS.complete.label);
    await userEvent.click(completedStatusItem);

    expect(mockOnChange).toHaveBeenCalledWith("complete");
  });

  it("allows the user to select a new status using the keyboard", async () => {
    const mockOnChange = vi.fn();
    const mockOnRemove = vi.fn();
    render(
      <StatusSelect
        status="inProgress"
        onChange={mockOnChange}
        onRemove={mockOnRemove}
      />,
    );

    const triggerButton = screen.getByRole("button");
    await userEvent.click(triggerButton);

    expect(screen.getByRole("menu")).toBeInTheDocument();
    await userEvent.keyboard("[ArrowDown]");
    await userEvent.keyboard("[Enter]");

    expect(mockOnChange).toHaveBeenCalledWith("notStarted");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});

describe("StatusBadge", () => {
  it("renders a condensed badge", () => {
    render(<StatusBadge status="inProgress" condensed />);

    // Should not show the label text directly
    expect(screen.queryByText(STATUS.inProgress.label)).not.toBeInTheDocument();

    // Should show the icon only
    const badge = screen.getByTestId("badge");
    expect(badge).toHaveClass("size-5");
  });

  it("returns null when status is undefined", () => {
    const { container } = render(<StatusBadge status={undefined as any} />);

    expect(container).toBeEmptyDOMElement();
  });
});
