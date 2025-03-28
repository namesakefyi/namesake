import type { Doc } from "@convex/_generated/dataModel";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QuestPageHeader } from "./QuestPageHeader";

vi.mock("convex/react", () => ({
  Authenticated: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useMutation: vi.fn(),
  useQuery: vi.fn().mockReturnValue({ role: "user" }),
}));

describe("QuestPageHeader", () => {
  const mockQuest = {
    _id: "test_id",
    _creationTime: 1234567890,
    title: "Test Quest",
    category: "courtOrder",
  } as Doc<"quests">;

  const mockNavigate = vi.fn();
  const mockAddQuest = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockNavigate,
    );
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockAddQuest,
    );
    (useSearch as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      edit: false,
    });
  });

  it("renders quest title", () => {
    render(<QuestPageHeader quest={mockQuest} />);
    expect(screen.getByText("Test Quest")).toBeInTheDocument();
  });

  it("renders badge when provided", () => {
    render(<QuestPageHeader quest={mockQuest} badge="Test Badge" />);
    expect(screen.getByText("Test Badge")).toBeInTheDocument();
  });

  it("shows status select for user quests when not editing", () => {
    const userQuest = {
      _id: "user_quest_id",
      status: "inProgress",
    } as Doc<"userQuests">;

    render(<QuestPageHeader quest={mockQuest} userQuest={userQuest} />);
    expect(screen.getByText("In progress")).toBeInTheDocument();
  });

  it("shows 'Add Quest' button when no userQuest exists", () => {
    render(<QuestPageHeader quest={mockQuest} userQuest={null} />);
    expect(screen.getByText("Add Quest")).toBeInTheDocument();
  });

  it("shows 'Finish editing' link when in edit mode", () => {
    (useSearch as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      edit: true,
    });
    render(<QuestPageHeader quest={mockQuest} />);
    expect(screen.getByText("Finish editing")).toBeInTheDocument();
  });

  it("shows core quest illustration for core categories", () => {
    render(<QuestPageHeader quest={mockQuest} />);
    const illustration = screen.getByAltText("A gavel with a snail on it");
    expect(illustration).toBeInTheDocument();
  });

  it("handles add quest error", async () => {
    const mockAddQuest = vi.fn().mockRejectedValue(new Error("Failed"));
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockAddQuest,
    );
    (useSearch as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      edit: false,
    });

    render(<QuestPageHeader quest={mockQuest} userQuest={null} />);

    const user = userEvent.setup();
    await user.click(screen.getByText("Add Quest"));

    expect(toast.error).toHaveBeenCalledWith(
      "Failed to add quest. Please try again.",
    );
  });

  it("shows quest settings menu for authenticated users", async () => {
    render(<QuestPageHeader quest={mockQuest} />);

    const user = userEvent.setup();
    await user.click(screen.getByLabelText("Quest settings"));

    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("shows edit option in menu for admin users", async () => {
    (useQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      role: "admin",
    });
    (useSearch as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      edit: false,
    });

    render(<QuestPageHeader quest={mockQuest} />);

    const user = userEvent.setup();
    await user.click(screen.getByLabelText("Quest settings"));

    expect(screen.getByText("Edit quest")).toBeInTheDocument();
  });

  it("shows remove option in menu for user quests", async () => {
    const userQuest = {
      _id: "user_quest_id",
      status: "inProgress",
    } as Doc<"userQuests">;

    render(<QuestPageHeader quest={mockQuest} userQuest={userQuest} />);

    const user = userEvent.setup();
    await user.click(screen.getByLabelText("Quest settings"));

    expect(screen.getByText("Remove quest")).toBeInTheDocument();
  });
});
