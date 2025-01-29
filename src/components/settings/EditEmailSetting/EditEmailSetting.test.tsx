import type { Doc, Id } from "@convex/_generated/dataModel";
import { DUPLICATE_EMAIL, INVALID_EMAIL } from "@convex/errors";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EditEmailSetting } from "./EditEmailSetting";

describe("EditEmailSetting", () => {
  const mockUser: Doc<"users"> = {
    _id: "012" as Id<"users">,
    email: "testuser@example.com",
    name: "Test user",
    role: "user",
    _creationTime: 12542,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the correct email if it exists", () => {
    render(<EditEmailSetting user={mockUser} />);
    expect(
      screen.getByRole("button", { name: "testuser@example.com" }),
    ).toBeInTheDocument();
  });

  it("renders 'Set email' if email is not set", () => {
    render(<EditEmailSetting user={{ ...mockUser, email: undefined }} />);
    expect(
      screen.getByRole("button", { name: "Set email" }),
    ).toBeInTheDocument();
  });

  it("truncates very long emails", () => {
    render(
      <EditEmailSetting
        user={{ ...mockUser, email: "evaaaaaaaaaaaaaaaaaaaa@gmail.com" }}
      />,
    );
    expect(screen.getByText("evaaaaaaaaaaaaaaaaaaaa@gmail.com")).toHaveClass(
      "truncate max-w-[24ch]",
    );
  });

  it("shows edit form with current email when edit button is clicked", async () => {
    const user = userEvent.setup();
    render(<EditEmailSetting user={mockUser} />);

    await user.click(
      screen.getByRole("button", { name: "testuser@example.com" }),
    );

    // Autofocus input
    expect(screen.getByRole("textbox", { name: "Email" })).toHaveFocus();

    expect(screen.getByRole("textbox", { name: "Email" })).toHaveValue(
      "testuser@example.com",
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("displays an error for an invalid email address", async () => {
    const user = userEvent.setup();
    const mockError = new ConvexError(INVALID_EMAIL);
    const updateEmail = vi.fn().mockRejectedValue(mockError);
    (useMutation as ReturnType<typeof vi.fn>).mockReturnValue(updateEmail);

    render(<EditEmailSetting user={mockUser} />);
    await user.click(
      screen.getByRole("button", { name: "testuser@example.com" }),
    );

    const input = screen.getByRole("textbox", { name: "Email" });
    await user.clear(input);
    await user.type(input, "newuser@zmail");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(
      screen.getByText("Please enter a valid email address."),
    ).toBeInTheDocument();
  });

  it("displays an error when the email is already in use", async () => {
    const user = userEvent.setup();
    const mockError = new ConvexError(DUPLICATE_EMAIL);
    const updateEmail = vi.fn().mockRejectedValue(mockError);
    (useMutation as ReturnType<typeof vi.fn>).mockReturnValue(updateEmail);

    render(<EditEmailSetting user={mockUser} />);
    await user.click(
      screen.getByRole("button", { name: "testuser@example.com" }),
    );

    const input = screen.getByRole("textbox", { name: "Email" });
    await user.clear(input);
    await user.type(input, "newuser@example.com");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(
      screen.getByText("This email is currently in use. Try another one."),
    ).toBeInTheDocument();
  });

  it("displays a fallback error when an unknown ConvexError is received", async () => {
    const user = userEvent.setup();
    const mockError = new ConvexError("UNKNOWN_ERROR");
    const updateEmail = vi.fn().mockRejectedValue(mockError);
    (useMutation as ReturnType<typeof vi.fn>).mockReturnValue(updateEmail);

    render(<EditEmailSetting user={mockUser} />);
    await user.click(
      screen.getByRole("button", { name: "testuser@example.com" }),
    );

    const input = screen.getByRole("textbox", { name: "Email" });
    await user.clear(input);
    await user.type(input, "newuser@example.com");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(
      screen.getByText("Something went wrong. Please try again later."),
    ).toBeInTheDocument();
  });

  it("displays a generic error when a non-ConvexError is received", async () => {
    const user = userEvent.setup();
    const updateEmail = vi
      .fn()
      .mockRejectedValue(new Error("Failed to update email"));
    (useMutation as ReturnType<typeof vi.fn>).mockReturnValue(updateEmail);

    render(<EditEmailSetting user={mockUser} />);
    await user.click(
      screen.getByRole("button", { name: "testuser@example.com" }),
    );

    const input = screen.getByRole("textbox", { name: "Email" });
    await user.clear(input);
    await user.type(input, "newuser@example.com");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(
      screen.getByText("Failed to update email. Please try again."),
    ).toBeInTheDocument();
  });

  it("submits the form successfully", async () => {
    const user = userEvent.setup();
    const updateEmail = vi.fn().mockResolvedValue({});
    (useMutation as ReturnType<typeof vi.fn>).mockReturnValue(updateEmail);

    render(<EditEmailSetting user={mockUser} />);
    await user.click(
      screen.getByRole("button", { name: "testuser@example.com" }),
    );

    const input = screen.getByRole("textbox", { name: "Email" });
    await user.clear(input);
    await user.type(input, "newuser@example.com");
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() =>
      expect(updateEmail).toHaveBeenCalledWith({
        email: "newuser@example.com",
      }),
    );
    expect(toast.success).toHaveBeenCalledWith("Email updated.");

    // Should return to view mode
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("resets to original value when cancel is clicked", async () => {
    const user = userEvent.setup();

    render(<EditEmailSetting user={mockUser} />);
    await user.click(
      screen.getByRole("button", { name: "testuser@example.com" }),
    );

    const input = screen.getByRole("textbox", { name: "Email" });
    await user.clear(input);
    await user.type(input, "newuser@example.com");
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    // Should return to view mode with original value
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "testuser@example.com" }),
    ).toBeInTheDocument();
  });
});
