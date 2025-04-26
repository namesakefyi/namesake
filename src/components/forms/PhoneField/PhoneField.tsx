import { TextField, type TextFieldProps } from "@/components/common";
import type { UserFormDataField } from "@/constants";
import { type MaskitoOptions, maskitoTransform } from "@maskito/core";
import { Controller, useFormContext } from "react-hook-form";

export interface PhoneFieldProps extends Omit<TextFieldProps, "size"> {
  name: UserFormDataField;
  children?: React.ReactNode;
}

export function PhoneField({
  children,
  name,
  defaultValue,
  ...props
}: PhoneFieldProps) {
  const { control } = useFormContext();

  const maskitoOptions: MaskitoOptions = {
    mask: [
      "+",
      "1",
      " ",
      "(",
      /\d/,
      /\d/,
      /\d/,
      ")",
      " ",
      /\d/,
      /\d/,
      /\d/,
      "-",
      /\d/,
      /\d/,
      /\d/,
      /\d/,
    ],
  };

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
            label="Phone number"
            type="tel"
            autoComplete="tel"
            onChange={(value) => {
              const transformedValue = maskitoTransform(value, maskitoOptions);
              field.onChange(transformedValue);
            }}
            className="max-w-[20ch]"
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
