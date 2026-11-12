import { Controller, useFormContext } from "react-hook-form";
import { getLabelProps } from "#lib/utils/getLabelProps";
import { smartquotes } from "#lib/utils/smartquotes";
import { ComboBox, ComboBoxItem } from "../../common/ComboBox";
import "./ComboBoxField.css";

export interface ComboBoxFieldProps {
  label: string;
  labelHidden?: boolean;
  name: string;
  placeholder?: string;
  children?: React.ReactNode;
  defaultValue?: string;
  options: readonly {
    label: string;
    value: string;
  }[];
}

export function ComboBoxField({
  label,
  labelHidden,
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
            {...getLabelProps(smartquotes(label), labelHidden)}
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
