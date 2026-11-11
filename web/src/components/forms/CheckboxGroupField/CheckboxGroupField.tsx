import { Controller, useFormContext } from "react-hook-form";
import { PREFER_NOT_TO_ANSWER } from "#constants/fields";
import { type OptionLabels, toChoices } from "#lib/forms/questions";
import { getLabelProps } from "#lib/utils/getLabelProps";
import { smartquotes } from "#lib/utils/smartquotes";
import { Checkbox } from "../../common/Checkbox";
import {
  CheckboxGroup,
  type CheckboxGroupProps,
} from "../../common/CheckboxGroup";
import "./CheckboxGroupField.css";

export interface CheckboxGroupFieldProps extends CheckboxGroupProps {
  children?: React.ReactNode;
  name: string;
  label: string;
  labelHidden?: boolean;
  /** A `preferNotToAnswer` option clears and disables the others. */
  options: OptionLabels;
}

export function CheckboxGroupField({
  name,
  label,
  labelHidden,
  options,
  children,
  ...props
}: CheckboxGroupFieldProps) {
  const { control, setValue } = useFormContext();

  const handlePreferNotToAnswer = (value: string[]) => {
    if (value.includes(PREFER_NOT_TO_ANSWER)) {
      // If "prefer not to answer" is checked, uncheck all other options
      setValue(name, [PREFER_NOT_TO_ANSWER]);
    }
  };

  return (
    <div className="namesake-checkbox-group-field">
      <Controller
        control={control}
        name={name}
        defaultValue={[]}
        render={({ field, fieldState: { error, invalid } }) => {
          const currentValue = field.value || [];
          const isPreferNotToAnswerChecked =
            currentValue.includes(PREFER_NOT_TO_ANSWER);

          return (
            <CheckboxGroup
              {...field}
              {...getLabelProps(smartquotes(label), labelHidden)}
              isInvalid={invalid}
              errorMessage={error?.message}
              onChange={(value) => {
                field.onChange(value);
                handlePreferNotToAnswer(value);
              }}
              {...props}
            >
              {toChoices(options).map(({ label, ...option }) => (
                <Checkbox
                  key={option.value}
                  {...option}
                  label={label}
                  isDisabled={
                    isPreferNotToAnswerChecked &&
                    option.value !== PREFER_NOT_TO_ANSWER
                  }
                />
              ))}
            </CheckboxGroup>
          );
        }}
      />
      {children}
    </div>
  );
}
