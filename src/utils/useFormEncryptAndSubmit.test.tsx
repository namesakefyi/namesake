import { act, renderHook } from "@testing-library/react";
import { useMutation } from "convex/react";
import posthog from "posthog-js";
import type React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { encryptData, useEncryptionKey } from "./encryption";
import { useFormEncryptAndSubmit } from "./useFormEncryptAndSubmit";

vi.mock("@/utils/encryption", () => ({
  useEncryptionKey: vi.fn(() => "test-key"),
  encryptData: vi.fn(),
}));

vi.mock("react-hook-form", () => ({
  useForm: ({ defaultValues = {} } = {}) => ({
    handleSubmit: (fn: any) => () => fn(defaultValues),
    formState: { errors: {} },
    getValues: () => defaultValues,
    setValue: vi.fn(),
  }),
}));

describe("useFormEncryptAndSubmit", () => {
  const mockSave = vi.fn();
  const mockEncryptionKey = "test-key";
  const mockEncryptedValue = "encrypted-data";
  const mockEvent = {
    preventDefault: () => {},
  } as React.FormEvent<HTMLFormElement>;

  beforeEach(() => {
    vi.clearAllMocks();
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockSave,
    );
    (useEncryptionKey as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockEncryptionKey,
    );
    (encryptData as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockEncryptedValue,
    );
  });

  it("successfully submits and encrypts form data", async () => {
    const defaultValues = {
      name: "Sylvia Rivera",
      email: "sylvia@example.com",
    };

    const form = useForm({ defaultValues });
    const { result } = renderHook(() => useFormEncryptAndSubmit(form));

    await act(async () => {
      await result.current.onSubmit(mockEvent);
    });

    // Verify encryption was called for each field
    expect(encryptData).toHaveBeenCalledWith(
      "Sylvia Rivera",
      mockEncryptionKey,
    );
    expect(encryptData).toHaveBeenCalledWith(
      "sylvia@example.com",
      mockEncryptionKey,
    );

    // Verify save mutation was called for each field
    expect(mockSave).toHaveBeenCalledWith({
      field: "name",
      value: mockEncryptedValue,
    });
    expect(mockSave).toHaveBeenCalledWith({
      field: "email",
      value: mockEncryptedValue,
    });

    // Verify success toast was shown
    expect(toast.success).toHaveBeenCalledWith("Form submitted!");
  });

  it("skips empty fields", async () => {
    const defaultValues = {
      name: "Sylvia Rivera",
      email: "",
      phone: null,
      address: undefined,
    };

    const form = useForm({ defaultValues });
    const { result } = renderHook(() => useFormEncryptAndSubmit(form));

    await act(async () => {
      await result.current.onSubmit(mockEvent);
    });

    // Verify encryption was only called for non-empty fields
    expect(encryptData).toHaveBeenCalledTimes(1);
    expect(encryptData).toHaveBeenCalledWith(
      "Sylvia Rivera",
      mockEncryptionKey,
    );

    // Verify save mutation was only called for non-empty fields
    expect(mockSave).toHaveBeenCalledTimes(1);
    expect(mockSave).toHaveBeenCalledWith({
      field: "name",
      value: mockEncryptedValue,
    });
  });

  it("handles missing encryption key", async () => {
    (useEncryptionKey as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      null,
    );
    const consoleSpy = vi.spyOn(console, "error");

    const defaultValues = {
      name: "Sylvia Rivera",
    };

    const form = useForm({ defaultValues });
    const { result } = renderHook(() => useFormEncryptAndSubmit(form));

    await act(async () => {
      await result.current.onSubmit(mockEvent);
    });

    expect(consoleSpy).toHaveBeenCalledWith("No encryption key available");
    expect(encryptData).not.toHaveBeenCalled();
    expect(mockSave).not.toHaveBeenCalled();
  });

  it("handles encryption errors", async () => {
    const error = new Error("Encryption failed");
    (encryptData as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
      error,
    );

    const defaultValues = {
      name: "Sylvia Rivera",
    };

    const form = useForm({ defaultValues });
    const { result } = renderHook(() => useFormEncryptAndSubmit(form));

    await act(async () => {
      await result.current.onSubmit(mockEvent);
    });

    expect(posthog.captureException).toHaveBeenCalledWith(error);
    expect(toast.error).toHaveBeenCalledWith(
      "An error occurred during submission. Please try again.",
    );
  });

  it("handles save mutation errors", async () => {
    const error = new Error("Save failed");
    mockSave.mockRejectedValue(error);

    const defaultValues = {
      name: "Sylvia Rivera",
    };

    const form = useForm({ defaultValues });
    const { result } = renderHook(() => useFormEncryptAndSubmit(form));

    await act(async () => {
      await result.current.onSubmit(mockEvent);
    });

    expect(posthog.captureException).toHaveBeenCalledWith(error);
    expect(toast.error).toHaveBeenCalledWith(
      "An error occurred during submission. Please try again.",
    );
  });
});
