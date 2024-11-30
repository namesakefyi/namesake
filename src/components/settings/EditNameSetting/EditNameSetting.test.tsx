import type { Doc, Id } from "@convex/_generated/dataModel";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useMutation } from "convex/react";
import { describe, expect, it } from "vitest";
import { EditNameSetting } from "./EditNameSetting";

describe("EditNameSetting", () => {
  const mockUser = {
    _id: "user123" as Id<"users">,
    name: "John Doe",
  } as Doc<"users">;

  const mockUserNoName = {
    _id: "user456" as Id<"users">,
  } as Doc<"users">;

  it("displays current name in button when name is set", () => {
    render(<EditNameSetting user={mockUser} />);
    expect(screen.getByRole("button")).toHaveTextContent("John Doe");
  });

  it("displays 'Set name' in button when name is not set", () => {
    render(<EditNameSetting user={mockUserNoName} />);
    expect(screen.getByRole("button")).toHaveTextContent("Set name");
  });

  it("opens modal when edit button is clicked", async () => {
    const user = userEvent.setup();
    render(<EditNameSetting user={mockUser} />);

    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  describe("EditNameModal", () => {
    it("pre-fills input with current name", async () => {
      const user = userEvent.setup();
      render(<EditNameSetting user={mockUser} />);

      await user.click(screen.getByRole("button"));
      const input = screen.getByRole("textbox", { name: "Name" });
      expect(input).toHaveValue("John Doe");
    });

    it("updates name when form is submitted", async () => {
      const user = userEvent.setup();
      render(<EditNameSetting user={mockUser} />);

      // Open modal and change name
      await user.click(screen.getByRole("button"));
      await user.clear(screen.getByRole("textbox", { name: "Name" }));
      await user.type(
        screen.getByRole("textbox", { name: "Name" }),
        "Jane Smith",
      );
      await user.click(screen.getByRole("button", { name: "Save" }));

      // Check if mutation was called with new name
      expect(useMutation).toHaveBeenCalledWith({ name: "Jane Smith" });
    });

    it("closes modal when form is submitted", async () => {
      const user = userEvent.setup();
      render(<EditNameSetting user={mockUser} />);

      // Open modal and submit form
      await user.click(screen.getByRole("button"));
      await user.click(screen.getByRole("button", { name: "Save" }));

      // Check if modal is closed
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("closes modal when cancel is clicked", async () => {
      const user = userEvent.setup();
      render(<EditNameSetting user={mockUser} />);

      // Open modal and click cancel
      await user.click(screen.getByRole("button"));
      await user.click(screen.getByRole("button", { name: "Cancel" }));

      // Check if modal is closed without calling mutation
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(useMutation).not.toHaveBeenCalled();
    });

    it("prevents form submission when name is empty", async () => {
      const user = userEvent.setup();
      render(<EditNameSetting user={mockUser} />);

      // Open modal and clear name
      await user.click(screen.getByRole("button"));
      await user.clear(screen.getByRole("textbox", { name: "Name" }));
      await user.click(screen.getByRole("button", { name: "Save" }));

      // Check for error state
      expect(screen.getByRole("textbox", { name: "Name" })).toBeInvalid();
      expect(useMutation).not.toHaveBeenCalled();
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("prevents form submission when name is too long", async () => {
      const user = userEvent.setup();
      render(<EditNameSetting user={mockUser} />);

      // Open modal and enter long name
      await user.click(screen.getByRole("button"));
      await user.clear(screen.getByRole("textbox", { name: "Name" }));
      await user.type(
        screen.getByRole("textbox", { name: "Name" }),
        "a".repeat(101),
      );
      await user.click(screen.getByRole("button", { name: "Save" }));

      // Check for error message
      expect(
        screen.getByText("Name must be less than 100 characters"),
      ).toBeInTheDocument();
      expect(useMutation).not.toHaveBeenCalled();
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("shows error message when update fails", async () => {
      const user = userEvent.setup();
      render(<EditNameSetting user={mockUser} />);

      // Open modal and submit form
      await user.click(screen.getByRole("button"));
      await user.click(screen.getByRole("button", { name: "Save" }));

      // Check for error message
      expect(
        screen.getByText("Failed to update name. Please try again."),
      ).toBeInTheDocument();
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("trims whitespace from name before submitting", async () => {
      const user = userEvent.setup();
      render(<EditNameSetting user={mockUser} />);

      // Open modal and enter name with whitespace
      await user.click(screen.getByRole("button"));
      await user.clear(screen.getByRole("textbox", { name: "Name" }));
      await user.type(
        screen.getByRole("textbox", { name: "Name" }),
        "  John Smith  ",
      );
      await user.click(screen.getByRole("button", { name: "Save" }));

      // Check if mutation was called with trimmed name
      expect(useMutation).toHaveBeenCalledWith({ name: "John Smith" });
    });
  });
});
