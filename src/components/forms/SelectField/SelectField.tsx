import { Select, SelectItem } from "@/components/common";
import { smartquotes } from "@/utils/smartquotes";
import type { UserFormDataField } from "@convex/constants";
import { Controller, useFormContext } from "react-hook-form";

export interface SelectFieldProps {
  label: string;
  name: UserFormDataField;
  placeholder?: string;
  children?: React.ReactNode;
  defaultValue?: string;
  options: {
    label: string;
    value: string;
  }[];
}

export function SelectField({
  label,
  name,
  placeholder,
  children,
  defaultValue,
  options,
  ...props
}: SelectFieldProps) {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col gap-4">
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue ?? null}
        shouldUnregister={true}
        render={({ field, fieldState: { invalid, error } }) => (
          <Select
            {...field}
            label={smartquotes(label)}
            size="large"
            placeholder={placeholder}
            className="w-fit"
            selectedKey={field.value}
            onSelectionChange={(key) => {
              field.onChange(key);
            }}
            isInvalid={invalid}
            errorMessage={error?.message}
            {...props}
          >
            {options.map(({ label, value }) => (
              <SelectItem key={value} id={value} textValue={label}>
                {label}
              </SelectItem>
            ))}
          </Select>
        )}
      />
      {children}
    </div>
  );
}
