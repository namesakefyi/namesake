import { Controller, useFormContext } from "react-hook-form";
import type { FieldName } from "../../../constants/fields";
import { smartquotes } from "../../../utils/smartquotes";
import { TextField, type TextFieldProps } from "../../common/TextField";
import "./ShortTextField.css";

export interface ShortTextFieldProps extends TextFieldProps {
  label: string;
  name: FieldName;
  children?: React.ReactNode;
}

export function ShortTextField({
  label,
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
            label={smartquotes(label)}
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
