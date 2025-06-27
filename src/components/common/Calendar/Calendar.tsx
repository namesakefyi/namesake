import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  Calendar as AriaCalendar,
  CalendarGridHeader as AriaCalendarGridHeader,
  type CalendarProps as AriaCalendarProps,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarHeaderCell,
  type DateValue,
  Heading,
  Text,
  useLocale,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { Button } from "@/components/common";
import { focusRing } from "@/components/utils";

const cellStyles = tv({
  extend: focusRing,
  base: "w-9 h-9 text-sm cursor-default rounded-full flex items-center justify-center forced-color-adjust-none",
  variants: {
    isSelected: {
      false: "text-normal hover:bg-primary-3 pressed:bg-primary-3",
      true: "bg-primary-9 invalid:bg-red-9 text-white forced-colors:bg-[Highlight] forced-colors:invalid:bg-[Mark] forced-colors:text-[HighlightText]",
    },
    isDisabled: {
      true: "text-subtle forced-colors:text-[GrayText]",
    },
  },
});

export interface CalendarProps<T extends DateValue>
  extends Omit<AriaCalendarProps<T>, "visibleDuration"> {
  errorMessage?: string;
}

export function Calendar<T extends DateValue>({
  errorMessage,
  ...props
}: CalendarProps<T>) {
  return (
    <AriaCalendar {...props}>
      <CalendarHeader />
      <CalendarGrid>
        <CalendarGridHeader />
        <CalendarGridBody>
          {(date) => <CalendarCell date={date} className={cellStyles} />}
        </CalendarGridBody>
      </CalendarGrid>
      {errorMessage && (
        <Text slot="errorMessage" className="text-sm text-red-9">
          {errorMessage}
        </Text>
      )}
    </AriaCalendar>
  );
}

export function CalendarHeader() {
  const { direction } = useLocale();

  return (
    <header className="flex items-center gap-1 pb-4 px-1 w-full">
      <Button
        variant="icon"
        slot="previous"
        icon={direction === "rtl" ? ArrowRight : ArrowLeft}
      />
      <Heading className="flex-1 font-medium text-xl text-center mx-2 text-normal" />
      <Button
        variant="icon"
        slot="next"
        icon={direction === "rtl" ? ArrowLeft : ArrowRight}
      />
    </header>
  );
}

export function CalendarGridHeader() {
  return (
    <AriaCalendarGridHeader>
      {(day) => (
        <CalendarHeaderCell className="text-xs text-subtle font-semibold pb-2">
          {day}
        </CalendarHeaderCell>
      )}
    </AriaCalendarGridHeader>
  );
}
