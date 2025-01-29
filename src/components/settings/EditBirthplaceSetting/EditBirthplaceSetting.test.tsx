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

  it("renders correct jurisdiction if it exists", () => {
    render(<EditBirthplaceSetting user={mockUser} />);
    expect(screen.getByRole("combobox", { hidden: true })).toHaveValue("CA");
    expect(screen.getByRole("button")).toHaveTextContent(JURISDICTIONS.CA);
  });

  it("shows empty select if birthplace is not set", () => {
    render(
      <EditBirthplaceSetting user={{ ...mockUser, birthplace: undefined }} />,
    );
    const stateSelect = screen.getByLabelText("State");
    expect(stateSelect).toHaveValue("");
  });

  it("shows save/cancel buttons when birthplace is changed", async () => {
    const user = userEvent.setup();
    render(<EditBirthplaceSetting user={mockUser} />);

    // Initially buttons should not be visible
    expect(
      screen.queryByRole("button", { name: "Save" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Cancel" }),
    ).not.toBeInTheDocument();

    // Change birthplace
    const stateSelect = screen.getByLabelText("State");
    await user.click(stateSelect);
    await user.click(screen.getByRole("option", { name: JURISDICTIONS.NY }));

    // Buttons should now be visible
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("updates birthplace and submits the form", async () => {
    const user = userEvent.setup();
    mockSetBirthplace.mockResolvedValueOnce(undefined);

    render(<EditBirthplaceSetting user={mockUser} />);

    // Change birthplace
    const stateSelect = screen.getByLabelText("State");
    await user.click(stateSelect);
    await user.click(screen.getByRole("option", { name: JURISDICTIONS.NY }));

    // Submit form
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

    // Change birthplace
    const stateSelect = screen.getByLabelText("State");
    await user.click(stateSelect);
    await user.click(screen.getByRole("option", { name: JURISDICTIONS.NY }));

    // Submit form
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(
      screen.getByText("Failed to update birthplace. Please try again."),
    ).toBeInTheDocument();
  });

  it("resets to original value when cancel is clicked", async () => {
    const user = userEvent.setup();
    render(<EditBirthplaceSetting user={mockUser} />);

    // Change birthplace
    const stateSelect = screen.getByLabelText("State");
    await user.click(stateSelect);
    await user.click(screen.getByRole("option", { name: JURISDICTIONS.NY }));

    // Click cancel
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    // Should reset to original value
    expect(screen.getByRole("combobox", { hidden: true })).toHaveValue("CA");
    expect(screen.getByRole("button")).toHaveTextContent(JURISDICTIONS.CA);

    // Buttons should be hidden
    expect(
      screen.queryByRole("button", { name: "Save" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Cancel" }),
    ).not.toBeInTheDocument();
  });
});
