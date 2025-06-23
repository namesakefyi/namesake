import { usePostHog } from "posthog-js/react";
import { useEffect, useState } from "react";
import { useEncryptionKey } from "@/hooks/useEncryptionKey";
import { decryptData } from "@/utils/encryption";

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
  const posthog = usePostHog();

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
