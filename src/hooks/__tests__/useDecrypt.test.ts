import { renderHook, waitFor } from "@testing-library/react";
import {
  mockDEK,
  setupEncryptionMocks,
  storeData,
  teardownEncryptionMocks,
} from "@tests/encryptionTestSetup";
import { usePostHog } from "posthog-js/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDecrypt } from "../useDecrypt";

describe("useDecrypt", () => {
  const mockPosthog = {
    captureException: vi.fn(),
  };

  beforeEach(() => {
    // Setup PostHog mock
    (usePostHog as ReturnType<typeof vi.fn>).mockReturnValue(mockPosthog);

    // Setup encryption mocks
    setupEncryptionMocks();

    // Override decrypt implementation for useDecrypt tests
    vi.spyOn(window.crypto.subtle, "decrypt").mockImplementation(async () => {
      const uint8Array = new TextEncoder().encode(JSON.stringify("decrypted"));
      return uint8Array.buffer.slice(
        uint8Array.byteOffset,
        uint8Array.byteOffset + uint8Array.byteLength,
      );
    });
  });

  afterEach(() => {
    teardownEncryptionMocks();
  });

  it("should decrypt a single value", async () => {
    const encryptedValue = "encrypted1";
    storeData.set("device-dek", mockDEK);

    const { result } = renderHook(() => useDecrypt(encryptedValue));

    await waitFor(() =>
      expect(result.current.decryptedValue).toBe("decrypted"),
    );
    expect(result.current.error).toBe(false);
  });

  it("should decrypt multiple values", async () => {
    const encryptedValues = ["encrypted1", "encrypted2"];
    storeData.set("device-dek", mockDEK);

    const { result } = renderHook(() => useDecrypt(encryptedValues));

    await waitFor(() => {
      expect(result.current.decryptedValues).toEqual([
        "decrypted",
        "decrypted",
      ]);
    });

    expect(result.current.error).toBe(false);
  });

  it("should handle undefined input", async () => {
    const { result } = renderHook(() => useDecrypt(undefined));
    await waitFor(() => {
      expect(result.current.decryptedValue).toBeUndefined();
      expect(result.current.error).toBe(false);
    });
  });

  it("should handle decryption errors", async () => {
    const encryptedValue = "encrypted1";
    storeData.set("device-dek", mockDEK);

    vi.spyOn(window.crypto.subtle, "decrypt").mockRejectedValueOnce(
      new Error("Decryption failed"),
    );

    const { result } = renderHook(() => useDecrypt(encryptedValue));

    await waitFor(() => {
      expect(result.current.error).toBe(true);
      expect(mockPosthog.captureException).toHaveBeenCalled();
    });
  });

  it("should handle missing encryption key", async () => {
    const encryptedValue = "encrypted1";
    // Don't set mockDEK in store, so key will be null

    const { result } = renderHook(() => useDecrypt(encryptedValue));

    expect(result.current.decryptedValue).toBeUndefined();
  });

  it("should update when encrypted values change", async () => {
    const initialValue = "encrypted1";
    const updatedValue = "encrypted2";
    storeData.set("device-dek", mockDEK);

    const { result, rerender } = renderHook((props) => useDecrypt(props), {
      initialProps: initialValue,
    });

    await waitFor(() =>
      expect(result.current.decryptedValue).toBe("decrypted"),
    );

    rerender(updatedValue);

    await waitFor(() =>
      expect(result.current.decryptedValue).toBe("decrypted"),
    );
  });
});
