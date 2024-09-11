import { CalendarIcon } from "lucide-react";

import {
  DateRangePicker as AriaDateRangePicker,
  type DateRangePickerProps as AriaDateRangePickerProps,
  type DateValue,
  type ValidationResult,
} from "react-aria-components";
import {
  Button,
  DateInput,
  Description,
  Dialog,
  FieldError,
  FieldGroup,
  Label,
  Popover,
  RangeCalendar,
} from "..";
import { composeTailwindRenderProps } from "../utils";

export interface DateRangePickerProps<T extends DateValue>
  extends AriaDateRangePickerProps<T> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function DateRangePicker<T extends DateValue>({
  label,
  description,
  errorMessage,
  ...props
}: DateRangePickerProps<T>) {
  return (
    <AriaDateRangePicker
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "group flex flex-col gap-1",
      )}
    >
      {label && <Label>{label}</Label>}
      <FieldGroup className="min-w-[208px] w-auto">
        <DateInput slot="start" className="px-2 py-1.5 text-sm" />
        <span
          aria-hidden="true"
          className="text-gray-10 dark:text-gray-2 forced-colors:text-[ButtonText] group-disabled:text-gray-2 group-disabled:dark:text-gray-6 group-disabled:forced-colors:text-[GrayText]"
        >
          –
        </span>
        <DateInput slot="end" className="flex-1 px-2 py-1.5 text-sm" />
        <Button variant="icon" className="w-6 mr-1 rounded outline-offset-0">
          <CalendarIcon aria-hidden className="w-4 h-4" />
        </Button>
      </FieldGroup>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
      <Popover>
        <Dialog>
          <RangeCalendar />
        </Dialog>
      </Popover>
    </AriaDateRangePicker>
  );
}
