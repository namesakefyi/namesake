import type { Doc, Id } from "@convex/_generated/dataModel";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QuestPageBadges } from "./QuestPageBadges";

describe("QuestPageBadges", () => {
  const mockQuest = {
    _id: "quest123" as Id<"quests">,
    _creationTime: 1234567890,
    title: "Test Quest",
    creationUser: "user123" as Id<"users">,
    slug: "test-quest",
    updatedAt: 1234567890,
    category: "education",
    jurisdiction: "CA",
    costs: [
      { cost: 100, description: "Application fee" },
      { cost: 50, description: "Certified copies" },
    ],
    timeRequired: {
      min: 2,
      max: 4,
      unit: "weeks",
      description: "Processing time varies by court",
    },
  } as Doc<"quests">;

  it("returns null when quest is undefined", () => {
    const { container } = render(
      <QuestPageBadges quest={undefined as unknown as Doc<"quests">} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders all badges when quest data is complete", () => {
    render(<QuestPageBadges quest={mockQuest} />);

    // Check if all badges are rendered with correct content
    expect(screen.getByText("Education")).toBeInTheDocument();
    expect(screen.getByText("California")).toBeInTheDocument();
    expect(screen.getByText("$150")).toBeInTheDocument();
    expect(screen.getByText("2–4 weeks")).toBeInTheDocument();

    // Verify no edit buttons are present
    expect(
      screen.queryByRole("button", { name: "Edit category" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Edit state" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Edit costs" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Edit time required" }),
    ).not.toBeInTheDocument();
  });

  it("renders badges with edit buttons when editable", () => {
    render(<QuestPageBadges quest={mockQuest} editable={true} />);

    expect(
      screen.getByRole("button", { name: "Edit category" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Edit state" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Edit costs" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Edit time required" }),
    ).toBeInTheDocument();
  });

  it("renders badges with partial quest data", () => {
    const partialQuest = {
      _id: "quest456" as Id<"quests">,
      _creationTime: 1234567890,
      title: "Partial Quest",
      creationUser: "user123" as Id<"users">,
      slug: "partial-quest",
      updatedAt: 1234567890,
      category: "education",
    } as Doc<"quests">;

    render(<QuestPageBadges quest={partialQuest} />);

    // Check if category badge is rendered
    expect(screen.getByText("Education")).toBeInTheDocument();

    // Check if other badges are not rendered
    expect(
      screen.queryByRole("button", { name: "Edit state" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Edit costs" }),
    ).not.toBeInTheDocument();
  });

  it("handles overflow", () => {
    const { container } = render(<QuestPageBadges quest={mockQuest} />);

    const badgesContainer = container.firstChild as HTMLElement;
    expect(badgesContainer).toHaveClass("overflow-x-auto");
  });
});
