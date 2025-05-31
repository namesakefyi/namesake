import { authClient } from "@/main";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DeleteAccountSetting } from "./DeleteAccountSetting";

describe("DeleteAccountSetting", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage.removeItem
    Object.defineProperty(window, "localStorage", {
      value: {
        removeItem: vi.fn(),
      },
      writable: true,
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
        "A confirmation email will be sent to your email address.",
      ),
    ).toBeInTheDocument();
  });

  it("submits the form successfully", async () => {
    const user = userEvent.setup();
    vi.mocked(authClient.deleteUser).mockResolvedValue({ error: null });

    render(<DeleteAccountSetting />);
    await user.click(screen.getByRole("button", { name: "Delete account" }));
    await user.click(
      screen.getByRole("button", { name: "Send deletion email" }),
    );

    await waitFor(() => {
      expect(authClient.deleteUser).toHaveBeenCalledWith({
        callbackURL: "/goodbye",
      });
      expect(window.localStorage.removeItem).toHaveBeenCalledWith("theme");
      expect(toast.success).toHaveBeenCalledWith(
        "Check your email to finish deleting your account.",
      );
    });
  });

  it("displays an error if account deletion fails", async () => {
    const user = userEvent.setup();
    const errorMessage = "Failed to delete account";
    vi.mocked(authClient.deleteUser).mockResolvedValue({
      error: new Error(errorMessage),
    });

    render(<DeleteAccountSetting />);
    await user.click(screen.getByRole("button", { name: "Delete account" }));
    await user.click(
      screen.getByRole("button", { name: "Send deletion email" }),
    );

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
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
