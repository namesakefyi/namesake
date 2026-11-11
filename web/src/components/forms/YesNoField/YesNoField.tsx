import { Controller, useFormContext } from "react-hook-form";
import {
  DONT_KNOW,
  EXTRA_CHOICE_LABELS,
  type ExtraChoice,
  PREFER_NOT_TO_ANSWER,
} from "#constants/fields";
import { getLabelProps } from "#lib/utils/getLabelProps";
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
  name: string;
  label: string;
  labelHidden?: boolean;
  yesLabel?: string;
  noLabel?: string;
  extraChoices?: readonly ExtraChoice[];
}

export function YesNoField({
  name,
  label,
  labelHidden,
  yesLabel,
  noLabel,
  children,
  defaultValue,
  extraChoices = [],
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
            {...getLabelProps(smartquotes(label), labelHidden)}
            isInvalid={invalid}
            value={getYesNoStringFromBoolean(field.value)}
            onChange={(value) => {
              setValue(name, getBooleanValueFromYesNoString(value));
            }}
            errorMessage={error?.message}
          >
            <Radio value="yes">{smartquotes(yesLabel ?? "Yes")}</Radio>
            <Radio value="no">{smartquotes(noLabel ?? "No")}</Radio>
            {extraChoices.map((choice) => (
              <Radio key={choice} value={choice}>
                {EXTRA_CHOICE_LABELS[choice]}
              </Radio>
            ))}
          </RadioGroup>
        )}
      />
      {children}
    </div>
  );
}
