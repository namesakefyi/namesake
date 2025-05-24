import type { Doc, Id } from "@convex/_generated/dataModel";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QuestCategoryBadge } from "./QuestCategoryBadge";

describe("QuestCategoryBadge", () => {
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
    _id: "quest456" as Id<"quests">,
    _creationTime: 1234567890,
    title: "Core Quest",
    creationUser: "user123" as Id<"users">,
    slug: "core-quest",
    updatedAt: 1234567890,
    category: "passport",
  } as Doc<"quests">;

  const mockQuestNoCategory = {
    _id: "quest789" as Id<"quests">,
    _creationTime: 1234567890,
    title: "No Category Quest",
    creationUser: "user123" as Id<"users">,
    slug: "no-category-quest",
    updatedAt: 1234567890,
  } as Doc<"quests">;

  const mockSetCategory = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockSetCategory,
    );
  });

  it("returns null when quest is undefined", () => {
    const { container } = render(
      <QuestCategoryBadge quest={undefined as unknown as Doc<"quests">} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("returns null for core categories when not editable", () => {
    const { container } = render(
      <QuestCategoryBadge quest={mockCoreQuest} editable={false} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("displays core categories when editable", () => {
    render(<QuestCategoryBadge quest={mockCoreQuest} editable={true} />);
    expect(screen.getByText("Passport")).toBeInTheDocument();
  });

  it("displays category name correctly", () => {
    render(<QuestCategoryBadge quest={mockQuest} />);
    expect(screen.getByText("Education")).toBeInTheDocument();
  });

  it("displays 'Unknown' for missing category", () => {
    render(<QuestCategoryBadge quest={mockQuestNoCategory} />);
    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });

  it("shows edit button when editable prop is true", async () => {
    render(<QuestCategoryBadge quest={mockQuest} editable={true} />);

    const editButton = screen.getByRole("button", { name: "Edit category" });
    expect(editButton).toBeInTheDocument();
  });

  it("hides edit button when editable prop is false", () => {
    render(<QuestCategoryBadge quest={mockQuest} editable={false} />);
    expect(
      screen.queryByRole("button", { name: "Edit category" }),
    ).not.toBeInTheDocument();
  });

  it("opens category menu on edit button click", async () => {
    const user = userEvent.setup();
    render(<QuestCategoryBadge quest={mockQuest} editable={true} />);

    await user.click(screen.getByRole("button", { name: "Edit category" }));

    // Menu should be visible with category options
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByText("Categories")).toBeInTheDocument();
    expect(
      screen.getByRole("menuitemradio", { name: "Education" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitemradio", { name: "Education" }),
    ).toBeChecked();
    expect(
      screen.getByRole("menuitemradio", { name: "Passport" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitemradio", { name: "Passport" }),
    ).not.toBeChecked();
  });

  it("updates category on selection", async () => {
    const user = userEvent.setup();
    mockSetCategory.mockResolvedValueOnce(undefined);

    render(<QuestCategoryBadge quest={mockQuest} editable={true} />);

    // Open menu and select new category
    await user.click(screen.getByRole("button", { name: "Edit category" }));
    await user.click(screen.getByText("Passport"));

    expect(mockSetCategory).toHaveBeenCalledWith({
      questId: mockQuest._id,
      category: "passport",
    });
  });

  it("handles update failure", async () => {
    const user = userEvent.setup();
    mockSetCategory.mockRejectedValueOnce(new Error("Update failed"));

    render(<QuestCategoryBadge quest={mockQuest} editable={true} />);

    await user.click(screen.getByRole("button", { name: "Edit category" }));
    await user.click(screen.getByText("Passport"));

    expect(toast.error).toHaveBeenCalledWith("Couldn't update state.");
  });

  it("maintains current selection on update failure", async () => {
    const user = userEvent.setup();
    mockSetCategory.mockRejectedValueOnce(new Error("Update failed"));

    render(<QuestCategoryBadge quest={mockQuest} editable={true} />);

    await user.click(screen.getByRole("button", { name: "Edit category" }));
    await user.click(screen.getByText("Passport"));

    // Should still show original category after failed update
    expect(screen.getByText("Education")).toBeInTheDocument();
  });

  it("shows tooltip on edit button hover", async () => {
    const user = userEvent.setup();
    render(<QuestCategoryBadge quest={mockQuest} editable={true} />);

    await user.tab();

    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    expect(screen.getByText("Edit category")).toBeInTheDocument();
  });

  it("renders menu items with icons", async () => {
    const user = userEvent.setup();
    render(<QuestCategoryBadge quest={mockQuest} editable={true} />);

    await user.click(screen.getByRole("button", { name: "Edit category" }));

    // Menu items should have icons (either custom or default CircleHelp)
    const menuItems = screen.getAllByRole("menuitemradio");
    for (const item of menuItems) {
      expect(item.querySelector("svg")).toBeInTheDocument();
    }
  });

  it("initializes with correct category selection", async () => {
    render(<QuestCategoryBadge quest={mockQuest} editable={true} />);

    // Open the menu
    await userEvent.click(
      screen.getByRole("button", { name: "Edit category" }),
    );

    // Check that the initial category is selected
    const educationMenuItem = screen.getByRole("menuitemradio", {
      name: "Education",
    });
    expect(educationMenuItem).toBeChecked();
  });
});
