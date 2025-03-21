import {
  Radio,
  RadioGroup,
  type RadioGroupProps,
  type RadioProps,
} from "@/components/common";
import type { UserFormDataField } from "@convex/constants";
import { Controller, useFormContext } from "react-hook-form";

interface RadioOption extends RadioProps {
  label: string;
  value: string;
}

export interface RadioGroupFieldProps extends RadioGroupProps {
  children?: React.ReactNode;
  name: UserFormDataField;
  label: string;
  options: RadioOption[];
}

export function RadioGroupField({
  name,
  label,
  options,
  children,
  ...props
}: RadioGroupFieldProps) {
  const { control } = useFormContext();

  return (
    <div className="@container flex flex-col gap-4">
      <Controller
        control={control}
        name={name}
        shouldUnregister={true}
        render={({ field, fieldState: { invalid, error } }) => (
          <RadioGroup
            {...field}
            label={label}
            size="large"
            isInvalid={invalid}
            errorMessage={error?.message}
            orientation="vertical"
            {...props}
          >
            <span className="italic text-gray-dim text-sm">Select one:</span>
            {options?.map(({ label, ...option }) => (
              <Radio key={option.value} {...option} size="large" card>
                {label}
              </Radio>
            ))}
          </RadioGroup>
        )}
      />
      {children}
    </div>
  );
}
