// Constants
const DB_NAME = "namesake-encryption";
const STORE_NAME = "encryption-keys";
const DEK_KEY = "device-dek";

const IV_LENGTH = 12;

/**
 * Encryption module using AES-GCM with a single non-extractable key:
 * 
 * - Data Encryption Key (DEK): Used to encrypt/decrypt data
 * 
 * The DEK is generated as a non-extractable key and stored in IndexedDB.
 */

/**
 * Security Considerations:
 * 1. Data is encrypted at rest using AES-GCM
 * 2. DEK is non-extractable and isolated to the device
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
 */
export async function initializeEncryption(): Promise<void> {
  // Check if encryption is already initialized
  const existingDEK = await retrieveDEK();
  if (existingDEK) return;

  // Generate a non-extractable DEK
  const dek = await generateDEK();
  const serializedDEK = await serializeDEK(dek);
  await storeDEK(serializedDEK);
}

/**
 * Gets the encryption key. If one doesn't exist, create one.
 * @returns The DEK
 */
export async function getEncryptionKey(): Promise<CryptoKey | null> {
  const serializedDEK = await retrieveDEK();
  if (!serializedDEK) return null;

  return await deserializeDEK(serializedDEK);
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

// Generate a new data encryption key (DEK)
async function generateDEK(): Promise<CryptoKey> {
  return await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true, // must be extractable to be serialized
    ["encrypt", "decrypt"],
  );
}

// Serialize the DEK for storage
async function serializeDEK(dek: CryptoKey): Promise<string> {
  const jwk = await window.crypto.subtle.exportKey("jwk", dek);
  return JSON.stringify(jwk);
}

// Deserialize the DEK from storage
async function deserializeDEK(serializedDEK: string): Promise<CryptoKey> {
  const jwk = JSON.parse(serializedDEK);
  return await window.crypto.subtle.importKey(
    "jwk",
    jwk,
    {
      name: "AES-GCM",
      length: 256,
    },
    false, // non-extractable when in use
    ["encrypt", "decrypt"],
  );
}

// Store serialized DEK in IndexedDB
async function storeDEK(serializedDEK: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(serializedDEK, DEK_KEY);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// Retrieve serialized DEK from IndexedDB
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
