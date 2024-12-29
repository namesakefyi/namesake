import { TextArea, TextField } from "@/components/common";
import { EditFormSidebarSection } from "@/components/forms";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

interface EditFormPageProps {
  page?: Doc<"formPages">;
}

export function EditFormPage({ page }: EditFormPageProps) {
  const update = useMutation(api.formPages.update);
  const [values, setValues] = useState({
    title: page?.title ?? "",
    description: page?.description ?? "",
  });
  const [debouncedValues] = useDebounce(values, 1000);

  useEffect(() => {
    setValues({
      title: page?.title ?? "",
      description: page?.description ?? "",
    });
  }, [page]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: only update on value change
  useEffect(() => {
    if (!page) return;
    try {
      update({ pageId: page._id, ...debouncedValues });
    } catch (error) {
      toast.error("Failed to update page");
    }
  }, [debouncedValues]);

  if (!page) return null;

  return (
    <EditFormSidebarSection title="Page">
      <TextField
        label="Title"
        value={values.title}
        onChange={(title) => setValues({ ...values, title })}
      />
      <TextArea
        label="Description"
        value={values.description}
        onChange={(description) => setValues({ ...values, description })}
      />
    </EditFormSidebarSection>
  );
}
