import { Controller, useFormContext } from "react-hook-form";
import {
  DONT_KNOW,
  type FieldName,
  PREFER_NOT_TO_ANSWER,
} from "#constants/fields";
import { smartquotes } from "#lib/utils/smartquotes";
import {
  Radio,
  RadioGroup,
  type RadioGroupProps,
} from "../../common/RadioGroup";
import "./YesNoField.css";

type YesNoValue = boolean | typeof PREFER_NOT_TO_ANSWER | typeof DONT_KNOW;

export const getYesNoStringFromBoolean = (value: YesNoValue) => {
  if (value === undefined || value === null) return null;
  if (value === PREFER_NOT_TO_ANSWER) return PREFER_NOT_TO_ANSWER;
  if (value === DONT_KNOW) return DONT_KNOW;
  if (value) return "yes";
  return "no";
};

export const getBooleanValueFromYesNoString = (value: string): YesNoValue => {
  if (value === PREFER_NOT_TO_ANSWER) return PREFER_NOT_TO_ANSWER;
  if (value === DONT_KNOW) return DONT_KNOW;
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
  includeDontKnow?: boolean;
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
  includeDontKnow,
}: YesNoFieldProps) {
  const { control, setValue } = useFormContext();

  return (
    <div className="namesake-yes-no-field">
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue ?? null}
        render={({ field, fieldState: { invalid, error } }) => (
          <RadioGroup
            {...field}
            label={!labelHidden ? label : undefined}
            aria-label={label}
            isInvalid={invalid}
            value={getYesNoStringFromBoolean(field.value)}
            onChange={(value) => {
              setValue(name, getBooleanValueFromYesNoString(value));
            }}
            errorMessage={error?.message}
          >
            <Radio value="yes">{smartquotes(yesLabel ?? "Yes")}</Radio>
            <Radio value="no">{smartquotes(noLabel ?? "No")}</Radio>
            {includePreferNotToAnswer && (
              <Radio value={PREFER_NOT_TO_ANSWER}>Prefer not to answer</Radio>
            )}
            {includeDontKnow && (
              <Radio value={DONT_KNOW}>I don&apos;t know</Radio>
            )}
          </RadioGroup>
        )}
      />
      {children}
    </div>
  );
}
