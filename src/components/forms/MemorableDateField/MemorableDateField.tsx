import { DateField, type DateFieldProps } from "@/components/common";
import type { FieldName } from "@/constants";
import { useState } from "react";
import type { DateValue } from "react-aria-components";
import { Controller, useFormContext } from "react-hook-form";

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
  const [date, setDate] = useState<DateValue | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue ?? null}
        shouldUnregister={true}
        render={({
          field: { onChange, ...field },
          fieldState: { invalid, error },
        }) => (
          <DateField
            {...field}
            value={date as T}
            onChange={(date) => {
              setDate(date);
              onChange(date?.toString());
              props.onChange?.(date);
            }}
            label={label}
            size="large"
            className="w-fit"
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
