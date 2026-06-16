import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import {
  Calendar as AriaCalendar,
  CalendarCell as AriaCalendarCell,
  CalendarGrid as AriaCalendarGrid,
  type CalendarProps as AriaCalendarProps,
  type CalendarCellProps,
  type CalendarGridProps,
  type DateValue,
} from "react-aria-components";
import { Button } from "../Button";
import { Heading, Text } from "../Content";

import "./Calendar.css";

export interface CalendarProps<T extends DateValue>
  extends AriaCalendarProps<T> {
  errorMessage?: string;
}

export function Calendar<T extends DateValue>({
  errorMessage,
  ...props
}: CalendarProps<T>) {
  return (
    <AriaCalendar {...props}>
      <header>
        <Button
          slot="previous"
          icon={RiArrowLeftSLine}
          aria-label="Previous month"
        />
        <Heading />
        <Button slot="next" icon={RiArrowRightSLine} aria-label="Next month" />
      </header>
      <CalendarGrid>{(date) => <CalendarCell date={date} />}</CalendarGrid>
      {errorMessage && <Text slot="errorMessage">{errorMessage}</Text>}
    </AriaCalendar>
  );
}

export function CalendarCell(props: CalendarCellProps) {
  return <AriaCalendarCell {...props} />;
}

export function CalendarGrid(props: CalendarGridProps) {
  return <AriaCalendarGrid {...props} />;
}
