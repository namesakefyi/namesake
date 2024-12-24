import {
  Checkbox,
  CheckboxGroup,
  type CheckboxGroupProps,
  type CheckboxProps,
} from "@/components/common";

interface CheckboxOption extends CheckboxProps {
  label: string;
  value: string;
}

export interface CheckboxGroupFieldProps extends CheckboxGroupProps {
  children?: React.ReactNode;
  name: string;
  label: string;
  options: CheckboxOption[];
}

export function CheckboxGroupField({
  name,
  label,
  options,
  children,
}: CheckboxGroupFieldProps) {
  return (
    <div className="@container flex flex-col gap-4">
      <CheckboxGroup label={label} name={name} size="large">
        <span className="italic text-gray-dim text-sm">
          Select all that apply:
        </span>
        {options.map(({ label, ...option }) => (
          <Checkbox
            key={option.value}
            {...option}
            size="large"
            label={label}
            card
          />
        ))}
      </CheckboxGroup>
      {children}
    </div>
  );
}
