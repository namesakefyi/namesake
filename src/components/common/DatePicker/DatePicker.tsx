import { composeTailwindRenderProps } from "@/components/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  DatePicker as AriaDatePicker,
  type DatePickerProps as AriaDatePickerProps,
  type DateValue,
  type ValidationResult,
} from "react-aria-components";
import { Button } from "../Button";
import { Calendar } from "../Calendar";
import { DateInput } from "../DateField";
import { FieldDescription, FieldError, FieldGroup, Label } from "../Field";
import { Popover } from "../Popover";

export interface DatePickerProps<T extends DateValue>
  extends AriaDatePickerProps<T> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function DatePicker<T extends DateValue>({
  label,
  description,
  errorMessage,
  ...props
}: DatePickerProps<T>) {
  return (
    <AriaDatePicker
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "group flex flex-col gap-1",
      )}
    >
      {label && <Label>{label}</Label>}
      <FieldGroup className="min-w-[208px] w-auto">
        <DateInput className="flex-1 min-w-[150px] px-3 py-2" />
        <Button variant="icon" className="w-7 h-7 p-0 mr-1 outline-offset-0">
          <CalendarIcon aria-hidden className="w-4 h-4" />
        </Button>
      </FieldGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError>{errorMessage}</FieldError>
      <Popover title="Select a date">
        <Calendar />
      </Popover>
    </AriaDatePicker>
  );
}
