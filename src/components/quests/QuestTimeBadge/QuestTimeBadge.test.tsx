import type { Doc, Id } from "@convex/_generated/dataModel";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QuestTimeBadge } from "./QuestTimeBadge";

describe("QuestTimeBadge", () => {
  const mockQuest = {
    _id: "quest123" as Id<"quests">,
    timeRequired: {
      min: 2,
      max: 4,
      unit: "weeks",
      description: "Processing time varies by court",
    },
  } as Doc<"quests">;

  const mockQuestNoDescription = {
    _id: "quest456" as Id<"quests">,
    timeRequired: {
      min: 1,
      max: 3,
      unit: "months",
    },
  } as Doc<"quests">;

  const mockQuestNoTimeRequired = {
    _id: "quest789" as Id<"quests">,
  } as Doc<"quests">;

  const mockSetTimeRequired = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockSetTimeRequired,
    );
  });

  it("returns null when quest is undefined", () => {
    const { container } = render(
      <QuestTimeBadge quest={undefined as unknown as Doc<"quests">} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("formats and displays time required correctly", () => {
    render(<QuestTimeBadge quest={mockQuest} />);
    expect(screen.getByText("2–4 weeks")).toBeInTheDocument();
  });

  it("displays 'Unknown' when timeRequired is not set", () => {
    render(<QuestTimeBadge quest={mockQuestNoTimeRequired} />);
    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });

  it("does not show description popover when description is not available", () => {
    render(<QuestTimeBadge quest={mockQuestNoDescription} />);
    expect(
      screen.queryByRole("button", { name: "See details" }),
    ).not.toBeInTheDocument();
  });

  it("shows edit button when editable prop is true", async () => {
    const user = userEvent.setup();
    render(<QuestTimeBadge quest={mockQuest} editable={true} />);

    // Check if edit button is present
    const editButton = screen.getByRole("button", {
      name: "Edit time required",
    });
    expect(editButton).toBeInTheDocument();

    // Click edit button and check if popover opens
    await user.click(editButton);
    const popover = await screen.findByRole("dialog");
    expect(popover).toBeInTheDocument();
  });

  it("hides edit button when editable prop is false", () => {
    render(<QuestTimeBadge quest={mockQuest} editable={false} />);
    expect(
      screen.queryByRole("button", { name: "Edit time required" }),
    ).not.toBeInTheDocument();
  });

  it("renders with initial time required values", async () => {
    const user = userEvent.setup();
    render(<QuestTimeBadge quest={mockQuest} editable={true} />);

    await user.click(
      screen.getByRole("button", { name: "Edit time required" }),
    );

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
    expect(descriptionInput.value).toBe("Processing time varies by court");
  });

  it("updates max time value", async () => {
    const user = userEvent.setup();
    mockSetTimeRequired.mockResolvedValueOnce(undefined);

    render(<QuestTimeBadge quest={mockQuest} editable={true} />);

    await user.click(
      screen.getByRole("button", { name: "Edit time required" }),
    );

    const maxInput = screen
      .getAllByLabelText("Est. max time")[0]
      .closest("input") as HTMLInputElement;

    await user.clear(maxInput);
    await user.type(maxInput, "6");

    await user.click(screen.getByText("Save"));

    expect(mockSetTimeRequired).toHaveBeenCalledWith({
      timeRequired: {
        min: 2,
        max: 6,
        unit: "weeks",
        description: "Processing time varies by court",
      },
      questId: "quest123",
    });
  });

  it("updates time unit", async () => {
    const user = userEvent.setup();
    mockSetTimeRequired.mockResolvedValueOnce(undefined);

    render(<QuestTimeBadge quest={mockQuest} editable={true} />);

    await user.click(
      screen.getByRole("button", { name: "Edit time required" }),
    );

    const descriptionInput = screen.getByLabelText("Description");
    await user.clear(descriptionInput);
    await user.type(descriptionInput, "New description");

    await user.click(screen.getByText("Save"));

    expect(mockSetTimeRequired).toHaveBeenCalledWith({
      timeRequired: {
        min: 2,
        max: 4,
        unit: "weeks",
        description: "New description",
      },
      questId: "quest123",
    });
  });

  it("sets description to undefined when empty", async () => {
    const user = userEvent.setup();
    mockSetTimeRequired.mockResolvedValueOnce(undefined);

    render(<QuestTimeBadge quest={mockQuest} editable={true} />);

    await user.click(
      screen.getByRole("button", { name: "Edit time required" }),
    );

    const descriptionInput = screen.getByLabelText("Description");
    await user.clear(descriptionInput);

    await user.click(screen.getByText("Save"));

    expect(mockSetTimeRequired).toHaveBeenCalledWith({
      timeRequired: {
        min: 2,
        max: 4,
        unit: "weeks",
        description: undefined,
      },
      questId: "quest123",
    });
  });

  it("handles successful save", async () => {
    const user = userEvent.setup();
    mockSetTimeRequired.mockResolvedValueOnce(undefined);

    render(<QuestTimeBadge quest={mockQuest} editable={true} />);

    await user.click(
      screen.getByRole("button", { name: "Edit time required" }),
    );

    // Modify values
    const minInput = screen.getAllByLabelText("Est. min time")[0];
    await user.clear(minInput);
    await user.type(minInput, "3");

    // Submit form
    await user.click(screen.getByText("Save"));

    // Check if mutation was called with correct args
    expect(mockSetTimeRequired).toHaveBeenCalledWith({
      timeRequired: {
        min: 3,
        max: 4,
        unit: "weeks",
        description: "Processing time varies by court",
      },
      questId: "quest123",
    });

    // Check if popover was closed
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("displays error when required fields are missing", async () => {
    const user = userEvent.setup();

    render(<QuestTimeBadge quest={mockQuest} editable={true} />);

    await user.click(
      screen.getByRole("button", { name: "Edit time required" }),
    );

    // Clear required fields
    const minInput = screen.getAllByLabelText("Est. min time")[0];
    await user.clear(minInput);
    const maxInput = screen.getAllByLabelText("Est. max time")[0];
    await user.clear(maxInput);

    await user.click(screen.getByText("Save"));

    expect(mockSetTimeRequired).not.toHaveBeenCalled();
    expect(minInput).toHaveAttribute("aria-invalid", "true");
    expect(maxInput).toHaveAttribute("aria-invalid", "true");
  });

  it("handles save failure", async () => {
    const user = userEvent.setup();

    // Mock server error
    mockSetTimeRequired.mockRejectedValueOnce(new Error("Update failed"));

    render(<QuestTimeBadge quest={mockQuest} editable={true} />);

    await user.click(
      screen.getByRole("button", { name: "Edit time required" }),
    );

    await user.click(screen.getByText("Save"));

    expect(toast.error).toHaveBeenCalledWith("Failed to update time required");
  });

  it("handles cancel", async () => {
    const user = userEvent.setup();

    render(<QuestTimeBadge quest={mockQuest} editable={true} />);

    await user.click(
      screen.getByRole("button", { name: "Edit time required" }),
    );

    // Modify a value then cancel
    const minInput = screen.getAllByLabelText("Est. min time")[0];
    await user.clear(minInput);
    await user.type(minInput, "3");

    await user.click(screen.getByText("Cancel"));

    // Check if popover was closed without saving
    expect(mockSetTimeRequired).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
