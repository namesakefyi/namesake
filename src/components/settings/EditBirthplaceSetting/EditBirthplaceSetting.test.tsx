import type { Doc, Id } from "@convex/_generated/dataModel";
import { JURISDICTIONS } from "@convex/constants";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EditBirthplaceSetting } from "./EditBirthplaceSetting";

describe("EditBirthplaceSetting", () => {
  const mockUser: Doc<"users"> = {
    _id: "user123" as Id<"users">,
    _creationTime: 123,
    role: "user",
    birthplace: "CA",
  };
  const mockSetBirthplace = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockSetBirthplace,
    );
  });

  it("renders the EditBirthplaceSetting component", () => {
    render(<EditBirthplaceSetting user={mockUser} />);
    expect(screen.getByText("Birthplace")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Where were you born? This location is used to select the forms for your birth certificate.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(JURISDICTIONS.CA)).toBeInTheDocument();
  });

  it("opens the modal when the button is clicked", async () => {
    const user = userEvent.setup();
    render(<EditBirthplaceSetting user={mockUser} />);
    await user.click(screen.getByRole("button", { name: JURISDICTIONS.CA }));
    expect(screen.getByText("Edit birthplace")).toBeInTheDocument();
  });

  it("updates birthplace and submits the form", async () => {
    const user = userEvent.setup();
    mockSetBirthplace.mockResolvedValueOnce(undefined);

    render(<EditBirthplaceSetting user={mockUser} />);
    await user.click(screen.getByRole("button", { name: JURISDICTIONS.CA }));
    const stateSelect = screen.getByLabelText("State");

    await user.click(stateSelect);

    await user.click(screen.getByRole("option", { name: JURISDICTIONS.NY }));

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(mockSetBirthplace).toHaveBeenCalledWith({
      birthplace: "NY",
    });

    expect(toast.success).toHaveBeenCalledWith("Birthplace updated.");
  });

  it("displays an error message if the update fails", async () => {
    const user = userEvent.setup();
    mockSetBirthplace.mockRejectedValueOnce(new Error("Update failed"));

    render(<EditBirthplaceSetting user={mockUser} />);

    await user.click(screen.getByRole("button", { name: JURISDICTIONS.CA }));
    const stateSelect = screen.getByLabelText("State");
    await user.click(stateSelect);

    await user.click(screen.getByRole("option", { name: JURISDICTIONS.NY }));

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(
      screen.getByText("Failed to update birthplace. Please try again."),
    ).toBeInTheDocument();
  });
});
