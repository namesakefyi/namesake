import { composeTailwindRenderProps } from "@/components/utils";
import {
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
  type ValidationResult,
} from "react-aria-components";
import {
  FieldDescription,
  FieldError,
  FieldGroup,
  InputTextArea,
  Label,
} from "../Field";

export interface TextAreaProps extends AriaTextFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  size?: "medium" | "large";
}

export function TextArea({
  label,
  description,
  errorMessage,
  size,
  ...props
}: TextAreaProps) {
  return (
    <AriaTextField
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "flex flex-col gap-1.5",
      )}
    >
      {label && <Label size={size}>{label}</Label>}
      <FieldGroup size={size}>
        <InputTextArea size={size} />
      </FieldGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError>{errorMessage}</FieldError>
    </AriaTextField>
  );
}
