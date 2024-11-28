import type { Doc, Id } from "@convex/_generated/dataModel";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { QuestTimeRequired } from "./QuestTimeRequired";

describe("QuestTimeRequired", () => {
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

  it("returns null when quest is undefined", () => {
    const { container } = render(
      <QuestTimeRequired quest={undefined as unknown as Doc<"quests">} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("formats and displays time required correctly", () => {
    render(<QuestTimeRequired quest={mockQuest} />);
    expect(screen.getByText("2–4 weeks")).toBeInTheDocument();
  });

  it("displays 'Unknown' when timeRequired is not set", () => {
    render(<QuestTimeRequired quest={mockQuestNoTimeRequired} />);
    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });

  it("shows description in popover when available", async () => {
    const user = userEvent.setup();
    render(<QuestTimeRequired quest={mockQuest} />);

    // Find and click the popover trigger
    const popoverTrigger = screen.getByRole("button", {
      name: "See details",
    });
    await user.click(popoverTrigger);

    // Check if description is shown
    expect(
      screen.getByText("Processing time varies by court"),
    ).toBeInTheDocument();
  });

  it("does not show description popover when description is not available", () => {
    render(<QuestTimeRequired quest={mockQuestNoDescription} />);
    expect(
      screen.queryByRole("button", { name: "See details" }),
    ).not.toBeInTheDocument();
  });

  it("shows edit button when editable prop is true", async () => {
    const user = userEvent.setup();
    render(<QuestTimeRequired quest={mockQuest} editable={true} />);

    // Check if edit button is present
    const editButton = screen.getByRole("button", {
      name: "Edit time required",
    });
    expect(editButton).toBeInTheDocument();

    // Click edit button and check if modal opens
    await user.click(editButton);
    const modal = await screen.findByRole("dialog");
    expect(modal).toBeInTheDocument();
  });

  it("hides edit button when editable prop is false", () => {
    render(<QuestTimeRequired quest={mockQuest} editable={false} />);
    expect(
      screen.queryByRole("button", { name: "Edit time required" }),
    ).not.toBeInTheDocument();
  });
});
