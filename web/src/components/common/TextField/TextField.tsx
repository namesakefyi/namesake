import {
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
  Input,
  type ValidationResult,
} from "react-aria-components";
import { Text } from "../Content";
import { FieldError, Label } from "../Form";
import "./TextField.css";
import clsx from "clsx";

export interface TextFieldProps extends AriaTextFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  size?: number;
}

export function TextField({
  label,
  description,
  errorMessage,
  className,
  size,
  ...props
}: TextFieldProps) {
  return (
    <AriaTextField
      className={clsx("namesake-text-field", className)}
      {...props}
    >
      <Label>{label}</Label>
      <Input size={size} />
      {description && <Text slot="description">{description}</Text>}
      <FieldError>{errorMessage}</FieldError>
    </AriaTextField>
  );
}
