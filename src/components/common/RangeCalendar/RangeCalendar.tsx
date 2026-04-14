import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import {
  RangeCalendar as AriaRangeCalendar,
  type RangeCalendarProps as AriaRangeCalendarProps,
  type DateValue,
  Heading,
  Text,
} from "react-aria-components";
import { Button } from "../Button";
import { CalendarCell, CalendarGrid } from "../Calendar";
import "./RangeCalendar.css";

export interface RangeCalendarProps<T extends DateValue>
  extends AriaRangeCalendarProps<T> {
  errorMessage?: string;
}

export function RangeCalendar<T extends DateValue>({
  errorMessage,
  ...props
}: RangeCalendarProps<T>) {
  return (
    <AriaRangeCalendar {...props}>
      <header>
        <Button slot="previous">
          <RiArrowLeftSLine size={16} />
        </Button>
        <Heading />
        <Button slot="next">
          <RiArrowRightSLine size={16} />
        </Button>
      </header>
      <CalendarGrid>{(date) => <CalendarCell date={date} />}</CalendarGrid>
      {errorMessage && <Text slot="errorMessage">{errorMessage}</Text>}
    </AriaRangeCalendar>
  );
}
