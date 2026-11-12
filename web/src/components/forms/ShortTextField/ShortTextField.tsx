import { Controller, useFormContext } from "react-hook-form";
import { getLabelProps } from "#lib/utils/getLabelProps";
import { smartquotes } from "#lib/utils/smartquotes";
import { TextField, type TextFieldProps } from "../../common/TextField";
import "./ShortTextField.css";

export interface ShortTextFieldProps extends TextFieldProps {
  label: string;
  labelHidden?: boolean;
  name: string;
  children?: React.ReactNode;
}

export function ShortTextField({
  label,
  labelHidden,
  name,
  children,
  defaultValue,
  ...props
}: ShortTextFieldProps) {
  const { control } = useFormContext();

  return (
    <div className="namesake-short-text-field">
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue ?? ""}
        render={({ field, fieldState: { invalid, error } }) => (
          <TextField
            {...field}
            {...getLabelProps(smartquotes(label), labelHidden)}
            isInvalid={invalid}
            errorMessage={error?.message}
            {...props}
          />
        )}
      />
      {children}
    </div>
  );
}
