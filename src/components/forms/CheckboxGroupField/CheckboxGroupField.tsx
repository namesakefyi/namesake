import { Controller, useFormContext } from "react-hook-form";
import {
  type FieldName,
  PREFER_NOT_TO_ANSWER,
} from "../../../constants/fields";
import { smartquotes } from "../../../utils/smartquotes";
import { Checkbox, type CheckboxProps } from "../../common/Checkbox";
import {
  CheckboxGroup,
  type CheckboxGroupProps,
} from "../../common/CheckboxGroup";
import "./CheckboxGroupField.css";

interface CheckboxOption extends CheckboxProps {
  label: string;
  value: string;
}

export interface CheckboxGroupFieldProps extends CheckboxGroupProps {
  children?: React.ReactNode;
  name: FieldName;
  label: string;
  labelHidden?: boolean;
  options: CheckboxOption[];
  includePreferNotToAnswer?: boolean;
}

export function CheckboxGroupField({
  name,
  label,
  labelHidden,
  options,
  children,
  includePreferNotToAnswer,
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
              label={!labelHidden ? smartquotes(label) : undefined}
              aria-label={labelHidden ? label : undefined}
              isInvalid={invalid}
              errorMessage={error?.message}
              onChange={(value) => {
                field.onChange(value);
                handlePreferNotToAnswer(value);
              }}
              {...props}
            >
              {options?.map(({ label, ...option }) => (
                <Checkbox
                  key={option.value}
                  {...option}
                  label={label}
                  isDisabled={isPreferNotToAnswerChecked}
                />
              ))}
              {includePreferNotToAnswer && (
                <Checkbox
                  value={PREFER_NOT_TO_ANSWER}
                  label="Prefer not to answer"
                />
              )}
            </CheckboxGroup>
          );
        }}
      />
      {children}
    </div>
  );
}
