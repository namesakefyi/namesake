import { Button, Form, TextField } from "@/components/common";
import { decryptData, encryptData, getEncryptionKey } from "@/utils/encryption";
import { api } from "@convex/_generated/api";
import { useMutation } from "convex/react";
import { LoaderCircle } from "lucide-react";
import posthog from "posthog-js";
import { useEffect, useState } from "react";

interface UserDataFormProps {
  initialData: { field: string; value: string };
}

// Placeholder for allowing users to view and edit their form data
// TODO: Replace this with a more robust implementation that manages draft state better.
export function UserDataForm({ initialData }: UserDataFormProps) {
  const [field, setField] = useState(initialData.field);
  const [decryptedValue, setDecryptedValue] = useState<string>();
  const [initialDecryptedValue, setInitialDecryptedValue] = useState<string>();
  const [encryptionKey, setEncryptionKey] = useState<CryptoKey | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const isDirty =
    field === initialData.field && decryptedValue === initialDecryptedValue;

  const save = useMutation(api.userFormData.set);

  useEffect(() => {
    console.log("initialData", initialData);
    const loadEncryptionKey = async () => {
      console.log("TRYING!")
      try {
        const key = await getEncryptionKey();
        console.log("key", key);
        setEncryptionKey(key);

        if (!key) {
          return;
        }

        if (initialData.value) {
          try {
            const decryptedValue = await decryptData(initialData.value, key);
            setDecryptedValue(decryptedValue);
            setInitialDecryptedValue(decryptedValue);
          } catch (error: any) {
            posthog.captureException(error);
          }
        } else {
          setDecryptedValue("");
          setInitialDecryptedValue("");
        }
      } catch (error: any) {
        posthog.captureException(error);
      }
    };

    loadEncryptionKey();
  }, [initialData.value]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!encryptionKey || !decryptedValue) {
      console.error("No encryption key or decrypted value available");
      return;
    }

    setIsSaving(true);
    try {
      // Encrypt the value before saving
      const encryptedValue = await encryptData(decryptedValue, encryptionKey);
      await save({ field, value: encryptedValue });
    } catch (error) {
      console.error("Error saving encrypted data:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (encryptionKey === null || decryptedValue === undefined) {
    return <LoaderCircle className="w-4 h-4 animate-spin" />;
  }

  const isExistingField = initialData.field !== "";

  return (
    <Form onSubmit={handleSubmit}>
      <div className="flex gap-2 items-end">
        <TextField
          label="Field"
          name="field"
          value={field}
          onChange={setField}
          placeholder="Enter field name"
          isDisabled={isExistingField}
        />
        <TextField
          label="Value"
          name="value"
          value={decryptedValue}
          onChange={setDecryptedValue}
          placeholder="Enter field value"
        />
        <Button
          type="submit"
          variant="secondary"
          className="w-fit"
          isDisabled={
            field === "" || decryptedValue === "" || isSaving || isDirty
          }
        >
          {isSaving ? (
            <>
              <LoaderCircle className="w-4 h-4 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </Form>
  );
}
