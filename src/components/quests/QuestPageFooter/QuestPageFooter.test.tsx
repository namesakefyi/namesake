import type { Doc } from "@convex/_generated/dataModel";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { QuestPageFooter } from "./QuestPageFooter";

// Mock TimeAgo component since it handles date formatting
vi.mock("@/components/common/TimeAgo/TimeAgo", () => ({
  TimeAgo: ({ date }: { date: Date }) => (
    <span>mock_time_ago_{date.toISOString()}</span>
  ),
}));

describe("QuestPageFooter", () => {
  const mockQuest = {
    _id: "test_id",
    _creationTime: 1234567890,
    updatedAt: new Date("2024-01-01").getTime(),
  } as Doc<"quests">;

  it("renders updated time when no userQuest is provided", () => {
    render(<QuestPageFooter quest={mockQuest} />);

    expect(screen.getByText(/Updated/)).toBeInTheDocument();
    expect(
      screen.getByText(`mock_time_ago_${new Date("2024-01-01").toISOString()}`),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Completed/)).not.toBeInTheDocument();
  });

  it("renders 'some time ago' when quest has no updatedAt", () => {
    const questWithoutUpdate = {
      ...mockQuest,
      updatedAt: null as unknown as number,
    } as Doc<"quests">;

    render(<QuestPageFooter quest={questWithoutUpdate} />);

    expect(screen.getByText(/Updated some time ago/)).toBeInTheDocument();
  });

  it("shows completion date for completed quests", () => {
    const completedUserQuest = {
      _id: "user_quest_id",
      _creationTime: 1234567890,
      status: "complete" as const,
      completedAt: new Date("2024-02-01").getTime(),
    } as Doc<"userQuests">;

    render(
      <QuestPageFooter quest={mockQuest} userQuest={completedUserQuest} />,
    );

    expect(screen.getByText(/Completed/)).toBeInTheDocument();
    expect(
      screen.getByText(`mock_time_ago_${new Date("2024-02-01").toISOString()}`),
    ).toBeInTheDocument();
  });

  it("doesn't show completion date for in-progress quests", () => {
    const inProgressUserQuest = {
      _id: "user_quest_id",
      _creationTime: 1234567890,
      status: "inProgress" as const,
    } as Doc<"userQuests">;

    render(
      <QuestPageFooter quest={mockQuest} userQuest={inProgressUserQuest} />,
    );

    expect(screen.queryByText(/Completed/)).not.toBeInTheDocument();
    expect(screen.getByText(/Updated/)).toBeInTheDocument();
  });

  it("doesn't show completion date when completedAt is missing", () => {
    const incompleteUserQuest = {
      _id: "user_quest_id",
      _creationTime: 1234567890,
      status: "complete" as const,
      // completedAt intentionally omitted
    } as Doc<"userQuests">;

    render(
      <QuestPageFooter quest={mockQuest} userQuest={incompleteUserQuest} />,
    );

    expect(screen.queryByText(/Completed/)).not.toBeInTheDocument();
    expect(screen.getByText(/Updated/)).toBeInTheDocument();
  });
});
