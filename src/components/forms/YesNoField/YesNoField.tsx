import { Radio, RadioGroup, type RadioGroupProps } from "@/components/common";
import type { FieldName } from "@/constants";
import { smartquotes } from "@/utils/smartquotes";
import { Controller, useFormContext } from "react-hook-form";

/**
 * Converts a boolean value to a string value.
 * @param value - The boolean value to convert.
 * @returns "yes" if the value is true, "no" if the value is false, null if the value is undefined or null.
 */
export const getYesNoStringFromBoolean = (value: boolean) => {
  if (value === undefined || value === null) return null;
  if (value) return "yes";
  return "no";
};

/**
 * Converts a string value to a boolean value.
 * @param value - The string value to convert.
 * @returns true if the value is "yes", false if the value is "no".
 */
export const getBooleanValueFromYesNoString = (value: string) => {
  return value === "yes";
};

export interface YesNoFieldProps extends RadioGroupProps {
  children?: React.ReactNode;
  name: FieldName;
  label: string;
  labelHidden?: boolean;
  yesLabel?: string;
  noLabel?: string;
}

export function YesNoField({
  name,
  label,
  labelHidden,
  yesLabel,
  noLabel,
  children,
  defaultValue,
}: YesNoFieldProps) {
  const { control, setValue } = useFormContext();

  return (
    <div className="@container flex flex-col gap-4">
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue ?? null}
        shouldUnregister={true}
        render={({ field, fieldState: { invalid, error } }) => (
          <RadioGroup
            {...field}
            size="large"
            label={!labelHidden ? label : undefined}
            aria-label={label}
            isInvalid={invalid}
            value={getYesNoStringFromBoolean(field.value)}
            onChange={(value) => {
              setValue(name, getBooleanValueFromYesNoString(value));
            }}
            errorMessage={error?.message}
          >
            <Radio value="yes" size="large" card>
              {smartquotes(yesLabel ?? "Yes")}
            </Radio>
            <Radio value="no" size="large" card>
              {smartquotes(noLabel ?? "No")}
            </Radio>
          </RadioGroup>
        )}
      />
      {children}
    </div>
  );
}
