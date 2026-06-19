import { RiArrowDownSLine } from "@remixicon/react";
import {
  DatePicker as AriaDatePicker,
  type DatePickerProps as AriaDatePickerProps,
  type DateValue,
  Group,
  type ValidationResult,
} from "react-aria-components";
import { Calendar } from "../Calendar";
import { Text } from "../Content";
import { DateInput, DateSegment } from "../DateField";
import { FieldButton, FieldError, Label } from "../Form";
import { Popover } from "../Popover";

import "./DatePicker.css";

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
    <AriaDatePicker {...props}>
      <Label>{label}</Label>
      <Group>
        <DateInput>{(segment) => <DateSegment segment={segment} />}</DateInput>
        <FieldButton>
          <RiArrowDownSLine size={16} />
        </FieldButton>
      </Group>
      {description && <Text slot="description">{description}</Text>}
      <FieldError>{errorMessage}</FieldError>
      <Popover hideArrow>
        <Calendar />
      </Popover>
    </AriaDatePicker>
  );
}
