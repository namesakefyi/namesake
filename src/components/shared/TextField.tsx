import {
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
  type ValidationResult,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { composeTailwindRenderProps, focusRing } from "../utils";
import {
  Description,
  FieldError,
  FieldGroup,
  Input,
  Label,
  fieldBorderStyles,
} from "./Field";

const inputStyles = tv({
  extend: focusRing,
  base: "border rounded-lg flex",
  variants: {
    isFocused: fieldBorderStyles.variants.isFocusWithin,
    ...fieldBorderStyles.variants,
  },
});

export interface TextFieldProps extends AriaTextFieldProps {
  label?: string;
  description?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function TextField({
  label,
  description,
  icon,
  rightIcon,
  errorMessage,
  ...props
}: TextFieldProps) {
  return (
    <AriaTextField
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "flex flex-col gap-2",
      )}
    >
      {label && <Label>{label}</Label>}
      <FieldGroup className={inputStyles}>
        {icon}
        <Input />
        {rightIcon}
      </FieldGroup>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </AriaTextField>
  );
}
