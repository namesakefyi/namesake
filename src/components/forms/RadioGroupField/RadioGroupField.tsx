import { Controller, useFormContext } from "react-hook-form";
import {
  Radio,
  RadioGroup,
  type RadioGroupProps,
  type RadioProps,
} from "@/components/common";
import { type FieldName, PREFER_NOT_TO_ANSWER } from "@/constants";
import { smartquotes } from "@/utils/smartquotes";

interface RadioOption extends RadioProps {
  label: string;
  value: string;
}

export interface RadioGroupFieldProps extends RadioGroupProps {
  children?: React.ReactNode;
  name: FieldName;
  label: string;
  labelHidden?: boolean;
  options: RadioOption[];
  includePreferNotToAnswer?: boolean;
}

export function RadioGroupField({
  name,
  label,
  labelHidden,
  options,
  children,
  includePreferNotToAnswer,
  ...props
}: RadioGroupFieldProps) {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col gap-4">
      <Controller
        control={control}
        name={name}
        shouldUnregister={true}
        render={({ field, fieldState: { invalid, error } }) => (
          <RadioGroup
            {...field}
            label={!labelHidden ? smartquotes(label) : undefined}
            aria-label={labelHidden ? label : undefined}
            size="large"
            isInvalid={invalid}
            errorMessage={error?.message}
            orientation="vertical"
            {...props}
          >
            <span className="italic text-dim text-sm">Select one:</span>
            {options?.map(({ label, ...option }) => (
              <Radio key={option.value} {...option} size="large" card>
                {label}
              </Radio>
            ))}
            {includePreferNotToAnswer && (
              <Radio value={PREFER_NOT_TO_ANSWER} size="large" card>
                Prefer not to answer
              </Radio>
            )}
          </RadioGroup>
        )}
      />
      {children}
    </div>
  );
}
