import type { Doc, Id } from "@convex/_generated/dataModel";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EditNameSetting } from "./EditNameSetting";

describe("EditNameSetting", () => {
  const mockUser: Doc<"users"> = {
    _id: "123" as Id<"users">,
    name: "John Doe",
    role: "user",
    _creationTime: 123,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correct username if exists", () => {
    render(<EditNameSetting user={mockUser} />);
    expect(
      screen.getByRole("button", { name: "John Doe" }),
    ).toBeInTheDocument();
  });

  it("truncates very long names", () => {
    render(
      <EditNameSetting
        user={{ ...mockUser, name: "Evaaaaaaaaaaaaaaaaaaaa" }}
      />,
    );
    expect(screen.getByText("Evaaaaaaaaaaaaaaaaaaaa")).toHaveClass(
      "truncate max-w-[24ch]",
    );
  });

  it("renders 'Set name' if name is not set", () => {
    render(<EditNameSetting user={{ ...mockUser, name: undefined }} />);
    expect(
      screen.getByRole("button", { name: "Set name" }),
    ).toBeInTheDocument();
  });

  it("shows edit form when edit button is clicked", async () => {
    const user = userEvent.setup();
    render(<EditNameSetting user={mockUser} />);

    await user.click(screen.getByRole("button", { name: "John Doe" }));

    // Autofocus input
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveFocus();

    expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue(
      "John Doe",
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("displays an error when the name is too long", async () => {
    const user = userEvent.setup();
    render(<EditNameSetting user={mockUser} />);

    await user.click(screen.getByRole("button", { name: "John Doe" }));
    const input = screen.getByRole("textbox", { name: "Name" });

    await user.clear(input);
    await user.type(input, "a".repeat(101));
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("submits the form successfully", async () => {
    const user = userEvent.setup();

    const updateName = vi.fn();
    (useMutation as ReturnType<typeof vi.fn>).mockReturnValue(updateName);

    render(<EditNameSetting user={mockUser} />);
    await user.click(screen.getByRole("button", { name: "John Doe" }));

    const input = screen.getByRole("textbox", { name: "Name" });
    await user.clear(input);
    await user.type(input, "Jane Doe");
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() =>
      expect(updateName).toHaveBeenCalledWith({ name: "Jane Doe" }),
    );
    expect(toast.success).toHaveBeenCalledWith("Name updated.");

    // Should return to view mode
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("displays an error when the form submission fails", async () => {
    const user = userEvent.setup();

    const updateName = vi
      .fn()
      .mockRejectedValue(new Error("Failed to update name"));
    (useMutation as ReturnType<typeof vi.fn>).mockReturnValue(updateName);

    render(<EditNameSetting user={mockUser} />);
    await user.click(screen.getByRole("button", { name: "John Doe" }));

    const input = screen.getByRole("textbox", { name: "Name" });
    await user.clear(input);
    await user.type(input, "Jane Doe");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(
      screen.getByText("Failed to update name. Please try again."),
    ).toBeInTheDocument();
  });

  it("resets to original value when cancel is clicked", async () => {
    const user = userEvent.setup();

    render(<EditNameSetting user={mockUser} />);
    await user.click(screen.getByRole("button", { name: "John Doe" }));

    const input = screen.getByRole("textbox", { name: "Name" });
    await user.clear(input);
    await user.type(input, "Jane Doe");
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    // Should return to view mode with original value
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "John Doe" }),
    ).toBeInTheDocument();
  });
});
