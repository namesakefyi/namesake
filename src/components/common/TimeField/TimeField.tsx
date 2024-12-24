import { composeTailwindRenderProps } from "@/components/utils";
import {
  TimeField as AriaTimeField,
  type TimeFieldProps as AriaTimeFieldProps,
  type TimeValue,
  type ValidationResult,
} from "react-aria-components";
import { DateInput } from "../DateField";
import { FieldDescription, FieldError, FieldGroup, Label } from "../Field";

export interface TimeFieldProps<T extends TimeValue>
  extends AriaTimeFieldProps<T> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function TimeField<T extends TimeValue>({
  label,
  description,
  errorMessage,
  ...props
}: TimeFieldProps<T>) {
  return (
    <AriaTimeField
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "flex flex-col gap-1",
      )}
    >
      {label && <Label>{label}</Label>}
      <FieldGroup>
        <DateInput />
      </FieldGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError>{errorMessage}</FieldError>
    </AriaTimeField>
  );
}
