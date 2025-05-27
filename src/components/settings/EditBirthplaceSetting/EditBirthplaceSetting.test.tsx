import { JURISDICTIONS } from "@/constants";
import type { Doc, Id } from "@convex/_generated/dataModel";
import { User } from "@react-aria/test-utils";
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

  const testUtilUser = new User({ interactionType: "mouse" });

  beforeEach(() => {
    vi.clearAllMocks();
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockSetBirthplace,
    );
  });

  it("renders correct jurisdiction if it exists", () => {
    render(<EditBirthplaceSetting user={mockUser} />);
    expect(screen.getByRole("button")).toHaveTextContent(JURISDICTIONS.CA);
  });

  it("shows placeholder button if birthplace is not set", () => {
    render(
      <EditBirthplaceSetting user={{ ...mockUser, birthplace: undefined }} />,
    );
    expect(screen.getByRole("button")).toHaveTextContent("Set birthplace");
  });

  it("shows edit form in popover when button is clicked", async () => {
    const user = userEvent.setup();
    render(<EditBirthplaceSetting user={mockUser} />);

    // Initially buttons should not be visible
    expect(
      screen.queryByRole("button", { name: "Save" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Cancel" }),
    ).not.toBeInTheDocument();

    // Open popover
    await user.click(screen.getByRole("button"));

    // Focus should be on the combobox
    expect(screen.getByRole("combobox")).toHaveFocus();

    // Buttons should now be visible
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("updates birthplace and submits the form", async () => {
    const user = userEvent.setup();
    mockSetBirthplace.mockResolvedValueOnce(undefined);

    render(<EditBirthplaceSetting user={mockUser} />);

    // Open popover
    await user.click(screen.getByRole("button"));

    // Use ComboBoxTester to interact with the combobox
    const comboboxTester = testUtilUser.createTester("ComboBox", {
      root: screen.getByRole("combobox"),
      interactionType: "keyboard",
    });
    await comboboxTester.open();
    expect(comboboxTester.listbox).toBeInTheDocument();
    await comboboxTester.selectOption({ option: JURISDICTIONS.NY });

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

    // Open popover
    await user.click(screen.getByRole("button"));

    // Select option
    const comboboxTester = testUtilUser.createTester("ComboBox", {
      root: screen.getByRole("combobox"),
      interactionType: "keyboard",
    });
    await comboboxTester.open();
    await comboboxTester.selectOption({ option: JURISDICTIONS.NY });

    // Submit form
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(
      screen.getByText("Failed to update birthplace. Please try again."),
    ).toBeInTheDocument();
  });

  it("resets to original value when cancel is clicked", async () => {
    const user = userEvent.setup();
    render(<EditBirthplaceSetting user={mockUser} />);

    // Open popover
    await user.click(screen.getByRole("button"));

    // Select option
    const comboboxTester = testUtilUser.createTester("ComboBox", {
      root: screen.getByRole("combobox"),
      interactionType: "keyboard",
    });
    await comboboxTester.open();
    await comboboxTester.selectOption({ option: JURISDICTIONS.NY });

    // Click cancel
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    // Should reset to original value
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
