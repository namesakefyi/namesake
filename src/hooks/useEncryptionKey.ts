import { getEncryptionKey, initializeEncryption } from "@/utils/encryption";
import { usePostHog } from "posthog-js/react";
import { useEffect, useState } from "react";

export function useEncryptionKey(): CryptoKey | null {
  const [encryptionKey, setEncryptionKey] = useState<CryptoKey | null>(null);
  const posthog = usePostHog();

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
