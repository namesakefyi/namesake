import { Link } from "@/components/common";
import {
  AddressField,
  CheckboxGroupField,
  EmailField,
  LongTextField,
  MemorableDateField,
  NameField,
  RadioGroupField,
  ShortTextField,
} from "@/components/forms";
import type { Doc } from "@convex/_generated/dataModel";
import { useSearch } from "@tanstack/react-router";
import { tv } from "tailwind-variants";

interface EditableFormFieldProps {
  field: Doc<"formFields">;
}

export function EditableFormField({ field }: EditableFormFieldProps) {
  const search = useSearch({
    strict: false,
  });

  const isSelected = search.field === field._id;

  const itemStyles = tv({
    base: "flex flex-col gap-4 px-6 py-5 relative",
    variants: {
      isSelected: {
        true: "rounded-lg outline outline-2 outline-purple-9 dark:outline-purpledark-9",
        false: "hover:bg-graya-3 dark:hover:bg-graydarka-3",
      },
    },
  });

  return (
    <div className={itemStyles({ isSelected })}>
      {!isSelected && (
        <Link
          href={{ to: ".", search: { field: field._id } }}
          aria-label="Edit field"
          className="absolute inset-0"
        />
      )}
      {field.type === "address" && <AddressField />}
      {field.type === "shortText" && (
        <ShortTextField label={field.label || ""} name={field.name || ""} />
      )}
      {field.type === "longText" && (
        <LongTextField label={field.label || ""} name={field.name || ""} />
      )}
      {field.type === "email" && <EmailField />}
      {field.type === "checkboxGroup" && (
        <CheckboxGroupField
          label={field.label || ""}
          name={field.name || ""}
          options={field.options || []}
        />
      )}
      {field.type === "radioGroup" && (
        <RadioGroupField
          label={field.label || ""}
          name={field.name || ""}
          options={field.options || []}
        />
      )}
      {field.type === "memorableDate" && (
        <MemorableDateField label={field.label || ""} />
      )}
      {field.type === "name" && <NameField />}
    </div>
  );
}
