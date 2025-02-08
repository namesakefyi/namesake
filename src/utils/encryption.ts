// Constants
const DB_NAME = "namesake-encryption";
const STORE_NAME = "encryption-keys";
const DEK_KEY = "device-dek";
const IV_LENGTH = 12;

/**
 * Encryption module using AES-GCM with a single key:
 * Data Encryption Key (DEK): Used to encrypt/decrypt data
 */

export async function encryptData(
  data: string,
  dek: CryptoKey,
): Promise<string> {
  const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encodedData = new TextEncoder().encode(data);
  const encryptedData = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    dek,
    encodedData,
  );

  const combined = new Uint8Array(iv.length + encryptedData.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encryptedData), iv.length);
  return arrayBufferToBase64(combined);
}

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
    { name: "AES-GCM", iv },
    dek,
    data,
  );
  return new TextDecoder().decode(decryptedData);
}

export async function initializeEncryption(): Promise<void> {
  const existingDEK = await retrieveDEK();
  if (existingDEK) return;

  const dek = await generateDEK();
  const serializedDEK = await serializeDEK(dek);
  await storeDEK(serializedDEK);
}

export async function getEncryptionKey(): Promise<CryptoKey | null> {
  const serializedDEK = await retrieveDEK();
  if (!serializedDEK) return null;
  return await deserializeDEK(serializedDEK);
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const binary = Array.from(bytes)
    .map((byte) => String.fromCharCode(byte))
    .join("");
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

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

async function generateDEK(): Promise<CryptoKey> {
  return await window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );
}

async function serializeDEK(dek: CryptoKey): Promise<string> {
  const rawKey = await window.crypto.subtle.exportKey("raw", dek);
  return arrayBufferToBase64(rawKey);
}

async function deserializeDEK(serializedDEK: string): Promise<CryptoKey> {
  const keyData = base64ToArrayBuffer(serializedDEK);
  return await window.crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );
}

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
