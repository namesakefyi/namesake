import type { Doc } from "@convex/_generated/dataModel";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QuestSteps } from "./QuestSteps";

describe("QuestSteps", () => {
  const mockStep = {
    _id: "step123",
    _creationTime: 1234567890,
    questId: "quest123",
    title: "Test Step",
    content: "Test content",
    button: {
      text: "Click me",
      url: "https://example.com",
    },
  } as Doc<"questSteps">;

  const mockQuest = {
    _id: "quest123",
    _creationTime: 1234567890,
    steps: ["step123"],
  } as Doc<"quests">;

  const mockAddStep = vi.fn();
  const mockUpdateStep = vi.fn();
  const mockDeleteStep = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue([
      mockStep,
    ]);
  });

  it("renders loading state when steps are undefined", () => {
    (useQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      undefined,
    );
    render(<QuestSteps quest={mockQuest} />);

    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
  });

  it("renders empty state when no steps exist", () => {
    (useQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue([]);
    render(<QuestSteps quest={mockQuest} />);

    expect(screen.getByText("No steps")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Add step" }),
    ).not.toBeInTheDocument();
  });

  it("renders empty state with add button when editable", () => {
    (useQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue([]);
    render(<QuestSteps quest={mockQuest} editable />);

    expect(
      screen.getByRole("button", { name: "Add step" }),
    ).toBeInTheDocument();
  });

  it("renders steps with content", () => {
    render(<QuestSteps quest={mockQuest} />);

    expect(screen.getByText("Test Step")).toBeInTheDocument();
    expect(screen.getByText("Test content")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Click me" })).toHaveAttribute(
      "href",
      "https://example.com",
    );
  });

  it("adds new step when clicking add button", async () => {
    const user = userEvent.setup();
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockAddStep,
    );

    render(<QuestSteps quest={mockQuest} editable />);
    await user.click(screen.getByRole("button", { name: "Add step" }));

    expect(mockAddStep).toHaveBeenCalledWith({
      questId: mockQuest._id,
      title: "New step",
    });
  });

  describe("QuestStep", () => {
    it("shows edit and delete options when editable", async () => {
      const user = userEvent.setup();
      render(<QuestSteps quest={mockQuest} editable />);

      await user.click(screen.getByRole("button", { name: "Actions" }));

      expect(screen.getByText("Edit step")).toBeInTheDocument();
      expect(screen.getByText("Delete step")).toBeInTheDocument();
    });

    it("deletes step when delete option is clicked", async () => {
      const user = userEvent.setup();
      (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
        mockDeleteStep,
      );

      render(<QuestSteps quest={mockQuest} editable />);

      await user.click(screen.getByRole("button", { name: "Actions" }));
      await user.click(screen.getByText("Delete step"));

      expect(mockDeleteStep).toHaveBeenCalledWith({
        questId: mockQuest._id,
        stepId: mockStep._id,
      });
    });

    it("enters edit mode when edit option is clicked", async () => {
      const user = userEvent.setup();
      render(<QuestSteps quest={mockQuest} editable />);

      await user.click(screen.getByRole("button", { name: "Actions" }));
      await user.click(screen.getByText("Edit step"));

      expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Cancel" }),
      ).toBeInTheDocument();
    });
  });

  describe("QuestStepForm", () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(async () => {
      user = userEvent.setup();
      vi.clearAllMocks();
      (useQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue([
        mockStep,
      ]);
    });

    it("handles button addition and removal", async () => {
      const stepWithoutButton = { ...mockStep, button: undefined };
      (useQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue([
        stepWithoutButton,
      ]);

      const { unmount } = render(<QuestSteps quest={mockQuest} editable />);

      await user.click(screen.getByRole("button", { name: "Actions" }));
      await user.click(screen.getByText("Edit step"));
      await user.click(screen.getByRole("button", { name: "Add button" }));

      expect(screen.getByLabelText("Button text")).toBeInTheDocument();
      expect(screen.getByLabelText("Button url")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Remove button" }));

      expect(screen.queryByLabelText("Button text")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Button url")).not.toBeInTheDocument();

      unmount();
    });

    it("updates step when save is clicked", async () => {
      (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
        mockUpdateStep,
      );

      const { unmount } = render(<QuestSteps quest={mockQuest} editable />);

      await user.click(screen.getByRole("button", { name: "Actions" }));
      await user.click(screen.getByText("Edit step"));

      const titleInput = screen.getByRole("textbox", { name: "Title" });
      await user.clear(titleInput);
      await user.type(titleInput, "Updated Title");

      await user.click(screen.getByRole("button", { name: "Save" }));

      expect(mockUpdateStep).toHaveBeenCalledWith({
        questStepId: mockStep._id,
        title: "Updated Title",
        content: "Test content",
        button: {
          text: "Click me",
          url: "https://example.com",
        },
      });

      unmount();
    });

    it("shows error toast when update fails", async () => {
      (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
        vi.fn().mockRejectedValue(new Error("Update failed")),
      );

      const { unmount } = render(<QuestSteps quest={mockQuest} editable />);

      await user.click(screen.getByRole("button", { name: "Actions" }));
      await user.click(screen.getByText("Edit step"));
      await user.click(screen.getByRole("button", { name: "Save" }));

      expect(toast.error).toHaveBeenCalledWith("Couldn't update step.");

      unmount();
    });
  });
});
