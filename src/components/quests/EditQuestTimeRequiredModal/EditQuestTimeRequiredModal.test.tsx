import type { Doc, Id } from "@convex/_generated/dataModel";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EditQuestTimeRequiredModal } from "./EditQuestTimeRequiredModal";

// Mock the convex mutation hook
vi.mock("convex/react", () => ({
  useMutation: vi.fn(),
}));

// Mock toast notifications
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("EditQuestTimeRequiredModal", () => {
  const mockQuest = {
    _id: "quest123" as Id<"quests">,
    timeRequired: {
      min: 2,
      max: 4,
      unit: "weeks",
      description: "Depends on court processing time",
    },
  } as Doc<"quests">;

  const mockUpdateTimeRequired = vi.fn();
  const mockOnOpenChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockUpdateTimeRequired,
    );
  });

  it("renders with initial time required values", () => {
    render(
      <EditQuestTimeRequiredModal
        quest={mockQuest}
        open={true}
        onOpenChange={mockOnOpenChange}
      />,
    );

    // Check if modal title is rendered
    expect(screen.getByText("Edit time required")).toBeInTheDocument();

    // Check if time inputs are rendered with correct values
    const minInput = screen
      .getAllByLabelText("Est. min time")[0]
      .closest("input") as HTMLInputElement;
    const maxInput = screen
      .getAllByLabelText("Est. max time")[0]
      .closest("input") as HTMLInputElement;
    expect(minInput.value).toBe("2");
    expect(maxInput.value).toBe("4");

    // Check if unit select is rendered with correct value
    expect(screen.getByLabelText("Unit")).toHaveTextContent("Weeks");

    // Check if description input is rendered with correct value
    const descriptionInput = screen.getByLabelText(
      "Description",
    ) as HTMLInputElement;
    expect(descriptionInput.value).toBe("Depends on court processing time");
  });

  it("handles successful save", async () => {
    const user = userEvent.setup();
    mockUpdateTimeRequired.mockResolvedValueOnce(undefined);

    render(
      <EditQuestTimeRequiredModal
        quest={mockQuest}
        open={true}
        onOpenChange={mockOnOpenChange}
      />,
    );

    // Modify values
    const minInput = screen.getAllByLabelText("Est. min time")[0];
    await user.clear(minInput);
    await user.type(minInput, "3");

    // Submit form
    await user.click(screen.getByText("Save"));

    // Check if mutation was called with correct args
    expect(mockUpdateTimeRequired).toHaveBeenCalledWith({
      timeRequired: {
        min: 3,
        max: 4,
        unit: "weeks",
        description: "Depends on court processing time",
      },
      questId: "quest123",
    });

    // Check if success toast was shown
    expect(toast.success).toHaveBeenCalledWith("Updated time required");

    // Check if modal was closed
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it("handles save failure", async () => {
    const user = userEvent.setup();
    mockUpdateTimeRequired.mockRejectedValueOnce(new Error("Update failed"));

    render(
      <EditQuestTimeRequiredModal
        quest={mockQuest}
        open={true}
        onOpenChange={mockOnOpenChange}
      />,
    );

    await user.click(screen.getByText("Save"));

    expect(toast.error).toHaveBeenCalledWith("Failed to update time required");
    expect(mockOnOpenChange).not.toHaveBeenCalled();
  });

  it("handles cancel", async () => {
    const user = userEvent.setup();

    render(
      <EditQuestTimeRequiredModal
        quest={mockQuest}
        open={true}
        onOpenChange={mockOnOpenChange}
      />,
    );

    // Modify a value then cancel
    const minInput = screen.getAllByLabelText("Est. min time")[0];
    await user.clear(minInput);
    await user.type(minInput, "3");

    await user.click(screen.getByText("Cancel"));

    // Check if modal was closed without saving
    expect(mockUpdateTimeRequired).not.toHaveBeenCalled();
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });
});
