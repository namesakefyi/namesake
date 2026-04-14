import { Controller, useFormContext } from "react-hook-form";
import type { FieldName } from "@/constants/fields";
import { smartquotes } from "@/utils/smartquotes";
import { Checkbox, type CheckboxProps } from "../../common/Checkbox";
import "./CheckboxField.css";

export interface CheckboxFieldProps extends CheckboxProps {
  children?: React.ReactNode;
  name: FieldName;
  label: string;
  defaultValue?: boolean;
}

export function CheckboxField({
  name,
  label,
  children,
  defaultValue,
  ...props
}: CheckboxFieldProps) {
  const { control, setValue } = useFormContext();

  return (
    <div className="namesake-checkbox-field">
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue ?? false}
        render={({ field, fieldState: { invalid, error } }) => (
          <Checkbox
            {...field}
            isSelected={field.value}
            onChange={(isSelected) => {
              setValue(name, isSelected);
              field.onChange(isSelected);
            }}
            isInvalid={invalid}
            errorMessage={error?.message}
            {...props}
          >
            {smartquotes(label)}
          </Checkbox>
        )}
      />
      {children}
    </div>
  );
}
