import {
  RadioGroup as AriaRadioGroup,
  type RadioGroupProps as AriaRadioGroupProps,
  RadioButton,
  RadioField,
  type RadioFieldProps,
  type ValidationResult,
} from "react-aria-components";
import { Text } from "../Content";
import { FieldError, Label } from "../Form";
import "./RadioGroup.css";
import clsx from "clsx";

export interface RadioGroupProps extends Omit<AriaRadioGroupProps, "children"> {
  children?: React.ReactNode;
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function RadioGroup({
  label,
  description,
  errorMessage,
  children,
  className,
  ...props
}: RadioGroupProps) {
  return (
    <AriaRadioGroup
      className={clsx("namesake-radio-group", className)}
      {...props}
    >
      {label && <Label>{label}</Label>}
      <div className="radio-items">{children}</div>
      {description && <Text slot="description">{description}</Text>}
      <FieldError>{errorMessage}</FieldError>
    </AriaRadioGroup>
  );
}

export interface RadioProps extends RadioFieldProps {
  description?: string;
}

export function Radio({
  className,
  description,
  children,
  ...props
}: RadioProps) {
  return (
    <RadioField className={clsx("namesake-radio-field", className)} {...props}>
      <RadioButton className="namesake-radio">{children}</RadioButton>
      {description && <Text slot="description">{description}</Text>}
    </RadioField>
  );
}
