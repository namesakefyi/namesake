import type { Doc, Id } from "@convex/_generated/dataModel";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QuestCostsBadge } from "./QuestCostsBadge";

describe("QuestCostsBadge", () => {
  const mockQuest = {
    _id: "quest123" as Id<"quests">,
    _creationTime: 1234567890,
    title: "Test Quest",
    creationUser: "user123" as Id<"users">,
    slug: "test-quest",
    updatedAt: 1234567890,
    costs: [
      { cost: 100, description: "Application fee", isRequired: true },
      { cost: 50, description: "Certified copies", isRequired: true },
    ],
  } as Doc<"quests">;

  const mockQuestFree = {
    _id: "quest456" as Id<"quests">,
    _creationTime: 1234567890,
    title: "Free Quest",
    creationUser: "user123" as Id<"users">,
    slug: "free-quest",
    updatedAt: 1234567890,
    costs: [],
  } as Doc<"quests">;

  const mockQuestZeroCost = {
    _id: "quest789" as Id<"quests">,
    _creationTime: 1234567890,
    title: "Zero Cost Quest",
    creationUser: "user123" as Id<"users">,
    slug: "zero-cost-quest",
    updatedAt: 1234567890,
    costs: [
      { cost: 0, description: "Free application", isRequired: true },
      { cost: 0, description: "No filing fee", isRequired: true },
    ],
  } as Doc<"quests">;

  const mockQuestWithOptionalCosts = {
    _id: "quest234" as Id<"quests">,
    _creationTime: 1234567890,
    title: "Quest With Optional Costs",
    creationUser: "user123" as Id<"users">,
    slug: "quest-with-optional-costs",
    updatedAt: 1234567890,
    costs: [
      { cost: 100, description: "Application fee", isRequired: true },
      { cost: 50, description: "Certified copies", isRequired: true },
      { cost: 75, description: "Expedited processing", isRequired: false },
      { cost: 25, description: "Optional notary", isRequired: false },
    ],
  } as Doc<"quests">;

  const mockSetCosts = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockSetCosts,
    );
  });

  it("returns null when quest is undefined", () => {
    const { container } = render(
      <QuestCostsBadge quest={undefined as unknown as Doc<"quests">} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("displays 'Free' when there are no costs", () => {
    render(<QuestCostsBadge quest={mockQuestFree} />);
    expect(screen.getByText("Free")).toBeInTheDocument();
  });

  it("displays 'Free' when total cost is 0 but costs array is not empty", () => {
    render(<QuestCostsBadge quest={mockQuestZeroCost} />);
    expect(screen.getByText("Free")).toBeInTheDocument();
  });

  it("formats and displays costs correctly with only required costs", () => {
    render(<QuestCostsBadge quest={mockQuest} />);
    expect(screen.getByText("$150")).toBeInTheDocument();
  });

  it("formats and displays costs correctly with optional costs", () => {
    render(<QuestCostsBadge quest={mockQuestWithOptionalCosts} />);
    expect(screen.getByText("$150–$250")).toBeInTheDocument();
  });

  it("shows cost breakdown in tooltip with optional costs", async () => {
    const user = userEvent.setup();
    render(<QuestCostsBadge quest={mockQuestWithOptionalCosts} />);

    await user.click(screen.getByRole("button", { name: "Cost details" }));

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    // Check if costs are displayed in description list
    const descriptions = screen.getAllByRole("term");
    const values = screen.getAllByRole("definition");

    expect(descriptions).toHaveLength(5); // 4 items + total
    expect(values).toHaveLength(5);

    // Check individual costs
    expect(descriptions[0]).toHaveTextContent("Application fee");
    expect(values[0]).toHaveTextContent("$100");
    expect(descriptions[1]).toHaveTextContent("Certified copies");
    expect(values[1]).toHaveTextContent("$50");
    expect(descriptions[2]).toHaveTextContent("Expedited processing");
    expect(values[2]).toHaveTextContent("$75");
    expect(descriptions[3]).toHaveTextContent("Optional notary");
    expect(values[3]).toHaveTextContent("$25");
    expect(descriptions[4]).toHaveTextContent("Total");
    expect(values[4]).toHaveTextContent("$150–$250");
  });

  it("shows edit button when editable prop is true", async () => {
    const user = userEvent.setup();
    render(<QuestCostsBadge quest={mockQuest} editable={true} />);

    const editButton = screen.getByRole("button", { name: "Edit costs" });
    expect(editButton).toBeInTheDocument();

    await user.click(editButton);
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();
  });

  it("hides edit button when editable prop is false", () => {
    render(<QuestCostsBadge quest={mockQuest} editable={false} />);
    expect(
      screen.queryByRole("button", { name: "Edit costs" }),
    ).not.toBeInTheDocument();
  });

  it("renders edit form with initial costs", async () => {
    const user = userEvent.setup();
    render(<QuestCostsBadge quest={mockQuest} editable={true} />);

    await user.click(screen.getByRole("button", { name: "Edit costs" }));

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

  it("adds and removes cost items", async () => {
    const user = userEvent.setup();
    render(<QuestCostsBadge quest={mockQuest} editable={true} />);

    await user.click(screen.getByRole("button", { name: "Edit costs" }));

    // Add new cost
    await user.click(screen.getByRole("button", { name: "Add cost" }));
    expect(screen.getAllByLabelText("Cost")).toHaveLength(3);

    // Remove a cost
    const removeButtons = screen.getAllByRole("button", { name: "Remove" });
    await user.click(removeButtons[0]);
    expect(screen.getAllByLabelText("Cost")).toHaveLength(2);
  });

  it("enforces input constraints", async () => {
    const user = userEvent.setup();
    render(<QuestCostsBadge quest={mockQuest} editable={true} />);

    await user.click(screen.getByRole("button", { name: "Edit costs" }));

    // Test cost field max value (2000)
    const costInputs = screen.getAllByLabelText("Cost") as HTMLInputElement[];
    await user.clear(costInputs[0]);
    await user.type(costInputs[0], "3000");
    await user.tab();
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

  it("handles successful save with optional costs", async () => {
    const user = userEvent.setup();
    mockSetCosts.mockResolvedValueOnce(undefined);

    render(
      <QuestCostsBadge quest={mockQuestWithOptionalCosts} editable={true} />,
    );

    await user.click(screen.getByRole("button", { name: "Edit costs" }));

    // Modify a cost
    const costInputs = screen.getAllByLabelText("Cost");
    await user.clear(costInputs[0] as HTMLInputElement);
    await user.type(costInputs[0] as HTMLInputElement, "200");

    // Save changes
    await user.click(screen.getByText("Save"));

    // Verify mutation was called with correct isRequired values
    expect(mockSetCosts).toHaveBeenCalledWith({
      costs: [
        { cost: 200, description: "Application fee", isRequired: true },
        { cost: 50, description: "Certified copies", isRequired: true },
        { cost: 75, description: "Expedited processing", isRequired: false },
        { cost: 25, description: "Optional notary", isRequired: false },
      ],
      questId: mockQuestWithOptionalCosts._id,
    });

    // Check if popover was closed
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("handles save failure", async () => {
    const user = userEvent.setup();
    mockSetCosts.mockRejectedValueOnce(new Error("Update failed"));

    render(<QuestCostsBadge quest={mockQuest} editable={true} />);

    await user.click(screen.getByRole("button", { name: "Edit costs" }));
    await user.click(screen.getByText("Save"));

    expect(toast.error).toHaveBeenCalledWith("Failed to update costs");
    expect(screen.queryByRole("dialog")).toBeInTheDocument();
  });

  it("handles cancel", async () => {
    const user = userEvent.setup();
    render(<QuestCostsBadge quest={mockQuest} editable={true} />);

    await user.click(screen.getByRole("button", { name: "Edit costs" }));

    // Modify a cost then cancel
    const costInputs = screen.getAllByLabelText("Cost");
    await user.clear(costInputs[0] as HTMLInputElement);
    await user.type(costInputs[0] as HTMLInputElement, "200");

    await user.click(screen.getByText("Cancel"));

    // Check if popover was closed without saving
    expect(mockSetCosts).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("handles remove costs", async () => {
    const user = userEvent.setup();
    render(<QuestCostsBadge quest={mockQuest} editable={true} />);

    await user.click(screen.getByRole("button", { name: "Edit costs" }));
    await user.click(screen.getByText("Remove"));

    expect(mockSetCosts).toHaveBeenCalledWith({
      costs: undefined,
      questId: mockQuest._id,
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
