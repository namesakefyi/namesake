import { Controller, useFormContext } from "react-hook-form";
import {
  type FieldName,
  PREFER_NOT_TO_ANSWER,
} from "../../../constants/fields";
import { smartquotes } from "../../../utils/smartquotes";
import {
  Radio,
  RadioGroup,
  type RadioGroupProps,
  type RadioProps,
} from "../../common/RadioGroup";
import "./RadioGroupField.css";

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
    <div className="namesake-radio-group-field">
      <Controller
        control={control}
        name={name}
        defaultValue={[]}
        render={({ field, fieldState: { invalid, error } }) => (
          <RadioGroup
            {...field}
            label={!labelHidden ? smartquotes(label) : undefined}
            aria-label={labelHidden ? label : undefined}
            isInvalid={invalid}
            errorMessage={error?.message}
            orientation="vertical"
            {...props}
          >
            {options?.map(({ label, ...option }) => (
              <Radio key={option.value} {...option}>
                {label}
              </Radio>
            ))}
            {includePreferNotToAnswer && (
              <Radio value={PREFER_NOT_TO_ANSWER}>Prefer not to answer</Radio>
            )}
          </RadioGroup>
        )}
      />
      {children}
    </div>
  );
}
