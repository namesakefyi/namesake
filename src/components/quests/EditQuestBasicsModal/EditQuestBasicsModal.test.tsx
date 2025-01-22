import type { Id } from "@convex/_generated/dataModel";
import { CATEGORIES, JURISDICTIONS } from "@convex/constants";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useMutation } from "convex/react";
import { vi } from "vitest";
import { beforeEach, describe, expect, it } from "vitest";
import { EditQuestBasicsModal } from "./EditQuestBasicsModal";

describe("EditQuestBasicsModal", () => {
  const mockQuest = {
    _id: "quest123" as Id<"quests">,
    title: "Original Quest Title",
    category: "education",
    jurisdiction: "CA",
    creationUser: "user123" as Id<"users">,
    _creationTime: Date.now(),
  };

  const mockSetAll = vi.fn();
  const mockOnOpenChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockSetAll,
    );
  });

  it("renders the modal with initial quest details", () => {
    render(
      <EditQuestBasicsModal
        quest={mockQuest}
        open={true}
        onOpenChange={mockOnOpenChange}
      />,
    );

    // Check title input
    const titleInput = screen.getByLabelText(/title/i);
    expect(titleInput).toHaveValue("Original Quest Title");

    // Check category select
    const categorySelect = screen.getByLabelText(/category/i);
    expect(categorySelect).toHaveTextContent(CATEGORIES.education.label);

    // Check jurisdiction select
    const jurisdictionSelect = screen.getByLabelText(/state/i);
    expect(jurisdictionSelect).toHaveTextContent(JURISDICTIONS.CA);
  });

  it("allows updating quest details", async () => {
    const user = userEvent.setup();
    mockSetAll.mockResolvedValueOnce(undefined);

    render(
      <EditQuestBasicsModal
        quest={mockQuest}
        open={true}
        onOpenChange={mockOnOpenChange}
      />,
    );

    // Update title
    const titleInput = screen.getByLabelText(/title/i);
    await user.clear(titleInput);
    await user.type(titleInput, "Updated Quest Title");

    // Update category
    const categorySelect = screen.getByLabelText(/category/i);
    await user.click(categorySelect);
    const gameCategory = screen.getByText(CATEGORIES.gaming.label);
    await user.click(gameCategory);

    // Update jurisdiction
    const jurisdictionSelect = screen.getByLabelText(/state/i);
    await user.click(jurisdictionSelect);
    const nyJurisdiction = screen.getByRole("option", {
      name: JURISDICTIONS.NY,
    });
    await user.click(nyJurisdiction);

    // Submit form
    const submitButton = screen.getByText(/save/i);
    await user.click(submitButton);

    // Wait for mutation to be called
    await waitFor(() => {
      expect(mockSetAll).toHaveBeenCalledWith({
        questId: "quest123",
        title: "Updated Quest Title",
        category: "gaming",
        jurisdiction: "NY",
      });
    });

    // Check that onOpenChange was called
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it("closes modal on cancel", async () => {
    const user = userEvent.setup();

    render(
      <EditQuestBasicsModal
        quest={mockQuest}
        open={true}
        onOpenChange={mockOnOpenChange}
      />,
    );

    // Click cancel button
    const cancelButton = screen.getByText(/cancel/i);
    await user.click(cancelButton);

    // Check that onOpenChange was called
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });
});
