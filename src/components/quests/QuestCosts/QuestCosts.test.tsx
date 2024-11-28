import type { Doc, Id } from "@convex/_generated/dataModel";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { QuestCosts } from "./QuestCosts";

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
    render(<QuestCosts quest={mockQuest} />);

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
    render(<QuestCosts quest={mockQuestFree as Doc<"quests">} />);
    expect(screen.getByText("Free")).toBeInTheDocument();
  });

  it("displays 'Free' when total cost is 0 but costs array is not empty", () => {
    render(<QuestCosts quest={mockQuestZeroCost} />);
    expect(screen.getByText("Free")).toBeInTheDocument();
  });

  it("shows edit button when editable prop is true", async () => {
    const user = userEvent.setup();
    render(<QuestCosts quest={mockQuest} editable={true} />);

    // Check if edit button is present
    const editButton = screen.getByRole("button", { name: "Edit costs" });
    expect(editButton).toBeInTheDocument();

    // Click edit button and check if modal opens
    user.click(editButton);
    const modal = await screen.findByRole("dialog");
    expect(modal).toBeInTheDocument();
  });

  it("hides edit button when editable prop is false", () => {
    render(<QuestCosts quest={mockQuest} editable={false} />);
    expect(
      screen.queryByRole("button", { name: "Edit costs" }),
    ).not.toBeInTheDocument();
  });
});
