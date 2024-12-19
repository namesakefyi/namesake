import type { Doc, Id } from "@convex/_generated/dataModel";
import { JURISDICTIONS } from "@convex/constants";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EditResidenceSetting } from "./EditResidenceSetting";

describe("EditResidenceSetting", () => {
  const mockUser: Doc<"users"> = {
    _id: "user123" as Id<"users">,
    _creationTime: 123,
    role: "user",
    residence: "CA",
  };

  const mockSetResidence = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockSetResidence,
    );
  });

  it("renders correct jurisdiction if it exists", () => {
    render(<EditResidenceSetting user={mockUser} />);
    expect(screen.getByText(JURISDICTIONS.CA)).toBeInTheDocument();
  });

  it("renders 'Set residence' if residence is not set", () => {
    render(
      <EditResidenceSetting user={{ ...mockUser, residence: undefined }} />,
    );
    expect(
      screen.getByRole("button", { name: "Set residence" }),
    ).toBeInTheDocument();
  });

  it("populates correct jurisdiction when modal is opened", async () => {
    const user = userEvent.setup();
    render(<EditResidenceSetting user={mockUser} />);
    await user.click(screen.getByRole("button", { name: JURISDICTIONS.CA }));
    expect(
      screen.getByRole("button", { name: `${JURISDICTIONS.CA} State` }),
    ).toBeInTheDocument();
  });

  it("updates residence and submits the form", async () => {
    const user = userEvent.setup();
    mockSetResidence.mockResolvedValueOnce(undefined);

    render(<EditResidenceSetting user={mockUser} />);
    await user.click(screen.getByRole("button", { name: JURISDICTIONS.CA }));
    const stateSelect = screen.getByLabelText("State");

    await user.click(stateSelect);

    await user.click(screen.getByRole("option", { name: JURISDICTIONS.NY }));

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(mockSetResidence).toHaveBeenCalledWith({
      residence: "NY",
    });

    expect(toast.success).toHaveBeenCalledWith("Residence updated.");
  });

  it("displays an error message if the update fails", async () => {
    const user = userEvent.setup();
    mockSetResidence.mockRejectedValueOnce(new Error("Update failed"));

    render(<EditResidenceSetting user={mockUser} />);

    await user.click(screen.getByRole("button", { name: JURISDICTIONS.CA }));
    const stateSelect = screen.getByLabelText("State");
    await user.click(stateSelect);

    await user.click(screen.getByRole("option", { name: JURISDICTIONS.NY }));

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(
      screen.getByText("Failed to update residence. Please try again."),
    ).toBeInTheDocument();
  });
});
