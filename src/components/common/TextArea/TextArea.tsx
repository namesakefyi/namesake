import type { Ref } from "react";
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
} from "@/components/common";
import { composeTailwindRenderProps } from "@/components/utils";

export interface TextAreaProps extends AriaTextFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  size?: "medium" | "large";
  ref?: Ref<HTMLTextAreaElement>;
  inputClassName?: string;
}

export function TextArea({
  ref,
  label,
  description,
  errorMessage,
  size,
  inputClassName,
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
      {({ isDisabled, isInvalid }) => (
        <>
          {label && <Label size={size}>{label}</Label>}
          <FieldGroup isDisabled={isDisabled} isInvalid={isInvalid} size={size}>
            <InputTextArea ref={ref} size={size} className={inputClassName} />
          </FieldGroup>
          {description && <FieldDescription>{description}</FieldDescription>}
          <FieldError>{errorMessage}</FieldError>
        </>
      )}
    </AriaTextField>
  );
}
