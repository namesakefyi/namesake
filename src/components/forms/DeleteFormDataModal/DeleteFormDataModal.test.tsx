import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DeleteFormDataModal } from "./DeleteFormDataModal";

// Mock the database module
vi.mock("../../../db/database", () => ({
  clearAllFields: vi.fn().mockResolvedValue(undefined),
  getAllFields: vi.fn().mockResolvedValue([
    { field: "firstName", value: "John" },
    { field: "lastName", value: "Doe" },
  ]),
}));

describe("DeleteFormDataModal", () => {
  it("shows response count when data exists", async () => {
    render(<DeleteFormDataModal />);

    await waitFor(() => {
      expect(screen.getByText(/2 responses/i)).toBeInTheDocument();
    });
  });

  it("shows delete button when data exists", async () => {
    render(<DeleteFormDataModal />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /clear data/i }),
      ).toBeInTheDocument();
    });
  });

  it("shows no data message when no responses exist", async () => {
    const { getAllFields } = await import("../../../db/database");
    vi.mocked(getAllFields).mockResolvedValueOnce([]);

    render(<DeleteFormDataModal />);

    await waitFor(() => {
      expect(screen.getByText(/no form responses/i)).toBeInTheDocument();
    });
  });

  it("hides delete button when no data exists", async () => {
    const { getAllFields } = await import("../../../db/database");
    vi.mocked(getAllFields).mockResolvedValueOnce([]);

    render(<DeleteFormDataModal />);

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: /clear data/i }),
      ).not.toBeInTheDocument();
    });
  });

  it("opens modal when delete button is clicked", async () => {
    const user = userEvent.setup();
    render(<DeleteFormDataModal />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /clear data/i }),
      ).toBeInTheDocument();
    });

    const triggerButton = screen.getByRole("button", {
      name: /clear data/i,
    });
    await user.click(triggerButton);

    expect(
      screen.getByRole("heading", { name: /clear data/i }),
    ).toBeInTheDocument();
  });

  it("shows response count in modal confirmation", async () => {
    const user = userEvent.setup();
    render(<DeleteFormDataModal />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /clear data/i }),
      ).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /clear data/i }));

    expect(screen.getByText(/permanently delete all/i)).toBeInTheDocument();
    expect(screen.getByText(/2 responses/i)).toBeInTheDocument();
  });

  it("closes modal when cancel is clicked", async () => {
    const user = userEvent.setup();
    render(<DeleteFormDataModal />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /clear data/i }),
      ).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /clear data/i }));

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    expect(
      screen.queryByRole("heading", { name: /clear data/i }),
    ).not.toBeInTheDocument();
  });

  it("calls clearAllFields when delete is clicked", async () => {
    const user = userEvent.setup();
    const { clearAllFields } = await import("../../../db/database");

    render(<DeleteFormDataModal />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /clear data/i }),
      ).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /clear data/i }));

    const deleteButton = screen.getByRole("button", {
      name: /clear all data/i,
    });
    await user.click(deleteButton);

    expect(clearAllFields).toHaveBeenCalled();
  });
});
