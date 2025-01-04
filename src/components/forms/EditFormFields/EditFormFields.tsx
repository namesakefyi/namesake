import { Button, Select, SelectItem, TextField } from "@/components/common";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { FORM_FIELDS, type FormField } from "@convex/constants";
import { useMutation, useQuery } from "convex/react";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

interface EditableOptionsProps {
  options: Doc<"formFields">["options"];
  onChange: (options: Doc<"formFields">["options"]) => void;
}

export function EditableOptions({
  options = [],
  onChange,
}: EditableOptionsProps) {
  const handleAddOption = () => {
    const newOptions = [...options, { label: "", value: "" }];
    onChange(newOptions);
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    onChange(newOptions);
  };

  const handleUpdateOption = (
    index: number,
    updates: Partial<{ label: string; value: string }>,
  ) => {
    const newOptions = options.map((option, i) =>
      i === index ? { ...option, ...updates } : option,
    );
    onChange(newOptions);
  };

  return (
    <div className="flex flex-col gap-3">
      {options.map((option, index) => (
        <div
          key={option.value}
          className="flex flex-col gap-2 pl-4 border-l-gray-6 dark:border-l-graydark-6 border-l-2"
        >
          <TextField
            label="Option Label"
            value={option.label}
            onChange={(value) => handleUpdateOption(index, { label: value })}
            size="small"
          />
          <TextField
            label="Option Value"
            value={option.value?.toString() || ""}
            onChange={(value) => handleUpdateOption(index, { value: value })}
            size="small"
          />
          <Button
            variant="icon"
            icon={Trash2}
            onPress={() => handleRemoveOption(index)}
            aria-label="Remove option"
            size="small"
          />
        </div>
      ))}
      <Button
        variant="secondary"
        icon={Plus}
        size="small"
        onPress={handleAddOption}
      >
        Add option
      </Button>
    </div>
  );
}

interface EditFormFieldProps {
  field: Doc<"formFields"> | null;
}

function EditFormField({ field }: EditFormFieldProps) {
  const [values, setValues] = useState({
    type: field?.type ?? "shortText",
    label: field?.label ?? "Label",
    name: field?.name,
    options: field?.options ?? [
      {
        label: "Option 1",
        value: "option1",
      },
      {
        label: "Option 2",
        value: "option2",
      },
      {
        label: "Option 3",
        value: "option3",
      },
    ],
  });
  const [debouncedValues] = useDebounce(values, 1000);

  const update = useMutation(api.formFields.update);
  const removeField = useMutation(api.formFields.remove);

  const hasOptions = FORM_FIELDS[values.type as FormField].hasOptions;

  if (!field) return null;

  // biome-ignore lint/correctness/useExhaustiveDependencies: only update on debounce value change
  useEffect(() => {
    if (!field) return;
    try {
      update({ fieldId: field._id, ...debouncedValues });
    } catch (error) {
      toast.error("Something went wrong.");
    }
  }, [debouncedValues]);

  return (
    <section className="flex flex-col gap-3">
      <div className="flex gap-2 items-center">
        <Select
          aria-label="Field type"
          name={`${field._id}-type`}
          selectedKey={values.type}
          onSelectionChange={(value) =>
            setValues({ ...values, type: value as FormField })
          }
          className="flex-1"
        >
          {Object.entries(FORM_FIELDS).map(
            ([fieldType, { icon: Icon, label }]) => (
              <SelectItem key={fieldType} id={fieldType} textValue={label}>
                <Icon size={16} />
                {label}
              </SelectItem>
            ),
          )}
        </Select>
        <Button
          variant="icon"
          icon={Trash2}
          onPress={() => removeField({ fieldId: field._id })}
          aria-label="Remove field"
          size="small"
        />
      </div>
      <div className="pl-4 border-l-2 border-gray-dim flex flex-col gap-2">
        {/* TODO: Labels are conditional, don't always apply (e.g. full name, address) */}
        <TextField
          label="Label"
          name={`${field._id}-label`}
          value={values.label}
          onChange={(value) => setValues({ ...values, label: value })}
          size="small"
        />
        <TextField
          label="Name"
          name={`${field._id}-name`}
          value={values.name}
          onChange={(value) => setValues({ ...values, name: value })}
          size="small"
        />
        {hasOptions && (
          <EditableOptions
            options={values.options}
            onChange={(options) => options && setValues({ ...values, options })}
          />
        )}
      </div>
    </section>
  );
}

interface EditFormFieldsProps {
  page?: Doc<"formPages">;
}

export function EditFormFields({ page }: EditFormFieldsProps) {
  const fields = useQuery(api.formFields.getByIds, {
    fieldIds: page?.fields ?? [],
  });

  const addField = useMutation(api.formFields.create);

  const handleAddField = () => {
    if (!page) return;
    addField({ formPageId: page?._id, type: "shortText" });
  };

  return (
    <div className="flex flex-col gap-6">
      {fields?.map((field) => (
        <EditFormField key={field._id} field={field} />
      ))}
      <Button onPress={handleAddField} icon={Plus} size="small">
        Add field
      </Button>
    </div>
  );
}
