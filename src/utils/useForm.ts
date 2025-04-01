import { api } from "@convex/_generated/api";
import type { UserFormDataField } from "@convex/constants";
import { useMutation, useQuery } from "convex/react";
import posthog from "posthog-js";
import { useEffect, useMemo, useState } from "react";
import {
  type FieldValues,
  type Path,
  type PathValue,
  type UseFormProps,
  useForm as useReactHookForm,
} from "react-hook-form";
import { toast } from "sonner";
import { decryptData, useEncryptionKey } from "./encryption";
import { encryptData } from "./encryption";

export function useForm<TFieldValues extends FieldValues = FieldValues>(
  fields: UserFormDataField[],
  options?: Omit<UseFormProps<TFieldValues>, "values" | "defaultValues">,
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const encryptionKey = useEncryptionKey();

  const fieldsList = useMemo(() => fields as string[], [fields]);

  const encryptedResponses = useQuery(api.userFormResponses.getByFields, {
    fields: fieldsList,
  });

  const save = useMutation(api.userFormResponses.set);

  const form = useReactHookForm<TFieldValues>({
    mode: "onBlur",
    ...options,
  });

  useEffect(() => {
    if (!encryptedResponses?.length || !encryptionKey || isSubmitting) return;

    Promise.all(
      encryptedResponses.map(async (response) => {
        try {
          const value = await decryptData(response.value, encryptionKey);
          form.setValue(
            response.field as Path<TFieldValues>,
            value as PathValue<TFieldValues, Path<TFieldValues>>,
            {
              shouldDirty: false,
            },
          );
        } catch (error) {
          posthog.captureException(error);
        }
      }),
    );
  }, [encryptedResponses, encryptionKey, isSubmitting]);

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      if (!encryptionKey) {
        throw new Error("No encryption key available.");
      }

      setIsSubmitting(true);

      const entries = Object.entries(data).filter(
        ([_, value]) => value !== "" && value !== null && value !== undefined,
      );

      for (const [field, value] of entries) {
        const encryptedValue = await encryptData(value, encryptionKey);
        await save({ field, value: encryptedValue });
      }

      toast.success("Form submitted!");
    } catch (error) {
      posthog.captureException(error);
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred during submission. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  });

  return {
    ...form,
    onSubmit,
    isSubmitting,
  };
}
