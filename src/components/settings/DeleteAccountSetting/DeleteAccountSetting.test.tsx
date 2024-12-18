import { useAuthActions } from "@convex-dev/auth/react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DeleteAccountSetting } from "./DeleteAccountSetting";

describe("DeleteAccountSetting", () => {
  const mockSignOut = vi.fn();
  const mockDeleteAccount = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockDeleteAccount,
    );
    (useAuthActions as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      signOut: mockSignOut,
    });
  });

  it("renders the DeleteAccountSetting component", () => {
    render(<DeleteAccountSetting />);
    expect(
      screen.getByRole("button", { name: "Delete account" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Permanently delete your Namesake account and data."),
    ).toBeInTheDocument();
  });

  it("opens the delete account modal when the button is clicked", async () => {
    const user = userEvent.setup();
    render(<DeleteAccountSetting />);
    await user.click(screen.getByRole("button", { name: "Delete account" }));
    expect(screen.getByText("Delete account?")).toBeInTheDocument();
    expect(
      screen.getByText(
        "This will permanently erase your account and all data.",
      ),
    ).toBeInTheDocument();
  });

  it("shows an error if the confirmation text is incorrect", async () => {
    const user = userEvent.setup();
    render(<DeleteAccountSetting />);
    await user.click(screen.getByRole("button", { name: "Delete account" }));

    const input = screen.getByLabelText("Type DELETE to confirm");
    await user.type(input, "WRONG_TEXT");

    await user.click(screen.getByRole("button", { name: "Delete account" }));
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Please type DELETE to confirm.",
    );

    expect(mockDeleteAccount).not.toHaveBeenCalled();
  });

  it("submits the form successfully", async () => {
    const user = userEvent.setup();
    render(<DeleteAccountSetting />);
    await user.click(screen.getByRole("button", { name: "Delete account" }));

    const input = screen.getByLabelText("Type DELETE to confirm");
    await user.type(input, "DELETE");
    await user.click(screen.getByRole("button", { name: "Delete account" }));

    await waitFor(() => {
      expect(mockDeleteAccount).toHaveBeenCalled();
      expect(mockSignOut).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Account deleted.");
    });
  });

  it("displays an error if account deletion fails", async () => {
    const user = userEvent.setup();
    mockDeleteAccount.mockRejectedValue(new Error("Deletion failed"));

    render(<DeleteAccountSetting />);
    await user.click(screen.getByRole("button", { name: "Delete account" }));

    const input = screen.getByLabelText("Type DELETE to confirm");
    await user.type(input, "DELETE");
    await user.click(screen.getByRole("button", { name: "Delete account" }));

    expect(
      await screen.findByText("Failed to delete account. Please try again."),
    ).toBeInTheDocument();
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("closes the modal when 'Cancel' is clicked", async () => {
    const user = userEvent.setup();
    render(<DeleteAccountSetting />);
    await user.click(screen.getByRole("button", { name: "Delete account" }));

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await waitFor(() => {
      expect(screen.queryByText("Delete account?")).not.toBeInTheDocument();
    });
  });
});
