import { TextField, type TextFieldProps } from "@/components/common";
import type { UserFormDataField } from "@convex/constants";
import { Controller, useFormContext } from "react-hook-form";

export interface EmailFieldProps extends Omit<TextFieldProps, "size"> {
  name: UserFormDataField;
  children?: React.ReactNode;
}

export function EmailField({
  children,
  name,
  defaultValue,
  ...props
}: EmailFieldProps) {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col gap-4">
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue ?? ""}
        render={({ field, fieldState: { invalid, error } }) => (
          <TextField
            {...field}
            label="Email address"
            type="email"
            autoComplete="email"
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
