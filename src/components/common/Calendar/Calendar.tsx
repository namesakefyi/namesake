import { Button } from "@/components/common";
import { focusRing } from "@/components/utils";
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

const cellStyles = tv({
  extend: focusRing,
  base: "w-9 h-9 text-sm cursor-default rounded-full flex items-center justify-center forced-color-adjust-none",
  variants: {
    isSelected: {
      false:
        "text-gray-12 dark:text-gray-2 hover:bg-gray-1 dark:hover:bg-gray-8 pressed:bg-gray-2 dark:pressed:bg-gray-6",
      true: "bg-blue-9 invalid:bg-red-9 text-white forced-colors:bg-[Highlight] forced-colors:invalid:bg-[Mark] forced-colors:text-[HighlightText]",
    },
    isDisabled: {
      true: "text-gray-3 dark:text-gray-6 forced-colors:text-[GrayText]",
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
      <Heading className="flex-1 font-medium text-xl text-center mx-2 text-gray-normal" />
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
        <CalendarHeaderCell className="text-xs text-gray-9 dark:text-graydark-9 font-semibold">
          {day}
        </CalendarHeaderCell>
      )}
    </AriaCalendarGridHeader>
  );
}
