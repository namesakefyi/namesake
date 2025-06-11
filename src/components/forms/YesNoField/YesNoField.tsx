import { Radio, RadioGroup, type RadioGroupProps } from "@/components/common";
import { type FieldName, PREFER_NOT_TO_ANSWER } from "@/constants";
import { smartquotes } from "@/utils/smartquotes";
import { Controller, useFormContext } from "react-hook-form";

type YesNoValue = boolean | typeof PREFER_NOT_TO_ANSWER;

/**
 * Converts a boolean value to a string value.
 * @param value - The boolean value to convert.
 * @returns "yes" if the value is true, "no" if the value is false, "preferNotToAnswer" if the value is null.
 */
export const getYesNoStringFromBoolean = (value: YesNoValue) => {
  if (value === undefined || value === null) return null;
  if (value === PREFER_NOT_TO_ANSWER) return PREFER_NOT_TO_ANSWER;
  if (value) return "yes";
  return "no";
};

/**
 * Converts a string value to a boolean value.
 * @param value - The string value to convert.
 * @returns true if the value is "yes", false if the value is "no", null if the value is "preferNotToAnswer".
 */
export const getBooleanValueFromYesNoString = (value: string): YesNoValue => {
  if (value === PREFER_NOT_TO_ANSWER) return PREFER_NOT_TO_ANSWER;
  return value === "yes";
};

export interface YesNoFieldProps extends RadioGroupProps {
  children?: React.ReactNode;
  name: FieldName;
  label: string;
  labelHidden?: boolean;
  yesLabel?: string;
  noLabel?: string;
  includePreferNotToAnswer?: boolean;
}

export function YesNoField({
  name,
  label,
  labelHidden,
  yesLabel,
  noLabel,
  children,
  defaultValue,
  includePreferNotToAnswer,
}: YesNoFieldProps) {
  const { control, setValue } = useFormContext();

  return (
    <div className="flex flex-col gap-4">
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
