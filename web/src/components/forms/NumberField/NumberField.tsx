import { Controller, useFormContext } from "react-hook-form";
import { getLabelProps } from "#lib/utils/getLabelProps";
import { smartquotes } from "#lib/utils/smartquotes";
import {
  NumberField as AriaNumberField,
  type NumberFieldProps,
} from "../../common/NumberField";
import "./NumberField.css";

export interface NumberFieldFormProps
  extends Omit<NumberFieldProps, "value" | "onChange" | "defaultValue"> {
  label: string;
  labelHidden?: boolean;
  name: string;
  defaultValue?: number;
  children?: React.ReactNode;
}

export function NumberField({
  label,
  labelHidden,
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
          <AriaNumberField
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
            {...getLabelProps(smartquotes(label), labelHidden)}
            isInvalid={invalid}
            errorMessage={error?.message}
          />
        )}
      />
      {children}
    </div>
  );
}
