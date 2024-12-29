import { Button, TextField } from "@/components/common";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import { EditableFormField } from "..";

interface EditableFormPageProps {
  pageId: Id<"formPages">;
}

export function EditableFormPage({ pageId }: EditableFormPageProps) {
  const page = useQuery(api.formPages.getById, { pageId });
  const addField = useMutation(api.formFields.create);

  const fields = useQuery(api.formFields.getByIds, {
    fieldIds: page?.fields ?? [],
  });

  const [title, setTitle] = useState(page?.title || "");
  const [description, setDescription] = useState(page?.description || "");

  const handleAddField = () => {
    addField({
      formPageId: pageId,
      type: "shortText",
      label: "New Field",
    });
  };

  if (!page) return null;

  return (
    <div className="rounded-xl border border-gray-dim">
      <header className="p-6 flex flex-col gap-4">
        <TextField
          label="Title"
          name="title"
          value={title}
          onChange={setTitle}
          size="large"
        />
        <TextField
          label="Description"
          name="description"
          value={description}
          onChange={setDescription}
          size="large"
        />
      </header>
      {fields?.map((field) => (
        <EditableFormField key={field._id} field={field} />
      ))}
      <footer className="p-6">
        <Button variant="secondary" icon={Plus} onPress={handleAddField}>
          Add Field
        </Button>
      </footer>
    </div>
  );
}
