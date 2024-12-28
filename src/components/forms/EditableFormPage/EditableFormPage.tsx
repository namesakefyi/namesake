import { Button, TextField } from "@/components/common";
import { api } from "@convex/_generated/api";
import type { Doc, Id } from "@convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import { EditableFormField } from "..";

interface EditableFormPageProps {
  pageId: Id<"formPages">;
}

export function EditableFormPage({ pageId }: EditableFormPageProps) {
  const page = useQuery(api.formPages.getById, { pageId });
  const existingFields = useQuery(api.formFields.getByIds, {
    fieldIds: page?.fields || [],
  });

  const updatePage = useMutation(api.formPages.update);
  const updateField = useMutation(api.formFields.update);
  const createField = useMutation(api.formFields.create);
  const removeField = useMutation(api.formFields.remove);

  const [title, setTitle] = useState(page?.title || "");
  const [description, setDescription] = useState(page?.description || "");
  const [fields, setFields] = useState<Doc<"formFields">[]>(
    existingFields || [],
  );

  const handleAddField = () => {
    const newField: Doc<"formFields"> = {
      _id: undefined as unknown as Id<"formFields">,
      _creationTime: Date.now(),
      type: "shortText",
      label: "",
      name: "",
      required: false,
    };
    setFields([...fields, newField]);
  };

  const handleRemoveField = async (index: number) => {
    const fieldToRemove = fields[index];

    // If the field exists in the database, remove it
    if (fieldToRemove._id) {
      await removeField({ fieldId: fieldToRemove._id });
    }

    // Remove from local state
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
  };

  const handleSave = async () => {
    // Update page details
    await updatePage({
      pageId,
      title,
      description,
    });

    // Create or update fields
    const fieldIds = await Promise.all(
      fields.map(async (field) => {
        if (field._id) {
          // Update existing field
          await updateField({
            fieldId: field._id,
            type: field.type,
            label: field.label,
            name: field.name,
            required: field.required,
          });
          return field._id;
        }
        // Create new field
        return await createField({
          type: field.type,
          label: field.label,
          name: field.name,
          required: field.required,
        });
      }),
    );

    // Update page with new field IDs
    await updatePage({
      pageId,
      fields: fieldIds,
    });
  };

  if (!page) return null;

  return (
    <div className="p-6 rounded-xl border border-gray-dim space-y-6">
      <TextField label="Title" name="title" value={title} onChange={setTitle} />
      <TextField
        label="Description"
        name="description"
        value={description}
        onChange={setDescription}
      />
      {fields.map((field, index) => (
        <EditableFormField
          key={field._id || `new-${index}`}
          field={field}
          index={index}
          onUpdate={(index, updates) => {
            const updatedFields = fields.map((f, i) =>
              i === index ? { ...f, ...updates } : f,
            );
            setFields(updatedFields);
          }}
          onRemove={handleRemoveField}
        />
      ))}
      <Button variant="secondary" icon={Plus} onPress={handleAddField}>
        Add Field
      </Button>
      <div className="flex justify-end">
        <Button onPress={handleSave}>Save Page</Button>
      </div>
    </div>
  );
}
