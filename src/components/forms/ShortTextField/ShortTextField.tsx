import { TextField, type TextFieldProps } from "@/components/common";

export interface ShortTextFieldProps extends Omit<TextFieldProps, "size"> {
  label: string;
  name: string;
  children?: React.ReactNode;
}

export function ShortTextField({
  label,
  name,
  children,
  ...props
}: ShortTextFieldProps) {
  return (
    <div className="flex flex-col gap-4">
      <TextField label={label} name={name} size="large" {...props} />
      {children}
    </div>
  );
}
