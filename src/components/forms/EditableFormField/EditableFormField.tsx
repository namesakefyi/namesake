import {
  Button,
  Select,
  SelectItem,
  Switch,
  TextField,
} from "@/components/common";
import type { Doc } from "@convex/_generated/dataModel";
import { FORM_FIELDS, type FormField } from "@convex/constants";
import { Plus, Trash2 } from "lucide-react";

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
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Options</h4>
      {options.map((option, index) => (
        <div key={option.value} className="flex space-x-2 items-center">
          <TextField
            label="Option Label"
            value={option.label}
            onChange={(value) => handleUpdateOption(index, { label: value })}
          />
          <TextField
            label="Option Value"
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

interface EditableFormFieldProps {
  field: Doc<"formFields">;
  index: number;
  onUpdate: (index: number, updates: Partial<Doc<"formFields">>) => void;
  onRemove: (index: number) => void;
}

export function EditableFormField({
  field,
  index,
  onUpdate,
  onRemove,
}: EditableFormFieldProps) {
  const hasOptions = FORM_FIELDS[field.type as FormField].hasOptions;

  return (
    <div className="p-4 border rounded-lg border-gray-dim flex flex-col space-y-4">
      <Select
        label="Field Type"
        selectedKey={field.type}
        onSelectionChange={(value) =>
          onUpdate(index, { type: value as keyof typeof FORM_FIELDS })
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
      <TextField
        label="Label"
        name={`label-${index}`}
        value={field.label}
        onChange={(value) => onUpdate(index, { label: value })}
      />
      <TextField
        label="Name"
        name={`name-${index}`}
        value={field.name}
        onChange={(value) => onUpdate(index, { name: value })}
      />
      {hasOptions && (
        <EditableOptions
          options={field.options}
          onChange={(options) => onUpdate(index, { options })}
        />
      )}
      <div className="flex items-center space-x-2 justify-end">
        <Switch
          isSelected={field.required}
          onChange={(value) => onUpdate(index, { required: value })}
        >
          Required
        </Switch>
        <Button
          variant="icon"
          icon={Trash2}
          onPress={() => onRemove(index)}
          aria-label="Remove field"
        />
      </div>
    </div>
  );
}
