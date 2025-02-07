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
  // Mock store data
  const storeData = new Map<string, string>();

  // Mock IDBRequest creator
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

  // Mock store
  const mockStore = {
    put: vi.fn((value: string, key: string) => {
      storeData.set(key, value);
      return createMockIDBRequest(undefined);
    }),
    get: vi.fn((key: string) => {
      return createMockIDBRequest(storeData.get(key));
    }),
  };

  // Mock transaction
  const mockTransaction = {
    objectStore: vi.fn().mockReturnValue(mockStore),
  };

  // Mock database
  const mockDB = {
    transaction: vi.fn().mockReturnValue(mockTransaction),
    createObjectStore: vi.fn(),
    objectStoreNames: {
      contains: vi.fn().mockReturnValue(false),
    },
  };

  // Mock key for consistent testing
  const mockJWK = {
    kty: "oct",
    k: "mock-key-material",
    alg: "A256GCM",
    ext: true,
    key_ops: ["encrypt", "decrypt"],
  };

  beforeEach(() => {
    // Clear store data
    storeData.clear();

    // Mock crypto.subtle
    const mockSubtle = {
      generateKey: vi.fn().mockImplementation(async (algorithm, extractable, keyUsages) => {
        return {
          type: "secret",
          extractable,
          algorithm,
          usages: keyUsages,
        };
      }),
      encrypt: vi.fn().mockImplementation(async () => new Uint8Array([1, 2, 3])),
      decrypt: vi.fn().mockImplementation(async () => new Uint8Array([4, 5, 6])),
      exportKey: vi.fn().mockImplementation(async () => mockJWK),
      importKey: vi.fn().mockImplementation(async (_format, _keyData, algorithm, extractable, keyUsages) => {
        return {
          type: "secret",
          extractable,
          algorithm,
          usages: keyUsages,
        };
      }),
    };

    // Mock crypto
    const mockCrypto = {
      subtle: mockSubtle,
      getRandomValues: vi.fn((array) => array),
    };

    // Mock window.crypto
    vi.stubGlobal("crypto", mockCrypto);

    // Mock IndexedDB
    const mockIDB = {
      open: vi.fn().mockImplementation(() => {
        const request = createMockIDBRequest(mockDB);
        setTimeout(() => {
          if (request.onupgradeneeded) {
            request.onupgradeneeded({ target: request } as any);
          }
        }, 0);
        return request;
      }),
    };

    vi.stubGlobal("indexedDB", mockIDB);
  });

  afterEach(() => {
    vi.clearAllMocks();
    storeData.clear();
  });

  describe("initialization", () => {
    it("should initialize encryption and store the serialized DEK", async () => {
      await initializeEncryption();

      // Verify the DEK was generated and stored
      expect(window.crypto.subtle.generateKey).toHaveBeenCalledWith(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
      );

      // Verify the DEK was exported as JWK
      expect(window.crypto.subtle.exportKey).toHaveBeenCalledWith(
        "jwk",
        expect.any(Object)
      );

      // Verify the serialized DEK was stored
      expect(mockStore.put).toHaveBeenCalledWith(
        JSON.stringify(mockJWK),
        "device-dek"
      );
    });

    it("should not reinitialize if DEK already exists", async () => {
      // Set up existing DEK
      storeData.set("device-dek", JSON.stringify(mockJWK));
      
      await initializeEncryption();

      // Verify no new key was generated
      expect(window.crypto.subtle.generateKey).not.toHaveBeenCalled();
      expect(mockStore.put).not.toHaveBeenCalled();
    });
  });

  describe("key management", () => {
    it("should retrieve and deserialize DEK successfully", async () => {
      // Store a serialized DEK
      storeData.set("device-dek", JSON.stringify(mockJWK));

      const key = await getEncryptionKey();
      
      // Verify key was imported as non-extractable
      expect(window.crypto.subtle.importKey).toHaveBeenCalledWith(
        "jwk",
        mockJWK,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
      );

      expect(key).toBeDefined();
      expect(key).toHaveProperty("type", "secret");
      expect(key).toHaveProperty("extractable", false);
    });

    it("should return null if no DEK exists", async () => {
      const key = await getEncryptionKey();
      expect(key).toBeNull();
    });
  });

  describe("data encryption/decryption", () => {
    it("should encrypt and decrypt data correctly", async () => {
      await initializeEncryption();
      const key = await getEncryptionKey();
      expect(key).toBeDefined();
      if (!key) throw new Error("Key should exist");

      const originalData = "sensitive information";
      const encrypted = await encryptData(originalData, key);

      expect(encrypted).toBeDefined();
      expect(encrypted).not.toBe(originalData);
      expect(typeof encrypted).toBe("string");

      // Mock the decrypt operation to return our original data
      const mockCrypto = window.crypto as any;
      mockCrypto.subtle.decrypt.mockImplementationOnce(async () =>
        new TextEncoder().encode(originalData)
      );

      const decrypted = await decryptData(encrypted, key);
      expect(decrypted).toBe(originalData);
    });

    it("should encrypt different values to different ciphertexts", async () => {
      await initializeEncryption();
      const key = await getEncryptionKey();
      expect(key).toBeDefined();
      if (!key) throw new Error("Key should exist");

      const data = "test data";
      const encrypted1 = await encryptData(data, key);

      // Change mock implementation for second encryption
      const mockCrypto = window.crypto as any;
      mockCrypto.subtle.encrypt.mockImplementationOnce(async () =>
        new Uint8Array([4, 5, 6])
      );

      const encrypted2 = await encryptData(data, key);
      expect(encrypted1).not.toBe(encrypted2);
    });

    it("should handle empty strings", async () => {
      await initializeEncryption();
      const key = await getEncryptionKey();
      expect(key).toBeDefined();
      if (!key) throw new Error("Key should exist");

      const emptyString = "";
      const encrypted = await encryptData(emptyString, key);

      // Mock decrypt to return empty string
      const mockCrypto = window.crypto as any;
      mockCrypto.subtle.decrypt.mockImplementationOnce(async () =>
        new TextEncoder().encode(emptyString)
      );

      const decrypted = await decryptData(encrypted, key);
      expect(decrypted).toBe(emptyString);
    });

    it("should handle special characters", async () => {
      await initializeEncryption();
      const key = await getEncryptionKey();
      expect(key).toBeDefined();
      if (!key) throw new Error("Key should exist");

      const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?`~'\"\\";
      const encrypted = await encryptData(specialChars, key);

      // Mock decrypt to return special characters
      const mockCrypto = window.crypto as any;
      mockCrypto.subtle.decrypt.mockImplementationOnce(async () =>
        new TextEncoder().encode(specialChars)
      );

      const decrypted = await decryptData(encrypted, key);
      expect(decrypted).toBe(specialChars);
    });

    it("should handle unicode characters", async () => {
      await initializeEncryption();
      const key = await getEncryptionKey();
      expect(key).toBeDefined();
      if (!key) throw new Error("Key should exist");

      const unicode = "Hello, світ! 👋 🌍";
      const encrypted = await encryptData(unicode, key);

      // Mock decrypt to return unicode string
      const mockCrypto = window.crypto as any;
      mockCrypto.subtle.decrypt.mockImplementationOnce(async () =>
        new TextEncoder().encode(unicode)
      );

      const decrypted = await decryptData(encrypted, key);
      expect(decrypted).toBe(unicode);
    });
  });

  describe("error handling", () => {
    it("should handle IndexedDB errors gracefully", async () => {
      const mockIDB = window.indexedDB as any;
      mockIDB.open.mockImplementationOnce(() => {
        const request = createMockIDBRequest(null);
        setTimeout(() => {
          if (request.onerror) {
            const error = new Error("IndexedDB error");
            Object.defineProperty(request, "error", {
              value: error,
              writable: true
            });
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
      expect(key).toBeDefined();
      if (!key) throw new Error("Key should exist");

      // Mock decrypt to throw error for invalid data
      const mockCrypto = window.crypto as any;
      mockCrypto.subtle.decrypt.mockRejectedValueOnce(
        new Error("Invalid data")
      );

      await expect(decryptData("invalid-data", key)).rejects.toThrow();
    });

    it("should handle invalid serialized DEK", async () => {
      // Store invalid JWK
      storeData.set("device-dek", "invalid-jwk");

      await expect(getEncryptionKey()).rejects.toThrow();
    });
  });
});
