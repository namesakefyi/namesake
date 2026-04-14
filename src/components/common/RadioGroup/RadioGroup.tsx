import {
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  type RadioGroupProps as AriaRadioGroupProps,
  type RadioProps as AriaRadioProps,
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

export interface RadioProps extends AriaRadioProps {}

export function Radio({ className, ...props }: RadioProps) {
  return <AriaRadio {...props} className={clsx("namesake-radio", className)} />;
}
