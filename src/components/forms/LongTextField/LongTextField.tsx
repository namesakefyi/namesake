import { TextArea, type TextAreaProps } from "@/components/common";

export interface LongTextFieldProps extends Omit<TextAreaProps, "size"> {
  label: string;
  name: string;
  children?: React.ReactNode;
}

export function LongTextField({
  label,
  name,
  children,
  ...props
}: LongTextFieldProps) {
  return (
    <div className="flex flex-col gap-4">
      <TextArea label={label} name={name} size="large" {...props} />
      {children}
    </div>
  );
}
