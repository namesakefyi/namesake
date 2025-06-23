import { Controller, useFormContext } from "react-hook-form";
import { TextField, type TextFieldProps } from "@/components/common";
import type { FieldName } from "@/constants";
import { smartquotes } from "@/utils/smartquotes";

export interface ShortTextFieldProps extends Omit<TextFieldProps, "size"> {
  label: string;
  name: FieldName;
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
            label={smartquotes(label)}
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
