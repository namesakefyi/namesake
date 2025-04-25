import type { Doc, Id } from "@convex/_generated/dataModel";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QuestJurisdictionBadge } from "./QuestJurisdictionBadge";

describe("QuestJurisdictionBadge", () => {
  const mockQuest = {
    _id: "quest123" as Id<"quests">,
    _creationTime: 1234567890,
    title: "Test Quest",
    creationUser: "user123" as Id<"users">,
    slug: "test-quest",
    updatedAt: 1234567890,
    jurisdiction: "CA",
    category: "divorce",
  } as Doc<"quests">;

  const mockFederalQuest = {
    _id: "quest456" as Id<"quests">,
    _creationTime: 1234567890,
    title: "Federal Quest",
    creationUser: "user123" as Id<"users">,
    slug: "federal-quest",
    updatedAt: 1234567890,
    jurisdiction: "CA",
    category: "passport",
  } as Doc<"quests">;

  const mockSetJurisdiction = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockSetJurisdiction,
    );
  });

  it("returns null when quest is undefined", () => {
    const { container } = render(
      <QuestJurisdictionBadge quest={undefined as unknown as Doc<"quests">} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("displays jurisdiction name correctly", () => {
    render(<QuestJurisdictionBadge quest={mockQuest} />);
    expect(screen.getByText("California")).toBeInTheDocument();
  });

  it("displays 'United States' for federal categories", () => {
    render(<QuestJurisdictionBadge quest={mockFederalQuest} />);
    expect(screen.getByText("United States")).toBeInTheDocument();
  });

  it("shows edit button when editable prop is true and not federal", async () => {
    render(<QuestJurisdictionBadge quest={mockQuest} editable={true} />);

    const editButton = screen.getByRole("button", {
      name: "Edit jurisdiction",
    });
    expect(editButton).toBeInTheDocument();
  });

  it("hides edit button when editable prop is false", () => {
    render(<QuestJurisdictionBadge quest={mockQuest} editable={false} />);
    expect(
      screen.queryByRole("button", { name: "Edit jurisdiction" }),
    ).not.toBeInTheDocument();
  });

  it("hides edit button for federal quests even when editable is true", () => {
    render(<QuestJurisdictionBadge quest={mockFederalQuest} editable={true} />);
    expect(
      screen.queryByRole("button", { name: "Edit jurisdiction" }),
    ).not.toBeInTheDocument();
  });

  it("opens jurisdiction menu on edit button click", async () => {
    const user = userEvent.setup();
    render(<QuestJurisdictionBadge quest={mockQuest} editable={true} />);

    await user.click(screen.getByRole("button", { name: "Edit jurisdiction" }));

    // Menu should be visible with state options
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(
      screen.getByRole("menuitemradio", { name: "California" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitemradio", { name: "California" }),
    ).toBeChecked();
    expect(
      screen.getByRole("menuitemradio", { name: "New York" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitemradio", { name: "New York" }),
    ).not.toBeChecked();
  });

  it("updates jurisdiction on selection", async () => {
    const user = userEvent.setup();
    mockSetJurisdiction.mockResolvedValueOnce(undefined);

    render(<QuestJurisdictionBadge quest={mockQuest} editable={true} />);

    // Open menu and select new jurisdiction
    await user.click(screen.getByRole("button", { name: "Edit jurisdiction" }));
    await user.click(screen.getByText("New York"));

    expect(mockSetJurisdiction).toHaveBeenCalledWith({
      questId: mockQuest._id,
      jurisdiction: "NY",
    });
  });

  it("handles update failure", async () => {
    const user = userEvent.setup();
    mockSetJurisdiction.mockRejectedValueOnce(new Error("Update failed"));

    render(<QuestJurisdictionBadge quest={mockQuest} editable={true} />);

    await user.click(screen.getByRole("button", { name: "Edit jurisdiction" }));
    await user.click(screen.getByText("New York"));

    expect(toast.error).toHaveBeenCalledWith("Couldn't update state.");
  });

  it("maintains current selection on update failure", async () => {
    const user = userEvent.setup();
    mockSetJurisdiction.mockRejectedValueOnce(new Error("Update failed"));

    render(<QuestJurisdictionBadge quest={mockQuest} editable={true} />);

    await user.click(screen.getByRole("button", { name: "Edit jurisdiction" }));
    await user.click(screen.getByText("New York"));

    // Should still show California after failed update
    expect(screen.getByText("California")).toBeInTheDocument();
  });
});
