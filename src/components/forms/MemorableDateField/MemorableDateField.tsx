import { DateField, type DateFieldProps } from "@/components/common";
import type { DateValue } from "react-aria-components";

export interface MemorableDateFieldProps<T extends DateValue = DateValue>
  extends DateFieldProps<T> {
  label: string;
  children?: React.ReactNode;
}

export function MemorableDateField<T extends DateValue>({
  children,
  label,
  ...props
}: Omit<MemorableDateFieldProps<T>, "size">) {
  return (
    <div className="flex flex-col gap-4">
      <DateField label={label} size="large" className="w-fit" {...props} />
      {children}
    </div>
  );
}
