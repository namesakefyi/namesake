import {
  Checkbox,
  CheckboxGroup,
  type CheckboxGroupProps,
  type CheckboxProps,
} from "@/components/common";
import type { UserFormDataField } from "@convex/constants";
import { useFormContext } from "react-hook-form";
import { Controller } from "react-hook-form";

interface CheckboxOption extends CheckboxProps {
  label: string;
  value: string;
}

export interface CheckboxGroupFieldProps extends CheckboxGroupProps {
  children?: React.ReactNode;
  name: UserFormDataField;
  label: string;
  labelHidden?: boolean;
  options: CheckboxOption[];
}

export function CheckboxGroupField({
  name,
  label,
  labelHidden,
  options,
  children,
  ...props
}: CheckboxGroupFieldProps) {
  const { control } = useFormContext();

  return (
    <div className="@container flex flex-col gap-4">
      <Controller
        control={control}
        name={name}
        defaultValue={[]}
        render={({ field, fieldState: { error, invalid } }) => (
          <CheckboxGroup
            {...field}
            label={!labelHidden ? label : undefined}
            aria-label={label}
            size="large"
            isInvalid={invalid}
            errorMessage={error?.message}
            {...props}
          >
            <span className="italic text-gray-dim text-sm">
              Select all that apply:
            </span>
            {options?.map(({ label, ...option }) => (
              <Checkbox
                key={option.value}
                {...option}
                size="large"
                label={label}
                card
              />
            ))}
          </CheckboxGroup>
        )}
      />
      {children}
    </div>
  );
}
