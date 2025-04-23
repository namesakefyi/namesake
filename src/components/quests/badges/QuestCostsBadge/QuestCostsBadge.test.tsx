import type { Doc, Id } from "@convex/_generated/dataModel";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EditQuestCostsModal, QuestCostsBadge } from "./QuestCostsBadge";

describe("EditQuestCostsModal", () => {
  const mockQuest = {
    _id: "quest123" as Id<"quests">,
    costs: [
      { cost: 100, description: "Application fee" },
      { cost: 50, description: "Certified copies" },
    ],
  } as Doc<"quests">;

  const mockSetCosts = vi.fn();
  const mockOnOpenChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockSetCosts,
    );
  });

  it("renders with initial costs", () => {
    render(
      <EditQuestCostsModal
        quest={mockQuest}
        open={true}
        onOpenChange={mockOnOpenChange}
      />,
    );

    // Check if modal title is rendered
    expect(screen.getByText("Edit costs")).toBeInTheDocument();

    // Check if cost inputs are rendered with correct values
    const costInputs = screen.getAllByLabelText("Cost") as HTMLInputElement[];
    expect(costInputs).toHaveLength(2);
    expect(costInputs[0].value).toBe("100");
    expect(costInputs[1].value).toBe("50");

    // Check if description inputs are rendered with correct values
    const descriptionInputs = screen.getAllByLabelText(
      "For",
    ) as HTMLInputElement[];
    expect(descriptionInputs).toHaveLength(2);
    expect(descriptionInputs[0].value).toBe("Application fee");
    expect(descriptionInputs[1].value).toBe("Certified copies");
  });

  it("toggles between free and paid costs", async () => {
    const user = userEvent.setup();
    render(
      <EditQuestCostsModal
        quest={mockQuest}
        open={true}
        onOpenChange={mockOnOpenChange}
      />,
    );

    // Toggle to free
    const freeSwitch = screen.getByRole("switch", { name: "Free" });
    await user.click(freeSwitch);

    // Cost inputs should be removed
    expect(screen.queryByLabelText("Cost")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("For")).not.toBeInTheDocument();

    // Toggle back to paid
    await user.click(freeSwitch);
    expect(screen.getByLabelText("Cost")).toBeInTheDocument();
    expect(screen.getByLabelText("For")).toBeInTheDocument();
  });

  it("does not allow negative costs", async () => {
    const user = userEvent.setup();
    render(
      <EditQuestCostsModal
        quest={mockQuest}
        open={true}
        onOpenChange={mockOnOpenChange}
      />,
    );

    // Modify a cost
    const costInputs = screen.getAllByLabelText("Cost") as HTMLInputElement[];
    await user.clear(costInputs[0]);
    await user.type(costInputs[0], "-1");
    expect(costInputs[0].value).toBe("1");
    expect(costInputs[0]).toHaveFocus();
    await user.keyboard("{arrowup}");
    expect(costInputs[0].value).toBe("2");
    await user.keyboard("{arrowdown}{arrowdown}{arrowdown}{arrowdown}");
    expect(costInputs[0].value).toBe("0");
  });

  it("enforces maxLength and maxValue constraints on inputs", async () => {
    const user = userEvent.setup();
    render(
      <EditQuestCostsModal
        quest={mockQuest}
        open={true}
        onOpenChange={mockOnOpenChange}
      />,
    );

    // Test cost field max value (2000)
    const costInputs = screen.getAllByLabelText("Cost") as HTMLInputElement[];
    await user.clear(costInputs[0]);
    await user.type(costInputs[0], "3000");
    await user.click(document.body);
    expect(costInputs[0].value).toBe("2,000");

    // Test description field max length (32 characters)
    const descriptionInputs = screen.getAllByLabelText(
      "For",
    ) as HTMLInputElement[];
    const longDescription =
      "This is a very long description that exceeds the maximum length";
    await user.clear(descriptionInputs[0]);
    await user.type(descriptionInputs[0], longDescription);
    expect(descriptionInputs[0].value.length).toBeLessThanOrEqual(32);
    expect(descriptionInputs[0].maxLength).toBe(32);
  });

  it("adds and removes cost items", async () => {
    const user = userEvent.setup();
    render(
      <EditQuestCostsModal
        quest={mockQuest}
        open={true}
        onOpenChange={mockOnOpenChange}
      />,
    );

    // Add new cost
    await user.click(screen.getByRole("button", { name: "Add cost" }));
    expect(screen.getAllByLabelText("Cost")).toHaveLength(3);

    // Remove a cost
    const removeButtons = screen.getAllByRole("button", { name: "Remove" });
    await user.click(removeButtons[0]);
    expect(screen.getAllByLabelText("Cost")).toHaveLength(2);
  });

  it("saves changes successfully", async () => {
    const user = userEvent.setup();
    mockSetCosts.mockResolvedValueOnce(undefined);

    render(
      <EditQuestCostsModal
        quest={mockQuest}
        open={true}
        onOpenChange={mockOnOpenChange}
      />,
    );

    // Modify a cost
    const costInputs = screen.getAllByLabelText("Cost");
    await user.clear(costInputs[0] as HTMLInputElement);
    await user.type(costInputs[0] as HTMLInputElement, "200");

    // Save changes
    await user.click(screen.getByRole("button", { name: "Save" }));

    // Verify mutation was called
    expect(mockSetCosts).toHaveBeenCalledWith({
      costs: [
        { cost: 200, description: "Application fee" },
        { cost: 50, description: "Certified copies" },
      ],
      questId: mockQuest._id,
    });

    // Verify success toast and modal close
    expect(toast.success).toHaveBeenCalledWith("Updated costs");
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it("handles save failure", async () => {
    const user = userEvent.setup();
    mockSetCosts.mockRejectedValueOnce(new Error("Update failed"));

    render(
      <EditQuestCostsModal
        quest={mockQuest}
        open={true}
        onOpenChange={mockOnOpenChange}
      />,
    );

    // Try to save
    await user.click(screen.getByRole("button", { name: "Save" }));

    // Verify error toast is shown and modal stays open
    expect(toast.error).toHaveBeenCalledWith("Failed to update costs");
    expect(mockOnOpenChange).not.toHaveBeenCalled();

    // Success toast should not be shown
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("cancels editing without saving", async () => {
    const user = userEvent.setup();
    render(
      <EditQuestCostsModal
        quest={mockQuest}
        open={true}
        onOpenChange={mockOnOpenChange}
      />,
    );

    // Modify a cost
    const costInputs = screen.getAllByLabelText("Cost");
    await user.clear(costInputs[0] as HTMLInputElement);
    await user.type(costInputs[0] as HTMLInputElement, "200");

    // Cancel changes
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    // Verify mutation was not called and modal was closed
    expect(mockSetCosts).not.toHaveBeenCalled();
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });
});

describe("QuestCosts", () => {
  const mockQuest = {
    _id: "quest123" as Id<"quests">,
    costs: [
      { cost: 100, description: "Application fee" },
      { cost: 50, description: "Certified copies" },
    ],
  } as Doc<"quests">;

  const mockQuestFree = {
    _id: "quest456" as Id<"quests">,
    costs: [],
  } as Partial<Doc<"quests">>;

  const mockQuestZeroCost = {
    _id: "quest789" as Id<"quests">,
    costs: [
      { cost: 0, description: "Free application" },
      { cost: 0, description: "No filing fee" },
    ],
  } as Doc<"quests">;

  it("displays costs in a description list with total", async () => {
    render(<QuestCostsBadge quest={mockQuest} />);

    // Check if total cost is displayed
    expect(screen.getByText("$150")).toBeInTheDocument();

    // Open the cost breakdown popover
    const popoverTrigger = screen.getByRole("button", {
      name: "See cost breakdown",
    });
    userEvent.click(popoverTrigger);

    // Check if popover is open
    const popover = await screen.findByRole("dialog");
    expect(popover).toBeInTheDocument();

    // Check if costs are displayed in description list
    const descriptions = screen.getAllByRole("term");
    const values = screen.getAllByRole("definition");

    expect(descriptions).toHaveLength(3);
    expect(values).toHaveLength(3);

    // Check individual costs
    expect(descriptions[0]).toHaveTextContent("Application fee");
    expect(values[0]).toHaveTextContent("$100");
    expect(descriptions[1]).toHaveTextContent("Certified copies");
    expect(values[1]).toHaveTextContent("$50");
    expect(descriptions[2]).toHaveTextContent("Total");
    expect(values[2]).toHaveTextContent("$150");
  });

  it("displays 'Free' when there are no costs", () => {
    render(<QuestCostsBadge quest={mockQuestFree as Doc<"quests">} />);
    expect(screen.getByText("Free")).toBeInTheDocument();
  });

  it("displays 'Free' when total cost is 0 but costs array is not empty", () => {
    render(<QuestCostsBadge quest={mockQuestZeroCost} />);
    expect(screen.getByText("Free")).toBeInTheDocument();
  });

  it("shows edit button when editable prop is true", async () => {
    const user = userEvent.setup();
    render(<QuestCostsBadge quest={mockQuest} editable={true} />);

    // Check if edit button is present
    const editButton = screen.getByRole("button", { name: "Edit costs" });
    expect(editButton).toBeInTheDocument();

    // Click edit button and check if modal opens
    user.click(editButton);
    const modal = await screen.findByRole("dialog");
    expect(modal).toBeInTheDocument();
  });

  it("hides edit button when editable prop is false", () => {
    render(<QuestCostsBadge quest={mockQuest} editable={false} />);
    expect(
      screen.queryByRole("button", { name: "Edit costs" }),
    ).not.toBeInTheDocument();
  });
});
