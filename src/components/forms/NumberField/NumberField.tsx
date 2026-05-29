import { Controller, useFormContext } from "react-hook-form";
import type { FieldName } from "../../../constants/fields";
import { smartquotes } from "../../../utils/smartquotes";
import {
  NumberField as CommonNumberField,
  type NumberFieldProps,
} from "../../common/NumberField";
import "./NumberField.css";

export interface NumberFieldFormProps
  extends Omit<NumberFieldProps, "value" | "onChange" | "defaultValue"> {
  label: string;
  name: FieldName;
  defaultValue?: number;
  children?: React.ReactNode;
}

export function NumberField({
  label,
  name,
  children,
  defaultValue,
  ...props
}: NumberFieldFormProps) {
  const { control } = useFormContext();

  return (
    <div className="namesake-number-field">
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue !== undefined ? String(defaultValue) : ""}
        render={({ field, fieldState: { invalid, error } }) => (
          <CommonNumberField
            {...props}
            value={
              field.value === "" || field.value == null
                ? undefined
                : Number(field.value)
            }
            onChange={(value) => {
              field.onChange(
                Number.isNaN(value)
                  ? defaultValue !== undefined
                    ? String(defaultValue)
                    : ""
                  : String(value),
              );
            }}
            label={smartquotes(label)}
            isInvalid={invalid}
            errorMessage={error?.message}
          />
        )}
      />
      {children}
    </div>
  );
}
