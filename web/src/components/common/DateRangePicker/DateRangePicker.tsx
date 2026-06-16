import { RiArrowDownSLine } from "@remixicon/react";
import {
  DateRangePicker as AriaDateRangePicker,
  type DateRangePickerProps as AriaDateRangePickerProps,
  type DateValue,
  Group,
  type ValidationResult,
} from "react-aria-components";
import { Text } from "../Content";
import { DateInput, DateSegment } from "../DateField";
import { FieldButton, FieldError, Label } from "../Form";
import { Popover } from "../Popover";
import { RangeCalendar } from "../RangeCalendar";
import "./DateRangePicker.css";

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
    <AriaDateRangePicker {...props}>
      <Label>{label}</Label>
      <Group>
        <DateInput slot="start">
          {(segment) => <DateSegment segment={segment} />}
        </DateInput>
        <span aria-hidden="true">–</span>
        <DateInput slot="end">
          {(segment) => <DateSegment segment={segment} />}
        </DateInput>
        <FieldButton>
          <RiArrowDownSLine size={16} />
        </FieldButton>
      </Group>
      {description && <Text slot="description">{description}</Text>}
      <FieldError>{errorMessage}</FieldError>
      <Popover hideArrow>
        <RangeCalendar />
      </Popover>
    </AriaDateRangePicker>
  );
}
