import { authClient } from "@/main";
import type { Doc, Id } from "@convex/_generated/dataModel";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DeleteAccountSetting } from "./DeleteAccountSetting";

const mockUser: Doc<"users"> = {
  _id: "test-user-id" as Id<"users">,
  _creationTime: Date.now(),
  email: "test@example.com",
  name: "Test User",
  role: "user",
};

describe("DeleteAccountSetting", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the DeleteAccountSetting component", () => {
    render(<DeleteAccountSetting user={mockUser} />);
    expect(
      screen.getByRole("button", { name: "Delete account" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Permanently delete your Namesake account and data."),
    ).toBeInTheDocument();
  });

  it("opens the delete account modal when the button is clicked", async () => {
    const user = userEvent.setup();
    render(<DeleteAccountSetting user={mockUser} />);
    await user.click(screen.getByRole("button", { name: "Delete account" }));
    expect(screen.getByText("Delete account?")).toBeInTheDocument();
    expect(
      screen.getByText(
        "A confirmation email will be sent to test@example.com.",
      ),
    ).toBeInTheDocument();
  });

  it("submits the form successfully and shows loading state", async () => {
    const user = userEvent.setup();
    vi.mocked(authClient.deleteUser).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ error: null }), 100),
        ),
    );

    render(<DeleteAccountSetting user={mockUser} />);
    await user.click(screen.getByRole("button", { name: "Delete account" }));
    const submitButton = screen.getByRole("button", {
      name: "Send deletion email",
    });
    await user.click(submitButton);

    // Verify loading state
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveAttribute("aria-label", "Loading");

    await waitFor(() => {
      expect(authClient.deleteUser).toHaveBeenCalledWith({
        callbackURL: "/goodbye",
      });
      expect(toast.success).toHaveBeenCalledWith(
        "Check your email to finish deleting your account.",
      );
    });
  });

  it("displays an error if sending the deletion email fails", async () => {
    const user = userEvent.setup();
    const errorMessage = "Failed to delete account";

    vi.mocked(authClient.deleteUser).mockImplementation(() => {
      return Promise.resolve({ error: { message: errorMessage } });
    });

    render(<DeleteAccountSetting user={mockUser} />);

    // Open dialog and submit form
    await user.click(screen.getByRole("button", { name: "Delete account" }));
    const submitButton = screen.getByRole("button", {
      name: "Send deletion email",
    });
    await user.click(submitButton);

    // Wait for error message to appear and button to be re-enabled
    await vi.waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(submitButton).not.toBeDisabled();
    });

    expect(toast.success).not.toHaveBeenCalled();
  });

  it("closes the dialog when 'Cancel' is clicked", async () => {
    const user = userEvent.setup();
    render(<DeleteAccountSetting user={mockUser} />);

    // Open the dialog
    await user.click(screen.getByRole("button", { name: "Delete account" }));

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await waitFor(() => {
      expect(screen.queryByText("Delete account?")).not.toBeInTheDocument();
    });
  });
});
