import { renderHook } from "@testing-library/react";
import { usePostHog } from "posthog-js/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  decryptData,
  encryptData,
  getEncryptionKey,
  initializeEncryption,
  useDecrypt,
} from "./encryption";

interface MockIDBRequest {
  result: any;
  error: Error | null;
  source: any;
  transaction: any;
  readyState: "pending" | "done";
  onerror: ((event: any) => void) | null;
  onsuccess: ((event: any) => void) | null;
  onupgradeneeded?: ((event: any) => void) | null;
}

describe("encryption", () => {
  const storeData = new Map<string, string>();

  // Mock valid base64 DEK (32 random bytes encoded as base64)
  const mockDEK = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";

  function createMockIDBRequest<T>(result: T): MockIDBRequest {
    const request: MockIDBRequest = {
      result,
      error: null,
      source: null,
      transaction: null,
      readyState: "pending",
      onerror: null,
      onsuccess: null,
    };

    setTimeout(() => {
      if (request.onsuccess) {
        request.onsuccess({ target: request } as any);
      }
    }, 0);

    return request;
  }

  const mockStore = {
    put: vi.fn((value: string, key: string) => {
      storeData.set(key, value);
      return createMockIDBRequest(undefined);
    }),
    get: vi.fn((key: string) => {
      return createMockIDBRequest(storeData.get(key));
    }),
  };

  const mockTransaction = {
    objectStore: vi.fn().mockReturnValue(mockStore),
  };

  const mockDB = {
    transaction: vi.fn().mockReturnValue(mockTransaction),
    createObjectStore: vi.fn(),
    objectStoreNames: {
      contains: vi.fn().mockReturnValue(false),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    storeData.clear();

    // Remove the global mock and use local mocks
    vi.unmock("@/utils/encryption");

    // Mock specific functions while keeping useDecrypt implementation
    vi.spyOn(window.crypto.subtle, "decrypt").mockImplementation(async () => {
      return new TextEncoder().encode(JSON.stringify("decrypted"));
    });

    vi.spyOn(window.crypto.subtle, "encrypt").mockImplementation(async () => {
      return new Uint8Array([...new Uint8Array(12), ...new Uint8Array(16)]);
    });

    const mockSubtle = {
      generateKey: vi.fn().mockImplementation(async () => ({
        type: "secret",
        extractable: true,
        algorithm: { name: "AES-GCM", length: 256 },
        usages: ["encrypt", "decrypt"],
      })),
      encrypt: vi.fn().mockImplementation(async () => {
        // Return 12 bytes IV + 16 bytes ciphertext
        return new Uint8Array([
          ...new Uint8Array(12), // IV
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16, // ciphertext
        ]);
      }),
      decrypt: vi
        .fn()
        .mockImplementation(async () => new Uint8Array([4, 5, 6])),
      exportKey: vi.fn().mockImplementation(async () => new Uint8Array(32)), // 32 bytes for AES-256
      importKey: vi.fn().mockImplementation(async () => ({
        type: "secret",
        extractable: true,
        algorithm: { name: "AES-GCM", length: 256 },
        usages: ["encrypt", "decrypt"],
      })),
    };

    vi.stubGlobal("crypto", {
      subtle: mockSubtle,
      getRandomValues: vi.fn((array) => new Uint8Array(array.length)), // Return zeroed array of same length
    });

    vi.stubGlobal("indexedDB", {
      open: vi.fn().mockImplementation(() => {
        const request = createMockIDBRequest(mockDB);
        setTimeout(() => {
          if (request.onupgradeneeded) {
            request.onupgradeneeded({ target: request } as any);
          }
        }, 0);
        return request;
      }),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    storeData.clear();
  });

  describe("initialization", () => {
    it("should initialize encryption and store DEK", async () => {
      await initializeEncryption();
      expect(window.crypto.subtle.generateKey).toHaveBeenCalled();
      expect(mockStore.put).toHaveBeenCalledWith(
        expect.any(String),
        "device-dek",
      );
    });

    it("should not reinitialize if DEK exists", async () => {
      storeData.set("device-dek", mockDEK);
      await initializeEncryption();
      expect(window.crypto.subtle.generateKey).not.toHaveBeenCalled();
    });
  });

  describe("key management", () => {
    it("should retrieve encryption key", async () => {
      storeData.set("device-dek", mockDEK);
      const key = await getEncryptionKey();
      expect(key).toBeDefined();
    });

    it("should return null if no key exists", async () => {
      const key = await getEncryptionKey();
      expect(key).toBeNull();
    });
  });

  describe("encryption/decryption", () => {
    it("should encrypt and decrypt data with JSON handling", async () => {
      await initializeEncryption();
      const key = await getEncryptionKey();
      if (!key) throw new Error("Key should exist");

      const data = {
        string: "test data",
        number: 123,
        boolean: true,
        array: [1, 2, 3],
        nested: { foo: "bar" },
      };
      const encrypted = await encryptData(data, key);
      expect(encrypted).toBeDefined();
      expect(typeof encrypted).toBe("string");

      // Verify it's valid base64
      expect(() => atob(encrypted)).not.toThrow();

      const mockCrypto = window.crypto as any;
      mockCrypto.subtle.decrypt.mockImplementationOnce(async () =>
        new TextEncoder().encode(JSON.stringify(data)),
      );

      const decrypted = await decryptData(encrypted, key);
      expect(decrypted).toEqual(data);
    });

    it("should handle empty values", async () => {
      await initializeEncryption();
      const key = await getEncryptionKey();
      if (!key) throw new Error("Key should exist");

      const testCases = ["", null, [], {}, false];

      for (const data of testCases) {
        const encrypted = await encryptData(data, key);
        expect(() => atob(encrypted)).not.toThrow();

        const mockCrypto = window.crypto as any;
        mockCrypto.subtle.decrypt.mockImplementationOnce(async () =>
          new TextEncoder().encode(JSON.stringify(data)),
        );

        const decrypted = await decryptData(encrypted, key);
        expect(decrypted).toEqual(data);
      }
    });

    it("should handle special characters in JSON strings", async () => {
      await initializeEncryption();
      const key = await getEncryptionKey();
      if (!key) throw new Error("Key should exist");

      const data = {
        special: "!@#$%^&*()_+-=[]{}|;:,.<>?`~'\"\\",
        emoji: "🎉👋🏽🌈",
        multiline: "line1\nline2\r\nline3",
      };
      const encrypted = await encryptData(data, key);
      expect(() => atob(encrypted)).not.toThrow();

      const mockCrypto = window.crypto as any;
      mockCrypto.subtle.decrypt.mockImplementationOnce(async () =>
        new TextEncoder().encode(JSON.stringify(data)),
      );

      const decrypted = await decryptData(encrypted, key);
      expect(decrypted).toEqual(data);
    });
  });

  describe("error handling", () => {
    it("should handle IndexedDB errors", async () => {
      const mockIDB = window.indexedDB as any;
      mockIDB.open.mockImplementationOnce(() => {
        const request = createMockIDBRequest(null);
        setTimeout(() => {
          if (request.onerror) {
            request.error = new Error("IndexedDB error");
            request.onerror({ target: request } as any);
          }
        }, 0);
        return request;
      });

      await expect(initializeEncryption()).rejects.toThrow();
    });

    it("should handle invalid encrypted data", async () => {
      await initializeEncryption();
      const key = await getEncryptionKey();
      if (!key) throw new Error("Key should exist");

      const mockCrypto = window.crypto as any;
      mockCrypto.subtle.decrypt.mockRejectedValueOnce(
        new Error("Invalid data"),
      );

      // Use valid base64 but invalid encrypted data
      await expect(decryptData("AAAA", key)).rejects.toThrow();
    });
  });

  describe("useDecrypt", () => {
    const mockPosthog = {
      captureException: vi.fn(),
    };

    beforeEach(() => {
      // Mock PostHog
      (usePostHog as ReturnType<typeof vi.fn>).mockReturnValue(mockPosthog);

      // Mock the functions directly
      vi.spyOn(window.crypto.subtle, "decrypt").mockImplementation(async () => {
        return new TextEncoder().encode(JSON.stringify("decrypted"));
      });
    });

    it("should decrypt a single value", async () => {
      const encryptedValue = "encrypted1";
      storeData.set("device-dek", mockDEK);

      const { result } = renderHook(() => useDecrypt(encryptedValue));

      await vi.waitFor(() => {
        expect(result.current.decryptedValue).toBe("decrypted");
      });
      expect(result.current.error).toBe(false);
    });

    it("should decrypt multiple values", async () => {
      const encryptedValues = ["encrypted1", "encrypted2"];
      storeData.set("device-dek", mockDEK);

      const { result } = renderHook(() => useDecrypt(encryptedValues));

      await vi.waitFor(() => {
        expect(result.current.decryptedValues).toEqual([
          "decrypted",
          "decrypted",
        ]);
      });
      expect(result.current.error).toBe(false);
    });

    it("should handle undefined input", () => {
      const { result } = renderHook(() => useDecrypt(undefined));
      expect(result.current.decryptedValue).toBeUndefined();
      expect(result.current.error).toBe(false);
    });

    it("should handle decryption errors", async () => {
      const encryptedValue = "encrypted1";
      storeData.set("device-dek", mockDEK);

      vi.spyOn(window.crypto.subtle, "decrypt").mockRejectedValueOnce(
        new Error("Decryption failed"),
      );

      const { result } = renderHook(() => useDecrypt(encryptedValue));

      await vi.waitFor(() => {
        expect(result.current.error).toBe(true);
      });
      expect(mockPosthog.captureException).toHaveBeenCalled();
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

      await vi.waitFor(() => {
        expect(result.current.decryptedValue).toBe("decrypted");
      });

      rerender(updatedValue);

      await vi.waitFor(() => {
        expect(result.current.decryptedValue).toBe("decrypted");
      });
    });
  });
});
