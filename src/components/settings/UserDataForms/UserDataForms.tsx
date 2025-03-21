import { Button } from "@/components/common";
import { initializeEncryption } from "@/utils/encryption";
import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import posthog from "posthog-js";
import { useEffect, useState } from "react";
import { UserDataForm } from "../UserDataForm/UserDataForm";

// Placeholder for allowing users to view and edit their form data
export function UserDataForms() {
  const userData = useQuery(api.userFormResponses.list);
  const [formData, setFormData] = useState<{ field: string; value: string }[]>(
    userData?.map((data) => ({ field: data.field, value: data.value })) ?? [],
  );

  useEffect(() => {
    setFormData(
      userData?.map((data) => ({ field: data.field, value: data.value })) ?? [],
    );
  }, [userData]);

  useEffect(() => {
    const setupEncryption = async () => {
      try {
        await initializeEncryption();
      } catch (error: any) {
        posthog.captureException(error);
      }
    };

    setupEncryption();
  }, []);

  // Check if we already have an empty form
  const hasEmptyForm = formData.some((data) => data.field === "");

  return (
    <>
      <div className="mt-4 flex flex-col gap-4">
        {formData.map((data, idx) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: This is a form where order matters and items won't be reordered
          <UserDataForm key={idx} initialData={data} />
        ))}
      </div>
      {!hasEmptyForm && (
        <Button
          className="w-fit mt-4"
          variant="secondary"
          onPress={() => setFormData([...formData, { field: "", value: "" }])}
        >
          Add Value
        </Button>
      )}
    </>
  );
}
