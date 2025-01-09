import { Checkbox, type CheckboxProps } from "@/components/common";

export interface CheckboxFieldProps extends CheckboxProps {
  children?: React.ReactNode;
  name: string;
  label: string;
}

export function CheckboxField({ name, label, children }: CheckboxFieldProps) {
  return (
    <div className="flex flex-col gap-4">
      <Checkbox name={name} size="large" label={label} card />
      {children}
    </div>
  );
}
