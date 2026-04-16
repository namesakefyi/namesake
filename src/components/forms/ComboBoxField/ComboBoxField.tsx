import { Controller, useFormContext } from "react-hook-form";
import type { FieldName } from "../../../constants/fields";
import { smartquotes } from "../../../utils/smartquotes";
import { ComboBox, ComboBoxItem } from "../../common/ComboBox";
import "./ComboBoxField.css";

export interface ComboBoxFieldProps {
  label: string;
  name: FieldName;
  placeholder?: string;
  children?: React.ReactNode;
  defaultValue?: string;
  options: {
    label: string;
    value: string;
  }[];
}

export function ComboBoxField({
  label,
  name,
  placeholder,
  children,
  defaultValue,
  options,
  ...props
}: ComboBoxFieldProps) {
  const { control } = useFormContext();

  return (
    <div className="namesake-combobox-field">
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue ?? null}
        render={({ field, fieldState: { invalid, error } }) => (
          <ComboBox
            {...field}
            label={smartquotes(label)}
            placeholder={placeholder}
            value={field.value}
            onChange={field.onChange}
            isInvalid={invalid}
            errorMessage={error?.message}
            {...props}
          >
            {options.map(({ label, value }) => (
              <ComboBoxItem key={value} id={value} textValue={label}>
                {label}
              </ComboBoxItem>
            ))}
          </ComboBox>
        )}
      />
      {children}
    </div>
  );
}
