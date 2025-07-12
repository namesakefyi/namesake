import { renderHook, waitFor } from "@testing-library/react";
import { useQuery } from "convex/react";
import { usePostHog } from "posthog-js/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useEncryptionKey } from "@/hooks/useEncryptionKey";
import { decryptData } from "@/utils/encryption";
import { useDecryptedFormResponses } from "../useDecryptedFormResponses";

vi.mock("@/hooks/useEncryptionKey", () => ({
  useEncryptionKey: vi.fn(),
}));

describe("useDecryptedFormResponses", () => {
  const mockPosthog = {
    captureException: vi.fn(),
  };
  const mockEncryptionKey = new Uint8Array() as unknown as CryptoKey;

  // Mock encrypted responses
  const mockEncryptedResponses = [
    { field: "firstName", value: "encrypted_first_name" },
    { field: "lastName", value: "encrypted_last_name" },
    { field: "email", value: "encrypted_email" },
  ];

  // Mock decrypted values
  const mockDecryptedValues = {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock PostHog
    (usePostHog as ReturnType<typeof vi.fn>).mockReturnValue(mockPosthog);

    // Mock encryption key
    (useEncryptionKey as ReturnType<typeof vi.fn>).mockReturnValue(
      mockEncryptionKey,
    );

    // Mock decryptData
    (decryptData as ReturnType<typeof vi.fn>).mockImplementation(
      async (value: string) => {
        const field = mockEncryptedResponses.find(
          (r) => r.value === value,
        )?.field;
        return mockDecryptedValues[field as keyof typeof mockDecryptedValues];
      },
    );
  });

  it("should return loading state when no responses available", () => {
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue(undefined);

    const { result } = renderHook(() => useDecryptedFormResponses());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBe(false);
  });

  it("should return loading state when no encryption key available", () => {
    // Mock responses to exist but no encryption key
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue(
      mockEncryptedResponses,
    );
    (useEncryptionKey as ReturnType<typeof vi.fn>).mockReturnValue(null);

    const { result } = renderHook(() => useDecryptedFormResponses());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBe(false);
  });

  it("should successfully decrypt form responses", async () => {
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue(
      mockEncryptedResponses,
    );

    const { result } = renderHook(() => useDecryptedFormResponses());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockDecryptedValues);
    expect(result.current.error).toBe(false);
    expect(decryptData).toHaveBeenCalledTimes(3);
  });

  it("should handle individual response decryption failures", async () => {
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue(
      mockEncryptedResponses,
    );

    // Mock decryptData to fail for one response
    (decryptData as ReturnType<typeof vi.fn>).mockImplementation(
      async (value: string) => {
        if (value === "encrypted_last_name") {
          throw new Error("Decryption failed for lastName");
        }
        const field = mockEncryptedResponses.find(
          (r) => r.value === value,
        )?.field;
        return mockDecryptedValues[field as keyof typeof mockDecryptedValues];
      },
    );

    const { result } = renderHook(() => useDecryptedFormResponses());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Should contain only successfully decrypted values
    expect(result.current.data).toEqual({
      firstName: "John",
      email: "john@example.com",
    });
    expect(result.current.error).toBe(false);
    expect(mockPosthog.captureException).toHaveBeenCalledWith(
      expect.any(Error),
    );
  });

  it("should handle complete decryption failure", async () => {
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue(
      mockEncryptedResponses,
    );

    // Mock Promise.all to fail by making the array mapping throw
    const originalPromiseAll = Promise.all;
    Promise.all = vi.fn().mockRejectedValue(new Error("Promise.all failed"));

    const { result } = renderHook(() => useDecryptedFormResponses());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBe(true);
    expect(mockPosthog.captureException).toHaveBeenCalledWith(
      expect.any(Error),
    );

    // Restore Promise.all
    Promise.all = originalPromiseAll;
  });

  it("should handle empty responses array", async () => {
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue([]);

    const { result } = renderHook(() => useDecryptedFormResponses());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBe(false);
    expect(decryptData).not.toHaveBeenCalled();
  });

  it("should update when encrypted responses change", async () => {
    const initialResponses = [
      { field: "firstName", value: "encrypted_first_name" },
    ];
    const updatedResponses = [
      { field: "firstName", value: "encrypted_first_name" },
      { field: "lastName", value: "encrypted_last_name" },
    ];

    const { result, rerender } = renderHook(() => useDecryptedFormResponses());

    // Start with initial responses
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue(initialResponses);
    rerender();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual({
      firstName: "John",
    });

    // Update responses
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue(updatedResponses);
    rerender();

    await waitFor(() => {
      expect(result.current.data).toEqual({
        firstName: "John",
        lastName: "Doe",
      });
    });
  });

  it("should update when encryption key changes", async () => {
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue(
      mockEncryptedResponses,
    );

    const { result, rerender } = renderHook(() => useDecryptedFormResponses());

    // Start with no key
    (useEncryptionKey as ReturnType<typeof vi.fn>).mockReturnValue(null);
    rerender();

    expect(result.current.isLoading).toBe(true);

    // Add encryption key
    (useEncryptionKey as ReturnType<typeof vi.fn>).mockReturnValue(
      mockEncryptionKey,
    );
    rerender();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockDecryptedValues);
    expect(result.current.error).toBe(false);
  });

  it("should handle Promise.all rejection", async () => {
    // Reset mocks to ensure clean state
    vi.clearAllMocks();
    (usePostHog as ReturnType<typeof vi.fn>).mockReturnValue(mockPosthog);
    (useEncryptionKey as ReturnType<typeof vi.fn>).mockReturnValue(
      mockEncryptionKey,
    );
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue(
      mockEncryptedResponses,
    );

    // Mock Promise.all to reject directly
    const originalPromiseAll = Promise.all;
    Promise.all = vi.fn().mockRejectedValue(new Error("Promise.all rejected"));

    const { result } = renderHook(() => useDecryptedFormResponses());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBe(true);
    expect(mockPosthog.captureException).toHaveBeenCalledWith(
      expect.any(Error),
    );

    // Restore Promise.all
    Promise.all = originalPromiseAll;
  });
});
