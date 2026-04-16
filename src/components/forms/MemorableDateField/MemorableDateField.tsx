import { parseDate } from "@internationalized/date";
import type { DateValue } from "react-aria-components";
import { Controller, useFormContext } from "react-hook-form";
import type { FieldName } from "../../../constants/fields";
import { DateField, type DateFieldProps } from "../../common/DateField";
import "./MemorableDateField.css";

export interface MemorableDateFieldProps<T extends DateValue = DateValue>
  extends DateFieldProps<T> {
  label: string;
  name: FieldName;
  children?: React.ReactNode;
}

export function MemorableDateField<T extends DateValue>({
  children,
  label,
  name,
  defaultValue,
  ...props
}: MemorableDateFieldProps<T>) {
  const { control } = useFormContext();

  return (
    <div className="namesake-memorable-date-field">
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue ?? null}
        render={({
          field: { onChange, value, ...field },
          fieldState: { invalid, error },
        }) => {
          const dateValue =
            typeof value === "string" && value
              ? parseDate(value)
              : (value as T | null);

          return (
            <DateField
              {...field}
              value={dateValue as T}
              onChange={(date) => {
                onChange(date ? date.toString() : null);
                props.onChange?.(date);
              }}
              label={label}
              isInvalid={invalid}
              errorMessage={error?.message}
              {...props}
            />
          );
        }}
      />
      {children}
    </div>
  );
}
