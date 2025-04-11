import type { Doc } from "@convex/_generated/dataModel";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QuestBasics } from "./QuestBasics";

describe("QuestBasics", () => {
  const mockQuest = {
    _id: "quest123",
    title: "Test Quest",
    category: "courtOrder",
    jurisdiction: "CA",
  } as Doc<"quests">;

  const mockSetTitle = vi.fn();
  const mockSetCategory = vi.fn();
  const mockSetJurisdiction = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing when not editable", () => {
    render(<QuestBasics quest={mockQuest} />);
    expect(screen.queryByLabelText("Title")).not.toBeInTheDocument();
  });

  it("renders form fields when editable", () => {
    render(<QuestBasics quest={mockQuest} editable />);

    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("State")).toBeInTheDocument();
    expect(screen.getByLabelText("Category")).toBeInTheDocument();
  });

  it("initializes with quest values", () => {
    render(<QuestBasics quest={mockQuest} editable />);

    const titleInput = screen.getByLabelText("Title") as HTMLInputElement;
    expect(titleInput.value).toBe("Test Quest");
    expect(
      screen.getByRole("button", { name: "California State" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Court Order Category" }),
    ).toBeInTheDocument();
  });

  it("handles title changes", async () => {
    const user = userEvent.setup();
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockSetTitle,
    );

    render(<QuestBasics quest={mockQuest} editable />);

    const titleInput = screen.getByLabelText("Title");
    await user.clear(titleInput);
    await user.type(titleInput, "New Title");

    const saveButton = screen.getByText("Save");
    expect(saveButton).not.toBeDisabled();

    await user.click(saveButton);
    expect(mockSetTitle).toHaveBeenCalledWith({
      questId: mockQuest._id,
      title: "New Title",
    });
  });

  it("disables save button when title hasn't changed", () => {
    render(<QuestBasics quest={mockQuest} editable />);
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("handles jurisdiction changes", async () => {
    const user = userEvent.setup();
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockSetJurisdiction,
    );

    render(<QuestBasics quest={mockQuest} editable />);

    await user.click(screen.getByLabelText("State"));
    await user.click(screen.getByRole("option", { name: "New York" }));

    expect(mockSetJurisdiction).toHaveBeenCalledWith({
      questId: mockQuest._id,
      jurisdiction: "NY",
    });
  });

  it("handles category changes", async () => {
    const user = userEvent.setup();
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockSetCategory,
    );

    render(<QuestBasics quest={mockQuest} editable />);

    await user.click(screen.getByLabelText("Category"));
    await user.click(screen.getByRole("option", { name: "Birth Certificate" }));

    expect(mockSetCategory).toHaveBeenCalledWith({
      questId: mockQuest._id,
      category: "birthCertificate",
    });
  });

  it("shows error toast when jurisdiction update fails", async () => {
    const user = userEvent.setup();
    const mockSetJurisdiction = vi.fn().mockImplementation(() => {
      throw new Error("Update failed");
    });
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockSetJurisdiction,
    );

    render(<QuestBasics quest={mockQuest} editable />);

    await user.click(screen.getByLabelText("State"));
    await user.click(screen.getByRole("option", { name: "New York" }));

    expect(toast.error).toHaveBeenCalledWith("Couldn't update state.");
  });

  it("shows error toast when category update fails", async () => {
    const user = userEvent.setup();
    const mockSetCategory = vi.fn().mockImplementation(() => {
      throw new Error("Update failed");
    });
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockSetCategory,
    );

    render(<QuestBasics quest={mockQuest} editable />);

    await user.click(screen.getByLabelText("Category"));
    await user.click(screen.getByRole("option", { name: "Birth Certificate" }));

    expect(toast.error).toHaveBeenCalledWith("Couldn't update category.");
  });
});
