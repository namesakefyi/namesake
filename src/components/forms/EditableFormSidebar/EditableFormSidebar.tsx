import {
  Button,
  Select,
  SelectItem,
  Switch,
  TextField,
} from "@/components/common";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { FORM_FIELDS, type FormField } from "@convex/constants";
import { useMutation } from "convex/react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Heading } from "react-aria-components";
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
      <Heading className="text-gray-dim">Options</Heading>
      {options.map((option, index) => (
        <div
          key={option.value}
          className="flex flex-col gap-2 pl-4 border-l-gray-6 dark:border-l-graydark-6 border-l-2"
        >
          <TextField
            label="Label"
            value={option.label}
            onChange={(value) => handleUpdateOption(index, { label: value })}
          />
          <TextField
            label="Value"
            value={option.value?.toString() || ""}
            onChange={(value) => handleUpdateOption(index, { value: value })}
          />
          <Button
            variant="icon"
            icon={Trash2}
            onPress={() => handleRemoveOption(index)}
            aria-label="Remove option"
          />
        </div>
      ))}
      <Button variant="secondary" icon={Plus} onPress={handleAddOption}>
        Add Option
      </Button>
    </div>
  );
}

interface EditableFormContentsProps {
  field: Doc<"formFields">;
}

function EditableFormContents({ field }: EditableFormContentsProps) {
  const [isUpdating, setUpdating] = useState(false);
  const [values, setValues] = useState({
    type: field?.type,
    label: field?.label,
    name: field?.name,
    required: field?.required,
    options: field?.options,
  });
  const [debouncedValues] = useDebounce(values, 1000);

  const update = useMutation(api.formFields.update);
  const removeField = useMutation(api.formFields.remove);

  const hasOptions = FORM_FIELDS[values.type as FormField].hasOptions;

  if (!field) return null;

  // biome-ignore lint/correctness/useExhaustiveDependencies: Only want to run when debounced values change
  useEffect(() => {
    try {
      setUpdating(true);
      update({ fieldId: field._id, ...debouncedValues });
    } catch (error) {
      // Ignore
    } finally {
      setUpdating(false);
    }
  }, [debouncedValues]);

  return (
    <>
      <Select
        label="Field Type"
        name={`${field._id}-type`}
        selectedKey={values.type}
        onSelectionChange={(value) =>
          setValues({ ...values, type: value as FormField })
        }
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
      {/* TODO: Labels are conditional, don't always apply (e.g. full name, address) */}
      {/* TODO: Show required fields indicator */}
      <TextField
        label="Label"
        name={`${field._id}-label`}
        value={values.label}
        onChange={(value) => setValues({ ...values, label: value })}
      />
      <TextField
        label="Name"
        name={`${field._id}-name`}
        value={values.name}
        onChange={(value) => setValues({ ...values, name: value })}
      />
      {hasOptions && (
        <EditableOptions
          options={values.options}
          onChange={(options) => options && setValues({ ...values, options })}
        />
      )}
      <div className="flex items-center space-x-2 justify-end">
        {isUpdating && (
          <Loader2 className="animate-spin text-gray-normal" size={16} />
        )}
        <Switch
          isSelected={values.required ?? false}
          name={`${field._id}-required`}
          onChange={(value) => setValues({ ...values, required: value })}
        >
          Required
        </Switch>
        <Button
          variant="icon"
          icon={Trash2}
          onPress={() => removeField({ fieldId: field._id })}
          aria-label="Remove field"
        />
      </div>
    </>
  );
}

interface EditableFormSidebarProps {
  field?: Doc<"formFields"> | null;
}

export function EditableFormSidebar({ field }: EditableFormSidebarProps) {
  return (
    <aside className="w-80 bg-gray-2 dark:bg-graydark-2 flex flex-col gap-4 p-6 border-l border-gray-dim sticky top-0 h-screen overflow-y-auto">
      {field && <EditableFormContents field={field} />}
    </aside>
  );
}
