import {
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
  type ValidationResult,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import {
  FieldDescription,
  FieldError,
  InputTextArea,
  Label,
  fieldBorderStyles,
} from "../Field";
import { composeTailwindRenderProps, focusRing } from "../utils";

const inputStyles = tv({
  extend: focusRing,
  base: "border rounded-lg flex",
  variants: {
    isFocused: fieldBorderStyles.variants.isFocusWithin,
    ...fieldBorderStyles.variants,
  },
});

export interface TextAreaProps extends AriaTextFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function TextArea({
  label,
  description,
  errorMessage,
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
      {label && <Label>{label}</Label>}
      <InputTextArea className={inputStyles} />
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError>{errorMessage}</FieldError>
    </AriaTextField>
  );
}
