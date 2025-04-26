import {
  mockDEK,
  setupEncryptionMocks,
  storeData,
  teardownEncryptionMocks,
} from "@tests/encryptionTestSetup";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  decryptData,
  encryptData,
  getEncryptionKey,
  initializeEncryption,
} from "../encryption";

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
  beforeEach(() => {
    setupEncryptionMocks();
  });

  afterEach(() => {
    teardownEncryptionMocks();
  });

  describe("initialization", () => {
    it("should initialize encryption and store DEK", async () => {
      await initializeEncryption();
      expect(window.crypto.subtle.generateKey).toHaveBeenCalled();
      expect(storeData.get("device-dek")).toBeDefined();
    });

    it("should not reinitialize if DEK exists", async () => {
      storeData.set("device-dek", mockDEK);
      await initializeEncryption();
      expect(window.crypto.subtle.generateKey).not.toHaveBeenCalled();
    });
  });

  describe("key management", () => {
    it("should retrieve encryption key", async () => {
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
});

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
