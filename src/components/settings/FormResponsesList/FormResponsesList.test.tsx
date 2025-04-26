import { useEncryptionKey } from "@/hooks/useEncryptionKey";
import type { Id } from "@convex/_generated/dataModel";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useMutation, useQuery } from "convex/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FormResponsesList, getReadableFieldLabel } from "./FormResponsesList";

// Mock encryption utilities
vi.mock("@/hooks/useEncryptionKey", () => ({
  useEncryptionKey: vi.fn(),
}));

vi.mock("@/hooks/useDecrypt", () => ({
  useDecrypt: vi.fn().mockReturnValue({
    decryptedValue: "decrypted_value",
    error: false,
  }),
}));

describe("FormResponsesList", () => {
  const mockFormResponses = [
    {
      id: "1" as Id<"userFormResponses">,
      field: "firstName",
      value: "encrypted_value_1",
    },
    {
      id: "2" as Id<"userFormResponses">,
      field: "middleName",
      value: "encrypted_value_2",
    },
    {
      id: "3" as Id<"userFormResponses">,
      field: "lastName",
      value: "encrypted_value_3",
    },
  ];

  const mockDeleteFormData = vi.fn();
  const mockSaveFormData = vi.fn();
  const mockEncryptionKey = {} as CryptoKey;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock useQuery for getCurrentRole
    (useQuery as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (query) => {
        if (query.name === "users.getCurrentRole") return "user";
        return undefined;
      },
    );

    // Mock useMutation
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (mutation) => {
        if (mutation.name === "userFormResponses.deleteMany")
          return mockDeleteFormData;
        if (mutation.name === "userFormResponses.set") return mockSaveFormData;
        return vi.fn();
      },
    );

    // Mock encryption key
    (useEncryptionKey as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockEncryptionKey,
    );
  });

  it("renders empty state when no data exists", async () => {
    const { getByText } = render(<FormResponsesList rows={[]} />);
    await waitFor(() => {
      expect(getByText("No data")).toBeInTheDocument();
      expect(getByText("Form responses will appear here.")).toBeInTheDocument();
    });
  });

  it("renders list of form responses", async () => {
    const { getByRole } = render(
      <FormResponsesList rows={mockFormResponses} />,
    );
    await waitFor(() => {
      expect(getByRole("option", { name: "firstName" })).toBeInTheDocument();
      expect(getByRole("option", { name: "middleName" })).toBeInTheDocument();
      expect(getByRole("option", { name: "lastName" })).toBeInTheDocument();
    });
  });

  it("does not show select all and delete buttons when no data exists", async () => {
    const { queryByRole } = render(<FormResponsesList rows={[]} />);
    await waitFor(() => {
      expect(
        queryByRole("button", { name: "Select all" }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Delete" }),
      ).not.toBeInTheDocument();
    });
  });

  it("shows select all and delete buttons when data exists", async () => {
    const { getByRole } = render(
      <FormResponsesList rows={mockFormResponses} />,
    );
    await waitFor(() => {
      expect(getByRole("button", { name: "Select all" })).toBeInTheDocument();
      expect(getByRole("button", { name: "Delete" })).toBeInTheDocument();
    });
  });

  it("handles select/deselect all", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(
      <FormResponsesList rows={mockFormResponses} />,
    );

    await waitFor(() => {
      expect(getByRole("button", { name: "Select all" })).toBeInTheDocument();
    });

    const selectAllButton = getByRole("button", { name: "Select all" });
    await user.click(selectAllButton);

    // Expect all items to be selected
    for (const response of mockFormResponses) {
      expect(getByRole("option", { name: response.field })).toHaveAttribute(
        "aria-selected",
        "true",
      );
    }

    const deselectAllButton = getByRole("button", { name: "Deselect all" });
    await user.click(deselectAllButton);

    // Expect all items to be deselected
    for (const response of mockFormResponses) {
      expect(getByRole("option", { name: response.field })).toHaveAttribute(
        "aria-selected",
        "false",
      );
    }
  });

  it("shows the selected count in the delete button", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(
      <FormResponsesList rows={mockFormResponses} />,
    );

    // Shows "Delete 1 item" when 1 item selected
    await user.click(getByRole("option", { name: "firstName" }));
    await waitFor(() => {
      expect(
        getByRole("button", { name: "Delete 1 response" }),
      ).toBeInTheDocument();
    });

    // Shows "Delete x items" when x items selected
    await user.click(getByRole("option", { name: "middleName" }));
    await waitFor(() => {
      expect(
        getByRole("button", { name: "Delete 2 responses" }),
      ).toBeInTheDocument();
    });

    // Shows "Delete all data" when all items selected
    await user.click(getByRole("button", { name: "Select all" }));
    await waitFor(() => {
      expect(
        getByRole("button", { name: "Delete all responses" }),
      ).toBeInTheDocument();
    });

    // Shows "Delete" when no items selected
    await user.click(getByRole("button", { name: "Deselect all" }));
    await waitFor(() => {
      expect(getByRole("button", { name: "Delete" })).toBeInTheDocument();
    });
  });

  it("shows delete modal when delete button is clicked", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(
      <FormResponsesList rows={mockFormResponses} />,
    );

    await waitFor(() => {
      expect(getByRole("option", { name: "firstName" })).toBeInTheDocument();
    });

    // Select first item
    const firstItem = getByRole("option", { name: "firstName" });
    await user.click(firstItem);

    // Click delete button
    const deleteButton = getByRole("button", { name: "Delete 1 response" });
    await user.click(deleteButton);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});

describe("getReadableFieldLabel", () => {
  it("returns the correct label for a field", () => {
    expect(getReadableFieldLabel("newFirstName")).toBe("New first name");
  });

  it("returns the field as-is if it's not in the USER_FORM_DATA_FIELDS object", () => {
    expect(getReadableFieldLabel("nonExistentField")).toBe("nonExistentField");
  });
});
