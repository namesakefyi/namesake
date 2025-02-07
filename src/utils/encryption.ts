// Constants
const DB_NAME = "namesake-encryption";
const STORE_NAME = "encryption-keys";
const DEK_KEY = "device-dek";
const DEVICE_SALT_KEY = "device-salt";
const KEK_SEED_KEY = "kek-seed";

const IV_LENGTH = 12;
const SALT_LENGTH = 16;
const SEED_LENGTH = 32; // 256 bits of entropy for the KEK seed

// 600K iterations is recommended by the OWASP for PBKDF2
// https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#pbkdf2
const KEK_ITERATIONS = 600000;

/**
 * Encryption module using AES-GCM with a two-key system:
 *
 * - Data Encryption Key (DEK): Used to encrypt/decrypt actual data
 * - Key Encryption Key (KEK): Protects the DEK
 *
 * The encrypted DEK is stored in IndexedDB. The KEK is non-extractable
 * and derived from a device-specific salt (stored in IndexedDB) using PBKDF2.
 */

/**
 * Security Considerations:
 * 1. Data is encrypted at rest using AES-GCM
 * 2. KEKs are isolated to the device
 * 3. There are memory exposure risks here as this is a JavaScript client
 * 4. Key-rotation is not implemented as it does not apply to this use case
 */

/**
 * Encrypts data with the DEK
 * @param data - The data to encrypt
 * @param dek - The DEK to encrypt the data with
 * @returns The encrypted data
 */
export async function encryptData(
  data: string,
  dek: CryptoKey,
): Promise<string> {
  const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encodedData = new TextEncoder().encode(data);

  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    dek,
    encodedData,
  );

  // Combine IV and encrypted data
  const combined = new Uint8Array(iv.length + encryptedData.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encryptedData), iv.length);

  return arrayBufferToBase64(combined);
}

/**
 * Decrypts data with the DEK
 * @param encryptedDataString - The encrypted data to decrypt
 * @param dek - The DEK to decrypt the data with
 * @returns The decrypted data
 */
export async function decryptData(
  encryptedDataString: string,
  dek: CryptoKey,
): Promise<string> {
  const encryptedData = new Uint8Array(
    base64ToArrayBuffer(encryptedDataString),
  );
  const iv = encryptedData.slice(0, IV_LENGTH);
  const data = encryptedData.slice(IV_LENGTH);

  const decryptedData = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    dek,
    data,
  );

  return new TextDecoder().decode(decryptedData);
}

/**
 * Initializes encryption for the device
 * @returns The DEK
 */
export async function initializeEncryption(): Promise<void> {
  // Check if encryption is already initialized
  const existingDEK = await retrieveDEK();
  if (existingDEK) return;

  const kek = await generateKEK();
  const dek = await generateDEK();
  const encryptedDEK = await encryptDEK(kek, dek);

  // Store encrypted DEK
  await storeDEK(encryptedDEK);
}

/**
 * Gets the encryption key. If one doesn't exist, create one.
 * @returns The DEK
 */
export async function getEncryptionKey(): Promise<CryptoKey | null> {
  const encryptedDEK = await retrieveDEK();
  if (!encryptedDEK) return null;

  const kek = await generateKEK();
  const decryptedDEK = await decryptDEK(kek, encryptedDEK);
  return decryptedDEK;
}

// Helper functions for base64 encoding/decoding
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Initialize IndexedDB
async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

// Generate a device-specific salt
async function generateDeviceSalt(): Promise<Uint8Array> {
  return window.crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
}

// Store salt in IndexedDB
async function storeSalt(salt: Uint8Array): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(arrayBufferToBase64(salt), DEVICE_SALT_KEY);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// Retrieve salt from IndexedDB
async function retrieveSalt(): Promise<Uint8Array | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(DEVICE_SALT_KEY);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      if (!request.result) {
        resolve(null);
        return;
      }
      resolve(new Uint8Array(base64ToArrayBuffer(request.result)));
    };
  });
}

// Generate a deterministic KEK from the device salt and KEK seed
async function generateKEK(): Promise<CryptoKey> {
  let salt = await retrieveSalt();
  if (!salt) {
    salt = await generateDeviceSalt();
    await storeSalt(salt);
  }

  // Get or generate KEK seed
  let kekSeed = await retrieveKEKSeed();
  if (!kekSeed) {
    kekSeed = await generateKEKSeed();
    await storeKEKSeed(kekSeed);
  }

  // Use the salt and KEK seed to derive a key
  const baseKey = await window.crypto.subtle.importKey(
    "raw",
    kekSeed,
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"],
  );

  return await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: KEK_ITERATIONS,
      hash: "SHA-256",
    },
    baseKey,
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["encrypt", "decrypt"],
  );
}

// Generate a random KEK seed
async function generateKEKSeed(): Promise<Uint8Array> {
  return window.crypto.getRandomValues(new Uint8Array(SEED_LENGTH));
}

// Store KEK seed in IndexedDB
async function storeKEKSeed(seed: Uint8Array): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(arrayBufferToBase64(seed), KEK_SEED_KEY);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// Retrieve KEK seed from IndexedDB
async function retrieveKEKSeed(): Promise<Uint8Array | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(KEK_SEED_KEY);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      if (!request.result) {
        resolve(null);
        return;
      }
      resolve(new Uint8Array(base64ToArrayBuffer(request.result)));
    };
  });
}

// Generate a new data encryption key (DEK)
async function generateDEK(): Promise<CryptoKey> {
  return await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true, // extractable so it can be encrypted by the KEK
    ["encrypt", "decrypt"],
  );
}

// Encrypt the DEK with the KEK
async function encryptDEK(kek: CryptoKey, dek: CryptoKey): Promise<string> {
  const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const exportedDEK = await window.crypto.subtle.exportKey("raw", dek);

  const encryptedDEK = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    kek,
    exportedDEK,
  );

  // Combine IV and encrypted DEK
  const combined = new Uint8Array(iv.length + encryptedDEK.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encryptedDEK), iv.length);

  return arrayBufferToBase64(combined);
}

// Decrypt the DEK with the KEK
async function decryptDEK(
  kek: CryptoKey,
  encryptedDEKString: string,
): Promise<CryptoKey> {
  const encryptedData = new Uint8Array(base64ToArrayBuffer(encryptedDEKString));
  const iv = encryptedData.slice(0, IV_LENGTH);
  const encryptedDEK = encryptedData.slice(IV_LENGTH);
  const dekBuffer = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    kek,
    encryptedDEK,
  );
  return await window.crypto.subtle.importKey(
    "raw",
    dekBuffer,
    "AES-GCM",
    true,
    ["encrypt", "decrypt"],
  );
}

// Store encrypted DEK in IndexedDB
async function storeDEK(encryptedDEK: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(encryptedDEK, DEK_KEY);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// Retrieve encrypted DEK from IndexedDB
async function retrieveDEK(): Promise<string | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(DEK_KEY);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}
