import type { Doc, Id } from "@convex/_generated/dataModel";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useMutation } from "convex/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Status } from "@/constants";
import { QuestCallToAction } from "./QuestCallToAction";

describe("QuestCallToAction", () => {
  const mockCreate = vi.fn();
  const mockSetStatus = vi.fn();

  const mockQuest = {
    _id: "quest123" as Id<"quests">,
    _creationTime: 1234567890,
    title: "Test Quest",
    creationUser: "user123" as Id<"users">,
    slug: "test-quest",
    updatedAt: 1234567890,
    category: "education",
  } as Doc<"quests">;

  const mockCoreQuest = {
    ...mockQuest,
    _id: "quest456" as Id<"quests">,
    category: "passport",
  } as Doc<"quests">;

  const mockUserQuest = (status: Status) =>
    ({
      _id: "userQuest123" as Id<"userQuests">,
      _creationTime: 1234567890,
      questId: "quest123" as Id<"quests">,
      userId: "user123" as Id<"users">,
      status,
      updatedAt: 1234567890,
      ...(status === "complete" && { completedAt: 1234567890 }),
    }) as Doc<"userQuests">;

  beforeEach(() => {
    vi.clearAllMocks();
    (useMutation as unknown as ReturnType<typeof vi.fn>)
      .mockReturnValueOnce(mockCreate) // First call for create
      .mockReturnValueOnce(mockSetStatus); // Second call for setStatus
  });

  it("shows 'Add to my quests' button when no userQuest exists", () => {
    render(<QuestCallToAction quest={mockQuest} />);
    expect(screen.getByText("Add to my quests")).toBeInTheDocument();
  });

  it("handles adding to my quests", async () => {
    const user = userEvent.setup();
    mockCreate.mockResolvedValueOnce(undefined);

    render(<QuestCallToAction quest={mockQuest} />);
    await user.click(screen.getByText("Add to my quests"));

    expect(mockCreate).toHaveBeenCalledWith({ questId: mockQuest._id });
  });

  it("shows 'Mark as in progress' button for not started quests", () => {
    render(
      <QuestCallToAction
        quest={mockQuest}
        userQuest={mockUserQuest("notStarted")}
      />,
    );
    expect(screen.getByText("Mark as in progress")).toBeInTheDocument();
  });

  it("shows 'Mark as done' button for in progress quests", () => {
    render(
      <QuestCallToAction
        quest={mockQuest}
        userQuest={mockUserQuest("inProgress")}
      />,
    );
    expect(screen.getByText("Mark as done")).toBeInTheDocument();
  });

  it("shows completion date for completed quests", () => {
    render(
      <QuestCallToAction
        quest={mockQuest}
        userQuest={mockUserQuest("complete")}
      />,
    );
    expect(screen.getByText("Done!")).toBeInTheDocument();
  });

  it("handles status change to in progress", async () => {
    const user = userEvent.setup();
    mockSetStatus.mockResolvedValueOnce(undefined);

    render(
      <QuestCallToAction
        quest={mockQuest}
        userQuest={mockUserQuest("notStarted")}
      />,
    );
    await user.click(screen.getByText("Mark as in progress"));

    expect(mockSetStatus).toHaveBeenCalledWith({
      questId: mockQuest._id,
      status: "inProgress",
    });
  });

  it("handles status change to complete", async () => {
    const user = userEvent.setup();
    mockSetStatus.mockResolvedValueOnce(undefined);

    render(
      <QuestCallToAction
        quest={mockQuest}
        userQuest={mockUserQuest("inProgress")}
      />,
    );
    await user.click(screen.getByText("Mark as done"));

    expect(mockSetStatus).toHaveBeenCalledWith({
      questId: mockQuest._id,
      status: "complete",
    });
  });

  it("shows illustration for core quests", () => {
    render(<QuestCallToAction quest={mockCoreQuest} />);
    expect(screen.getByAltText("A snail on a passport")).toBeInTheDocument();
  });

  it("applies success styling for completed quests", () => {
    const { container } = render(
      <QuestCallToAction
        quest={mockQuest}
        userQuest={mockUserQuest("complete")}
      />,
    );
    expect(container.firstChild).toHaveClass(
      "bg-primary-3",
      "border-primary-5",
    );
  });

  it("shows relative completion time", () => {
    render(
      <QuestCallToAction
        quest={mockQuest}
        userQuest={mockUserQuest("complete")}
      />,
    );
    expect(screen.getByText(/ago$/)).toBeInTheDocument();
  });

  it("maintains consistent button width", () => {
    const { rerender } = render(<QuestCallToAction quest={mockQuest} />);
    const addButton = screen.getByRole("button", { name: "Add to my quests" });
    expect(addButton).toHaveClass("w-64");

    rerender(
      <QuestCallToAction
        quest={mockQuest}
        userQuest={mockUserQuest("inProgress")}
      />,
    );
    const completeButton = screen.getByRole("button", {
      name: "Mark as done",
    });
    expect(completeButton).toHaveClass("w-64");
  });
});
