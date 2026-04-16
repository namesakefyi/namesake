import {
  CheckboxGroup as AriaCheckboxGroup,
  type CheckboxGroupProps as AriaCheckboxGroupProps,
  type ValidationResult,
} from "react-aria-components";
import { Text } from "../Content";
import { FieldError, Label } from "../Form";
import "./CheckboxGroup.css";
import clsx from "clsx";

export interface CheckboxGroupProps
  extends Omit<AriaCheckboxGroupProps, "children"> {
  children?: React.ReactNode;
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function CheckboxGroup({
  label,
  description,
  errorMessage,
  children,
  className,
  ...props
}: CheckboxGroupProps) {
  return (
    <AriaCheckboxGroup
      className={clsx("namesake-checkbox-group", className)}
      {...props}
    >
      {label && <Label>{label}</Label>}
      <div className="checkbox-items">{children}</div>
      {description && <Text slot="description">{description}</Text>}
      <FieldError>{errorMessage}</FieldError>
    </AriaCheckboxGroup>
  );
}
