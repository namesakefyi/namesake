import { api } from "@convex/_generated/api";
import { useMutation } from "convex/react";
import posthog from "posthog-js";
import { useState } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { encryptData } from "./encryption";
import { useEncryptionKey } from "./encryption";

export function useFormEncryptAndSubmit<T extends FieldValues>(
  form: UseFormReturn<T, any, undefined>,
) {
  const encryptionKey = useEncryptionKey();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const save = useMutation(api.userFormResponses.set);

  const onSubmit = form.handleSubmit(async (data) => {
    if (!encryptionKey) {
      console.error("No encryption key available");
      return;
    }

    try {
      setIsSubmitting(true);

      for (const [field, value] of Object.entries(data)) {
        if (value === "" || value === null || value === undefined) continue;
        const encryptedValue = await encryptData(
          value.toString(),
          encryptionKey,
        );
        await save({ field, value: encryptedValue });
      }

      toast.success("Form submitted!");
    } catch (error) {
      posthog.captureException(error);
      toast.error("An error occurred during submission. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  });

  return { onSubmit, isSubmitting };
}
