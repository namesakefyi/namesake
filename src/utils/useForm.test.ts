import { renderHook, waitFor } from "@testing-library/react";
import { useMutation, useQuery } from "convex/react";
import posthog from "posthog-js";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { decryptData, encryptData, useEncryptionKey } from "./encryption";
import { useForm } from "./useForm";

// Mock the form fields
const mockFields = ["firstName", "lastName", "email"];

// Mock the encrypted responses
const mockEncryptedResponses = [
  { field: "firstName", value: "encrypted_first_name" },
  { field: "lastName", value: "encrypted_last_name" },
  { field: "email", value: "encrypted_email" },
];

// Mock the decrypted values
const mockDecryptedValues = {
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
};

describe("useForm", () => {
  const mockSave = vi.fn();
  const mockKey = new Uint8Array() as unknown as CryptoKey;

  const submitForm = async (result: ReturnType<typeof useForm>, data: any) => {
    return result.handleSubmit(result.onSubmit as any)(data);
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock Convex hooks
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue(
      mockEncryptedResponses,
    );
    (useMutation as ReturnType<typeof vi.fn>).mockReturnValue(mockSave);

    // Mock encryption hooks and functions
    (useEncryptionKey as ReturnType<typeof vi.fn>).mockReturnValue(mockKey);
    (decryptData as ReturnType<typeof vi.fn>).mockImplementation(
      async (value: string) => {
        const field = mockEncryptedResponses.find(
          (r) => r.value === value,
        )?.field;
        return mockDecryptedValues[field as keyof typeof mockDecryptedValues];
      },
    );
    (encryptData as ReturnType<typeof vi.fn>).mockImplementation(
      async (value: string) => `encrypted_${value}`,
    );
  });

  it("should initialize with empty form", () => {
    const { result } = renderHook(() => useForm(mockFields));

    expect(result.current.getValues()).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });

  it("should load and decrypt saved responses", async () => {
    const { result } = renderHook(() => useForm(mockFields));

    await waitFor(() => {
      expect(result.current.getValues()).toEqual(mockDecryptedValues);
    });
  });

  it("should handle form submission", async () => {
    const { result } = renderHook(() => useForm(mockFields));
    const testData = {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
    };

    await submitForm(result.current, testData);

    expect(encryptData).toHaveBeenCalledTimes(3);
    expect(mockSave).toHaveBeenCalledTimes(3);
    expect(toast.success).toHaveBeenCalledWith("Form submitted!");
  });

  it("should handle submission errors", async () => {
    const mockError = new Error("Submission failed");
    mockSave.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useForm(mockFields));
    const testData = { firstName: "Jane" };

    await submitForm(result.current, testData);

    expect(toast.error).toHaveBeenCalledWith(
      "An error occurred during submission. Please try again.",
    );
    expect(posthog.captureException).toHaveBeenCalledWith(mockError);
  });

  it("should handle missing encryption key", async () => {
    (useEncryptionKey as ReturnType<typeof vi.fn>).mockReturnValue(null);
    const consoleSpy = vi.spyOn(console, "error");

    const { result } = renderHook(() => useForm(mockFields));
    const testData = { firstName: "Jane" };

    await submitForm(result.current, testData);

    expect(consoleSpy).toHaveBeenCalledWith("No encryption key available");
    expect(mockSave).not.toHaveBeenCalled();
  });
});
