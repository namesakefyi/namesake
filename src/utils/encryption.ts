import posthog from "posthog-js";
import { useState } from "react";

import { useEffect } from "react";

// Constants
const DB_NAME = "namesake-encryption";
const STORE_NAME = "encryption-keys";
const DEK_KEY = "device-dek";
const IV_LENGTH = 12;

/**
 * Encryption module using AES-GCM with a single key:
 * Data Encryption Key (DEK): Used to encrypt/decrypt data
 */

export async function encryptData(data: any, dek: CryptoKey): Promise<string> {
  const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const stringifiedData = JSON.stringify(data);
  const encodedData = new TextEncoder().encode(stringifiedData);
  const encryptedData = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    dek,
    encodedData,
  );

  const combined = new Uint8Array(iv.length + encryptedData.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encryptedData), iv.length);
  return arrayBufferToBase64(combined.buffer);
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
  const decryptedString = new TextDecoder().decode(decryptedData);
  return JSON.parse(decryptedString);
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

export function useEncryptionKey(): CryptoKey | null {
  const [encryptionKey, setEncryptionKey] = useState<CryptoKey | null>(null);

  useEffect(() => {
    const loadEncryptionKey = async () => {
      try {
        const key = await getEncryptionKey();
        setEncryptionKey(key);

        if (!key) {
          await initializeEncryption();
          return;
        }
      } catch (error: any) {
        posthog.captureException(error);
      }
    };

    loadEncryptionKey();
  }, []);

  return encryptionKey;
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

type SingleDecryptResult = {
  decryptedValue: string | undefined;
  decryptedValues?: never;
  error: boolean;
};

type MultipleDecryptResult = {
  decryptedValue?: never;
  decryptedValues: string[] | undefined;
  error: boolean;
};

type DecryptResult = SingleDecryptResult | MultipleDecryptResult;

/**
 * Decrypts a single or multiple encrypted values.
 * @param encryptedValue - The encrypted value to decrypt.
 * @returns The decrypted value or values.
 */
export function useDecrypt(
  encryptedValue: string | string[] | undefined,
): DecryptResult {
  const encryptionKey = useEncryptionKey();
  const [decryptedValues, setDecryptedValues] = useState<
    string[] | undefined
  >();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!encryptedValue || !encryptionKey) {
      setDecryptedValues(undefined);
      return;
    }

    const values = Array.isArray(encryptedValue)
      ? encryptedValue
      : [encryptedValue];

    Promise.all(
      values.map(async (value) => {
        try {
          return await decryptData(value, encryptionKey);
        } catch (error) {
          posthog.captureException(error);
          setError(true);
          return null;
        }
      }),
    ).then((results) => {
      const validResults = results.filter(
        (result): result is string => result !== null,
      );
      if (validResults.length) {
        setDecryptedValues(validResults);
      }
    });
  }, [encryptedValue, encryptionKey]);

  if (Array.isArray(encryptedValue)) {
    return { decryptedValues, error };
  }

  return {
    decryptedValue: decryptedValues?.[0],
    error,
  };
}
