import { CalendarIcon } from "lucide-react";

import {
  DatePicker as AriaDatePicker,
  type DatePickerProps as AriaDatePickerProps,
  type DateValue,
  type ValidationResult,
} from "react-aria-components";
import {
  Button,
  Calendar,
  DateInput,
  Description,
  Dialog,
  FieldError,
  FieldGroup,
  Label,
  Popover,
} from "..";
import { composeTailwindRenderProps } from "../utils";

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
        <DateInput className="flex-1 min-w-[150px] px-2 py-1.5 text-sm" />
        <Button variant="icon" className="w-6 mr-1 rounded outline-offset-0">
          <CalendarIcon aria-hidden className="w-4 h-4" />
        </Button>
      </FieldGroup>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
      <Popover>
        <Dialog>
          <Calendar />
        </Dialog>
      </Popover>
    </AriaDatePicker>
  );
}
