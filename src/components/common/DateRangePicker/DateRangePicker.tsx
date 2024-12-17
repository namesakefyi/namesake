import { composeTailwindRenderProps } from "@/components/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  DateRangePicker as AriaDateRangePicker,
  type DateRangePickerProps as AriaDateRangePickerProps,
  type DateValue,
  type ValidationResult,
} from "react-aria-components";
import { Button } from "../Button";
import { DateInput } from "../DateField";
import { FieldDescription, FieldError, FieldGroup, Label } from "../Field";
import { Popover } from "../Popover";
import { RangeCalendar } from "../RangeCalendar";

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
        <DateInput slot="start" className="px-3 py-2" />
        <span
          aria-hidden="true"
          className="text-gray-10 dark:text-gray-2 forced-colors:text-[ButtonText] group-disabled:text-gray-2 group-disabled:dark:text-gray-6 group-disabled:forced-colors:text-[GrayText]"
        >
          –
        </span>
        <DateInput slot="end" className="flex-1 px-3 py-2" />
        <Button variant="icon" className="w-7 h-7 p-0 mr-1 outline-offset-0">
          <CalendarIcon aria-hidden className="w-4 h-4" />
        </Button>
      </FieldGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError>{errorMessage}</FieldError>
      <Popover title="Select a date range">
        <RangeCalendar />
      </Popover>
    </AriaDateRangePicker>
  );
}
