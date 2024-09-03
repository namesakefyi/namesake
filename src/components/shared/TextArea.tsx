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
  InputTextArea,
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
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function TextArea({
  label,
  description,
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
      <InputTextArea className={inputStyles} />
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </AriaTextField>
  );
}
