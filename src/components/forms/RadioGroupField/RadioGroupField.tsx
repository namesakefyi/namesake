import {
  Radio,
  RadioGroup,
  type RadioGroupProps,
  type RadioProps,
} from "@/components/common";

interface RadioOption extends RadioProps {
  label: string;
  value: string;
}

export interface RadioGroupFieldProps extends RadioGroupProps {
  children?: React.ReactNode;
  name: string;
  label: string;
  options: RadioOption[];
}

export function RadioGroupField({
  name,
  label,
  options,
  children,
}: RadioGroupFieldProps) {
  return (
    <div className="@container flex flex-col gap-4">
      <RadioGroup label={label} name={name} size="large">
        <span className="italic text-gray-dim text-sm">Select one:</span>
        {options.map(({ label, ...option }) => (
          <Radio key={option.value} {...option} size="large" card>
            {label}
          </Radio>
        ))}
      </RadioGroup>
      {children}
    </div>
  );
}
