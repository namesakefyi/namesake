import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import { usePostHog } from "posthog-js/react";
import { useEffect, useState } from "react";
import type { FormData } from "@/constants";
import { useEncryptionKey } from "@/hooks/useEncryptionKey";
import { decryptData } from "@/utils/encryption";

export function useDecryptedFormResponses(): {
  data: Partial<FormData> | undefined;
  isLoading: boolean;
  error: boolean;
} {
  const posthog = usePostHog();
  const [decryptedData, setDecryptedData] = useState<
    Partial<FormData> | undefined
  >();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const encryptionKey = useEncryptionKey();
  const encryptedResponses = useQuery(api.userFormResponses.list);

  useEffect(() => {
    if (!encryptedResponses || !encryptionKey) {
      setIsLoading(!!encryptedResponses && !encryptionKey);
      return;
    }

    const decryptResponses = async () => {
      try {
        setIsLoading(true);
        setError(false);

        const decryptedEntries = await Promise.all(
          encryptedResponses.map(async (response) => {
            try {
              const decryptedValue = await decryptData(
                response.value,
                encryptionKey,
              );
              return [response.field, decryptedValue] as const;
            } catch (decryptError) {
              posthog.captureException(decryptError);
              return null;
            }
          }),
        );

        const validEntries = decryptedEntries.filter(
          (entry): entry is [string, any] => entry !== null,
        );

        setDecryptedData(
          validEntries.length > 0
            ? Object.fromEntries(validEntries)
            : undefined,
        );
      } catch (error) {
        posthog.captureException(error);
        setError(true);
        setDecryptedData(undefined);
      } finally {
        setIsLoading(false);
      }
    };

    decryptResponses();
  }, [encryptedResponses, encryptionKey, posthog]);

  return {
    data: decryptedData,
    isLoading,
    error,
  };
}
