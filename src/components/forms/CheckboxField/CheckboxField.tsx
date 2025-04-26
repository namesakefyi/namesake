import { Checkbox, type CheckboxProps } from "@/components/common";
import type { UserFormDataField } from "@/constants";
import { smartquotes } from "@/utils/smartquotes";
import { Controller, useFormContext } from "react-hook-form";
import { twMerge } from "tailwind-merge";

export interface CheckboxFieldProps extends CheckboxProps {
  children?: React.ReactNode;
  name: UserFormDataField;
  label: string;
  className?: string;
  defaultValue?: boolean;
}

export function CheckboxField({
  name,
  label,
  className,
  children,
  defaultValue,
  ...props
}: CheckboxFieldProps) {
  const { control, setValue } = useFormContext();

  return (
    <div className={twMerge("flex flex-col gap-4", className)}>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue ?? false}
        shouldUnregister={true}
        render={({ field, fieldState: { invalid, error } }) => (
          <Checkbox
            {...field}
            size="large"
            label={smartquotes(label)}
            card
            isSelected={field.value}
            onChange={(isSelected) => {
              setValue(name, isSelected);
              field.onChange(isSelected);
            }}
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
