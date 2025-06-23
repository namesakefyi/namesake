import { Controller, useFormContext } from "react-hook-form";
import { TextArea, type TextAreaProps } from "@/components/common";
import type { FieldName } from "@/constants";
import { smartquotes } from "@/utils/smartquotes";

export interface LongTextFieldProps extends Omit<TextAreaProps, "size"> {
  label: string;
  name: FieldName;
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
            label={smartquotes(label)}
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
