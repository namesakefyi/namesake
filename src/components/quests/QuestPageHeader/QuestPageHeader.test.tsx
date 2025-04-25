import type { Doc, Id } from "@convex/_generated/dataModel";
import { useNavigate } from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useMutation } from "convex/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QuestPageHeader } from "./QuestPageHeader";

describe("QuestPageHeader", () => {
  const mockNavigate = vi.fn();
  const mockSetStatus = vi.fn();
  const mockDeleteForever = vi.fn();

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

  const mockUserQuest = {
    _id: "userQuest123" as Id<"userQuests">,
    _creationTime: 1234567890,
    questId: "quest123" as Id<"quests">,
    userId: "user123" as Id<"users">,
    status: "inProgress" as const,
    updatedAt: 1234567890,
  } as Doc<"userQuests">;

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockNavigate,
    );
    (useMutation as unknown as ReturnType<typeof vi.fn>)
      .mockReturnValueOnce(mockSetStatus) // First call for setStatus
      .mockReturnValueOnce(mockDeleteForever); // Second call for deleteForever
  });

  it("returns null when quest is undefined", () => {
    const { container } = render(
      <QuestPageHeader quest={undefined} userQuest={mockUserQuest} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders quest title", () => {
    render(<QuestPageHeader quest={mockQuest} />);
    expect(screen.getByText("Test Quest")).toBeInTheDocument();
  });

  it("shows edit title button when editable", () => {
    render(<QuestPageHeader quest={mockQuest} editable={true} />);

    const editButton = screen.getByRole("button", { name: "Edit title" });
    expect(editButton).toBeInTheDocument();
  });

  it("hides edit title button when not editable", () => {
    render(<QuestPageHeader quest={mockQuest} editable={false} />);

    expect(
      screen.queryByRole("button", { name: "Edit title" }),
    ).not.toBeInTheDocument();
  });

  it("opens edit title modal on button click", async () => {
    const user = userEvent.setup();
    render(<QuestPageHeader quest={mockQuest} editable={true} />);

    await user.click(screen.getByRole("button", { name: "Edit title" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Edit title")).toBeInTheDocument();
  });

  it("shows status select for non-editable user quests", () => {
    render(
      <QuestPageHeader
        quest={mockQuest}
        userQuest={mockUserQuest}
        editable={false}
      />,
    );

    expect(
      screen.getByRole("button", { name: "In progress" }),
    ).toBeInTheDocument();
  });

  it("hides status select when editable", () => {
    render(
      <QuestPageHeader
        quest={mockQuest}
        userQuest={mockUserQuest}
        editable={true}
      />,
    );

    expect(
      screen.queryByRole("button", { name: "In progress" }),
    ).not.toBeInTheDocument();
  });

  it("renders badges section", () => {
    render(<QuestPageHeader quest={mockQuest} editable={true} />);

    // Check if badges are rendered
    expect(screen.getByText("Education")).toBeInTheDocument();
    expect(screen.getByText("California")).toBeInTheDocument();
    expect(screen.getByText("$150")).toBeInTheDocument();
    expect(screen.getByText("2–4 weeks")).toBeInTheDocument();
  });

  it("renders toolbar section", () => {
    render(<QuestPageHeader quest={mockQuest} editable={false} />);

    // Check if toolbar is rendered
    expect(screen.getByRole("toolbar")).toBeInTheDocument();
  });

  it("shows tooltip on edit button focus", async () => {
    const user = userEvent.setup();
    render(<QuestPageHeader quest={mockQuest} editable={true} />);

    await user.tab();

    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    expect(screen.getByText("Edit title")).toBeInTheDocument();
  });
});
