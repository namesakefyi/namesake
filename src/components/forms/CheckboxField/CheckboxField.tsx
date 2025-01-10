import { Checkbox, type CheckboxProps } from "@/components/common";
import { twMerge } from "tailwind-merge";

export interface CheckboxFieldProps extends CheckboxProps {
  children?: React.ReactNode;
  name: string;
  label: string;
  className?: string;
}

export function CheckboxField({
  name,
  label,
  className,
  children,
}: CheckboxFieldProps) {
  return (
    <div className={twMerge("flex flex-col gap-4 w-fit", className)}>
      <Checkbox name={name} size="large" label={label} card />
      {children}
    </div>
  );
}
