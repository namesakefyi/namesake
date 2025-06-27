import { Controller, useFormContext } from "react-hook-form";
import {
  Checkbox,
  CheckboxGroup,
  type CheckboxGroupProps,
  type CheckboxProps,
} from "@/components/common";
import { type FieldName, PREFER_NOT_TO_ANSWER } from "@/constants";
import { smartquotes } from "@/utils/smartquotes";

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
    <div className="@container flex flex-col gap-4">
      <Controller
        control={control}
        name={name}
        defaultValue={[]}
        shouldUnregister={true}
        render={({ field, fieldState: { error, invalid } }) => {
          const currentValue = field.value || [];
          const isPreferNotToAnswerChecked =
            currentValue.includes(PREFER_NOT_TO_ANSWER);

          return (
            <CheckboxGroup
              {...field}
              label={!labelHidden ? smartquotes(label) : undefined}
              aria-label={labelHidden ? label : undefined}
              size="large"
              isInvalid={invalid}
              errorMessage={error?.message}
              onChange={(value) => {
                field.onChange(value);
                handlePreferNotToAnswer(value);
              }}
              {...props}
            >
              <span className="italic text-dim text-sm">
                Select all that apply:
              </span>
              {options?.map(({ label, ...option }) => (
                <Checkbox
                  key={option.value}
                  {...option}
                  size="large"
                  label={label}
                  card
                  isDisabled={isPreferNotToAnswerChecked}
                />
              ))}
              {includePreferNotToAnswer && (
                <Checkbox
                  value={PREFER_NOT_TO_ANSWER}
                  size="large"
                  label="Prefer not to answer"
                  card
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
