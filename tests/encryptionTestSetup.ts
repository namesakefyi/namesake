import { vi } from "vitest";

export const storeData = new Map<string, string>();
export const mockDEK = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";

function createMockIDBRequest<T>(result: T) {
  const request: any = {
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
      request.onsuccess({ target: request });
    }
  }, 0);
  return request;
}

export const mockStore = {
  put: vi.fn((value: string, key: string) => {
    storeData.set(key, value);
    return createMockIDBRequest(undefined);
  }),
  get: vi.fn((key: string) => {
    return createMockIDBRequest(storeData.get(key));
  }),
};

export const mockTransaction = {
  objectStore: vi.fn().mockReturnValue(mockStore),
};

export const mockDB = {
  transaction: vi.fn().mockReturnValue(mockTransaction),
  createObjectStore: vi.fn(),
  objectStoreNames: {
    contains: vi.fn().mockReturnValue(false),
  },
};

export function setupEncryptionMocks() {
  vi.clearAllMocks();
  storeData.clear();

  // Remove the global mock and use local mocks
  vi.unmock("@/utils/encryption");

  const mockSubtle = {
    generateKey: vi.fn().mockImplementation(async () => ({
      type: "secret",
      extractable: true,
      algorithm: { name: "AES-GCM", length: 256 },
      usages: ["encrypt", "decrypt"],
    })),
    encrypt: vi.fn().mockImplementation(async () => {
      return new Uint8Array([
        ...new Uint8Array(12),
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
        16,
      ]);
    }),
    decrypt: vi.fn().mockImplementation(async () => new Uint8Array([4, 5, 6])),
    exportKey: vi.fn().mockImplementation(async () => new Uint8Array(32)),
    importKey: vi.fn().mockImplementation(async () => ({
      type: "secret",
      extractable: true,
      algorithm: { name: "AES-GCM", length: 256 },
      usages: ["encrypt", "decrypt"],
    })),
  };

  vi.stubGlobal("crypto", {
    subtle: mockSubtle,
    getRandomValues: vi.fn((array) => new Uint8Array(array.length)),
  });

  vi.stubGlobal("indexedDB", {
    open: vi.fn().mockImplementation(() => {
      const request = createMockIDBRequest(mockDB);
      setTimeout(() => {
        if (request.onupgradeneeded) {
          request.onupgradeneeded({ target: request });
        }
      }, 0);
      return request;
    }),
  });
}

export function teardownEncryptionMocks() {
  vi.clearAllMocks();
  storeData.clear();
}
