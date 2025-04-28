import {
  FIELD_DEFS,
  type FieldName,
  type FormData,
  type PDFDefinition,
} from "@/constants";
import { fillPdf } from "@/forms/utils";
import { decryptData, getEncryptionKey } from "@/utils/encryption";
import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import { useEffect, useMemo, useState } from "react";

export function useFilledPdf(pdf: PDFDefinition) {
  const fieldNames: FieldName[] = useMemo(
    () => FIELD_DEFS.map((f) => f.name),
    [],
  );
  const encryptedUserData = useQuery(api.userFormResponses.list);

  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let cancelled = false;
    async function fill() {
      setLoading(true);
      setError(null);
      try {
        if (!encryptedUserData) return;

        // 1. Get encryption key
        const encryptionKey = await getEncryptionKey();
        if (!encryptionKey) throw new Error("No encryption key found");

        // 2. Decrypt all values
        const decryptedValues = await Promise.all(
          encryptedUserData.map((item) =>
            decryptData(item.value, encryptionKey),
          ),
        );

        // 3. Build a map of field name to decrypted value
        const userData: Partial<FormData> = {};
        encryptedUserData?.forEach((item, idx) => {
          if (decryptedValues[idx] !== undefined) {
            userData[item.field as FieldName] = decryptedValues[idx] as any;
          }
        });

        // 4. Fill the PDF
        const bytes = await fillPdf({ pdf, userData });
        if (!cancelled) setPdfBytes(bytes);
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fill();
    return () => {
      cancelled = true;
    };
  }, [pdf, encryptedUserData, fieldNames]);

  return { pdfBytes, loading, error };
}
