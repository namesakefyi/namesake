import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  initializeEncryption,
  getEncryptionKey,
  encryptData,
  decryptData,
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
    storeData.clear();

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
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 // ciphertext
        ]);
      }),
      decrypt: vi.fn().mockImplementation(async () => new Uint8Array([4, 5, 6])),
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
      expect(mockStore.put).toHaveBeenCalledWith(expect.any(String), "device-dek");
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
    it("should encrypt and decrypt data", async () => {
      await initializeEncryption();
      const key = await getEncryptionKey();
      if (!key) throw new Error("Key should exist");

      const data = "test data";
      const encrypted = await encryptData(data, key);
      expect(encrypted).toBeDefined();
      expect(typeof encrypted).toBe("string");
      
      // Verify it's valid base64
      expect(() => atob(encrypted)).not.toThrow();

      const mockCrypto = window.crypto as any;
      mockCrypto.subtle.decrypt.mockImplementationOnce(async () =>
        new TextEncoder().encode(data)
      );

      const decrypted = await decryptData(encrypted, key);
      expect(decrypted).toBe(data);
    });

    it("should handle empty strings", async () => {
      await initializeEncryption();
      const key = await getEncryptionKey();
      if (!key) throw new Error("Key should exist");

      const data = "";
      const encrypted = await encryptData(data, key);
      expect(() => atob(encrypted)).not.toThrow();

      const mockCrypto = window.crypto as any;
      mockCrypto.subtle.decrypt.mockImplementationOnce(async () =>
        new TextEncoder().encode(data)
      );

      const decrypted = await decryptData(encrypted, key);
      expect(decrypted).toBe(data);
    });

    it("should handle special characters", async () => {
      await initializeEncryption();
      const key = await getEncryptionKey();
      if (!key) throw new Error("Key should exist");

      const data = "!@#$%^&*()_+-=[]{}|;:,.<>?`~'\"\\";
      const encrypted = await encryptData(data, key);
      expect(() => atob(encrypted)).not.toThrow();

      const mockCrypto = window.crypto as any;
      mockCrypto.subtle.decrypt.mockImplementationOnce(async () =>
        new TextEncoder().encode(data)
      );

      const decrypted = await decryptData(encrypted, key);
      expect(decrypted).toBe(data);
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
      mockCrypto.subtle.decrypt.mockRejectedValueOnce(new Error("Invalid data"));

      // Use valid base64 but invalid encrypted data
      await expect(decryptData("AAAA", key)).rejects.toThrow();
    });
  });
});
