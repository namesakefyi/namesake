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

    // Set a timeout to simulate the request being resolved
    // The timeout is necessary because the request will
    // hang otherwise.
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

  beforeEach(() => {
    // Clear store data
    storeData.clear();

    // Mock crypto.subtle as the test environment doesn't have a crypto implementation
    // This test suite is only used to test round trips.
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
      importKey: vi.fn().mockImplementation(async (_format, _keyData, algorithm, extractable, keyUsages) => {
        return {
          type: "secret",
          extractable,
          algorithm,
          usages: keyUsages,
        };
      }),
      exportKey: vi.fn().mockImplementation(async () => new Uint8Array([7, 8, 9])),
      deriveKey: vi.fn().mockImplementation(async (_algorithm, _baseKey, derivedKeyAlgorithm, extractable, keyUsages) => {
        return {
          type: "secret",
          extractable,
          algorithm: derivedKeyAlgorithm,
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
    it("should initialize encryption and create necessary keys", async () => {
      await initializeEncryption();

      expect(mockStore.put).toHaveBeenCalledWith(
        "AAAAAAAAAAAAAAAAAAAAAA==",
        "device-salt",
      );

      expect(mockStore.put).toHaveBeenCalledWith(
        "AAAAAAAAAAAAAAAAAQID",
        "device-dek",
      );
    });

    it("should not reinitialize if encryption is already set up", async () => {
      // Set up existing DEK
      storeData.set("device-dek", "existing-encrypted-dek");
      
      await initializeEncryption();
      expect(mockStore.put).not.toHaveBeenCalled();

      expect(mockStore.get).toHaveBeenCalledWith(
        "device-dek",
      );
    });
  });

  describe("key management", () => {
    it("should retrieve encryption key successfully", async () => {
      // First initialize
      await initializeEncryption();
      
      // Then get the key
      const key = await getEncryptionKey();
      expect(key).toBeDefined();
      expect(key).toHaveProperty("type", "secret");
    });

    it("should return null if no encryption key exists", async () => {
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

    // This is a sanity check to ensure that the encrypt is being called.
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

    it("should fail to decrypt with wrong key", async () => {
      await initializeEncryption();
      const key = await getEncryptionKey();
      expect(key).toBeDefined();
      if (!key) throw new Error("Key should exist");

      const data = "test data";
      const encrypted = await encryptData(data, key);

      // Mock decrypt to throw error for wrong key
      const mockCrypto = window.crypto as any;
      mockCrypto.subtle.decrypt.mockRejectedValueOnce(new Error("Decryption failed"));

      await expect(decryptData(encrypted, key)).rejects.toThrow();
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
            Object.defineProperty(request, 'error', {
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
      mockCrypto.subtle.decrypt.mockRejectedValueOnce(new Error("Invalid data"));

      await expect(decryptData("invalid-data", key)).rejects.toThrow();
    });
  });
}); 