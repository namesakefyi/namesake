import { Calendar as CalendarIcon } from "lucide-react";
import {
  DateRangePicker as AriaDateRangePicker,
  type DateRangePickerProps as AriaDateRangePickerProps,
  type DateValue,
  type ValidationResult,
} from "react-aria-components";
import {
  Button,
  DateInput,
  FieldDescription,
  FieldError,
  FieldGroup,
  Label,
  Popover,
  RangeCalendar,
} from "@/components/common";
import { composeTailwindRenderProps } from "@/components/utils";

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
      {({ isDisabled, isInvalid }) => (
        <>
          {label && <Label>{label}</Label>}
          <FieldGroup
            isDisabled={isDisabled}
            isInvalid={isInvalid}
            className="min-w-[208px] w-auto"
          >
            <DateInput slot="start" className="px-3 py-2" />
            <span
              aria-hidden="true"
              className="text-dim forced-colors:text-[ButtonText] group-disabled:text-theme-2 forced-colors:group-disabled:text-[GrayText]"
            >
              –
            </span>
            <DateInput slot="end" className="flex-1 px-3 py-2" />
            <Button
              variant="icon"
              className="w-7 h-7 p-0 mr-1 outline-offset-0"
              icon={CalendarIcon}
              aria-label="Open date picker"
            />
          </FieldGroup>
          {description && <FieldDescription>{description}</FieldDescription>}
          <FieldError>{errorMessage}</FieldError>
          <Popover className="p-3">
            <RangeCalendar />
          </Popover>
        </>
      )}
    </AriaDateRangePicker>
  );
}
