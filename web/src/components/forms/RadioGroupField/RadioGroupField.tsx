import { Controller, useFormContext } from "react-hook-form";
import { type OptionLabels, toChoices } from "#lib/forms/questions";
import { getLabelProps } from "#lib/utils/getLabelProps";
import { smartquotes } from "#lib/utils/smartquotes";
import {
  Radio,
  RadioGroup,
  type RadioGroupProps,
} from "../../common/RadioGroup";
import "./RadioGroupField.css";

export interface RadioGroupFieldProps extends RadioGroupProps {
  children?: React.ReactNode;
  name: string;
  label: string;
  labelHidden?: boolean;
  options: OptionLabels;
}

export function RadioGroupField({
  name,
  label,
  labelHidden,
  options,
  children,
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
            {...getLabelProps(smartquotes(label), labelHidden)}
            isInvalid={invalid}
            errorMessage={error?.message}
            orientation="vertical"
            {...props}
          >
            {toChoices(options).map(({ label, ...option }) => (
              <Radio key={option.value} {...option}>
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
