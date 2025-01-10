import { Radio, RadioGroup, type RadioGroupProps } from "@/components/common";

export interface YesNoFieldProps extends RadioGroupProps {
  children?: React.ReactNode;
  name: string;
  label: string;
  labelHidden?: boolean;
  yesLabel?: string;
  noLabel?: string;
}

export function YesNoField({
  name,
  label,
  labelHidden,
  yesLabel,
  noLabel,
  children,
}: YesNoFieldProps) {
  return (
    <div className="@container flex flex-col gap-4">
      <RadioGroup
        name={name}
        size="large"
        orientation="horizontal"
        label={!labelHidden ? label : undefined}
        aria-label={label}
      >
        <Radio value="yes" size="large" card>
          {yesLabel || "Yes"}
        </Radio>
        <Radio value="no" size="large" card>
          {noLabel || "No"}
        </Radio>
      </RadioGroup>
      {children}
    </div>
  );
}
