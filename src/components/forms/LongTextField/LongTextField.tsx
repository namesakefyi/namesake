import { TextArea, type TextAreaProps } from "@/components/common";
import type { UserFormDataField } from "@convex/constants";
import { Controller, useFormContext } from "react-hook-form";

export interface LongTextFieldProps extends Omit<TextAreaProps, "size"> {
  label: string;
  name: UserFormDataField;
  children?: React.ReactNode;
}

export function LongTextField({
  label,
  name,
  children,
  defaultValue,
  ...props
}: LongTextFieldProps) {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col gap-4">
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue ?? ""}
        shouldUnregister={true}
        render={({ field, fieldState: { invalid, error } }) => (
          <TextArea
            {...field}
            label={label}
            size="large"
            isRequired
            validationBehavior="aria"
            isInvalid={invalid}
            {...props}
            errorMessage={error?.message}
          />
        )}
      />
      {children}
    </div>
  );
}
