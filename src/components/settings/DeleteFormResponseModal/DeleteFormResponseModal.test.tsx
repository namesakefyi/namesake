import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { ALL } from "@convex/constants";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useMutation } from "convex/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DeleteFormResponseModal } from "./DeleteFormResponseModal";

vi.mock("@convex/_generated/api", () => ({
  api: {
    userFormResponses: {
      deleteAll: { _name: "userFormResponses:deleteAll" },
      deleteByIds: { _name: "userFormResponses:deleteByIds" },
    },
  },
}));

describe("DeleteFormResponseModal", () => {
  const mockRows = [
    {
      id: "1" as Id<"userFormResponses">,
      field: "firstName",
      value: "encrypted_value_1",
    },
    {
      id: "2" as Id<"userFormResponses">,
      field: "middleName",
      value: "encrypted_value_2",
    },
    {
      id: "3" as Id<"userFormResponses">,
      field: "lastName",
      value: "encrypted_value_3",
    },
  ];

  const mockDeleteAll = vi.fn().mockResolvedValue(undefined);
  const mockDeleteByIds = vi.fn().mockResolvedValue(undefined);
  const mockOnOpenChange = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock useMutation
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (mutation: any) => {
        if (mutation === api.userFormResponses.deleteAll) return mockDeleteAll;
        if (mutation === api.userFormResponses.deleteByIds)
          return mockDeleteByIds;
        return vi.fn();
      },
    );
  });

  it("renders the modal with correct title when deleting specific items", () => {
    const selectedRows = new Set(["1"]);

    render(
      <DeleteFormResponseModal
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onDelete={mockOnDelete}
        selectedRows={selectedRows}
        rows={mockRows}
      />,
    );

    expect(screen.getByText("Delete 1 response?")).toBeInTheDocument();
    expect(
      screen.getByText("The following responses will be deleted:"),
    ).toBeInTheDocument();
    expect(screen.getByText("firstName")).toBeInTheDocument();
    expect(screen.getByText("This cannot be undone.")).toBeInTheDocument();
  });

  it("renders the modal with correct title when deleting all items", () => {
    render(
      <DeleteFormResponseModal
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onDelete={mockOnDelete}
        selectedRows={ALL}
        rows={mockRows}
      />,
    );

    expect(screen.getByText("Delete all responses?")).toBeInTheDocument();
    expect(
      screen.queryByText("The following responses will be deleted:"),
    ).not.toBeInTheDocument();
    expect(screen.getByText("This cannot be undone.")).toBeInTheDocument();
  });

  it("lists all selected items to be deleted", () => {
    const selectedRows = new Set(["1", "3"]);

    render(
      <DeleteFormResponseModal
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onDelete={mockOnDelete}
        selectedRows={selectedRows}
        rows={mockRows}
      />,
    );

    expect(screen.getByText("firstName")).toBeInTheDocument();
    expect(screen.getByText("lastName")).toBeInTheDocument();
    expect(screen.queryByText("middleName")).not.toBeInTheDocument();
  });

  it("calls deleteAll when deleting all items", async () => {
    const user = userEvent.setup();

    render(
      <DeleteFormResponseModal
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onDelete={mockOnDelete}
        selectedRows={ALL}
        rows={mockRows}
      />,
    );

    const deleteButton = screen.getByRole("button", {
      name: "Delete all responses",
    });
    await user.click(deleteButton);

    // Wait longer and be more specific with the expectation
    await waitFor(() => expect(mockDeleteAll).toHaveBeenCalled(), {
      timeout: 2000,
    });

    expect(mockDeleteByIds).not.toHaveBeenCalled();
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    expect(mockOnDelete).toHaveBeenCalled();
  });

  it("calls deleteByIds with correct IDs when deleting specific items", async () => {
    const user = userEvent.setup();
    const selectedRows = new Set(["1", "3"]);

    render(
      <DeleteFormResponseModal
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onDelete={mockOnDelete}
        selectedRows={selectedRows}
        rows={mockRows}
      />,
    );

    const deleteButton = screen.getByRole("button", {
      name: "Delete 2 responses",
    });
    await user.click(deleteButton);

    // Wait longer and be more specific with the expectation
    await waitFor(
      () =>
        expect(mockDeleteByIds).toHaveBeenCalledWith({
          userFormResponseIds: ["1", "3"],
        }),
      { timeout: 2000 },
    );

    expect(mockDeleteAll).not.toHaveBeenCalled();
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    expect(mockOnDelete).toHaveBeenCalled();
  });

  it("shows error message when deletion fails", async () => {
    const user = userEvent.setup();
    const errorMessage = "Failed to delete data";
    mockDeleteByIds.mockRejectedValueOnce(new Error(errorMessage));

    render(
      <DeleteFormResponseModal
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onDelete={mockOnDelete}
        selectedRows={new Set(["1"])}
        rows={mockRows}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Delete 1 response" }));

    await waitFor(
      () => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      },
      { timeout: 2000 },
    );

    expect(mockOnOpenChange).not.toHaveBeenCalled();
    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  it("closes the modal when cancel is clicked", async () => {
    const user = userEvent.setup();

    render(
      <DeleteFormResponseModal
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onDelete={mockOnDelete}
        selectedRows={new Set(["1"])}
        rows={mockRows}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    expect(mockDeleteAll).not.toHaveBeenCalled();
    expect(mockDeleteByIds).not.toHaveBeenCalled();
    expect(mockOnDelete).not.toHaveBeenCalled();
  });
});
