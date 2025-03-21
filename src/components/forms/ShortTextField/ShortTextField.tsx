import { TextField, type TextFieldProps } from "@/components/common";
import type { UserFormDataField } from "@convex/constants";
import { Controller, useFormContext } from "react-hook-form";

export interface ShortTextFieldProps extends Omit<TextFieldProps, "size"> {
  label: string;
  name: UserFormDataField;
  children?: React.ReactNode;
}

export function ShortTextField({
  label,
  name,
  children,
  defaultValue,
  ...props
}: ShortTextFieldProps) {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col gap-4">
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue ?? ""}
        shouldUnregister={true}
        render={({ field, fieldState: { invalid, error } }) => (
          <TextField
            {...field}
            label={label}
            size="large"
            isInvalid={invalid}
            errorMessage={error?.message}
            {...props}
          />
        )}
      />
      {children}
    </div>
  );
}
