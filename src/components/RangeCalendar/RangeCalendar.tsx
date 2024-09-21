import {
  RangeCalendar as AriaRangeCalendar,
  type RangeCalendarProps as AriaRangeCalendarProps,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  type DateValue,
  Text,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { CalendarGridHeader, CalendarHeader } from "../Calendar";
import { focusRing } from "../utils";

export interface RangeCalendarProps<T extends DateValue>
  extends Omit<AriaRangeCalendarProps<T>, "visibleDuration"> {
  errorMessage?: string;
}

const cell = tv({
  extend: focusRing,
  base: "w-full h-full flex items-center justify-center rounded-full forced-color-adjust-none text-gray-12 dark:text-gray-2",
  variants: {
    selectionState: {
      none: "group-hover:bg-gray-1 dark:group-hover:bg-gray-8 group-pressed:bg-gray-2 dark:group-pressed:bg-gray-6",
      middle: [
        "group-hover:bg-blue-2 dark:group-hover:bg-blue-12 forced-colors:group-hover:bg-[Highlight]",
        "group-invalid:group-hover:bg-red-2 dark:group-invalid:group-hover:bg-red-12 forced-colors:group-invalid:group-hover:bg-[Mark]",
        "group-pressed:bg-blue-3 dark:group-pressed:bg-blue-11 forced-colors:group-pressed:bg-[Highlight] forced-colors:text-[HighlightText]",
        "group-invalid:group-pressed:bg-red-3 dark:group-invalid:group-pressed:bg-red-11 forced-colors:group-invalid:group-pressed:bg-[Mark]",
      ],
      cap: "bg-blue-9 group-invalid:bg-red-9 forced-colors:bg-[Highlight] forced-colors:group-invalid:bg-[Mark] text-white forced-colors:text-[HighlightText]",
    },
    isDisabled: {
      true: "text-gray-3 dark:text-gray-6 forced-colors:text-[GrayText]",
    },
  },
});

export function RangeCalendar<T extends DateValue>({
  errorMessage,
  ...props
}: RangeCalendarProps<T>) {
  return (
    <AriaRangeCalendar {...props}>
      <CalendarHeader />
      <CalendarGrid className="[&_td]:px-0">
        <CalendarGridHeader />
        <CalendarGridBody>
          {(date) => (
            <CalendarCell
              date={date}
              className="group w-9 h-9 text-sm outline outline-0 cursor-default outside-month:text-gray-3 selected:bg-blue-1 dark:selected:bg-blue-10/30 forced-colors:selected:bg-[Highlight] invalid:selected:bg-red-1 dark:invalid:selected:bg-red-10/30 forced-colors:invalid:selected:bg-[Mark] [td:first-child_&]:rounded-s-full selection-start:rounded-s-full [td:last-child_&]:rounded-e-full selection-end:rounded-e-full"
            >
              {({
                formattedDate,
                isSelected,
                isSelectionStart,
                isSelectionEnd,
                isFocusVisible,
                isDisabled,
              }) => (
                <span
                  className={cell({
                    selectionState:
                      isSelected && (isSelectionStart || isSelectionEnd)
                        ? "cap"
                        : isSelected
                          ? "middle"
                          : "none",
                    isDisabled,
                    isFocusVisible,
                  })}
                >
                  {formattedDate}
                </span>
              )}
            </CalendarCell>
          )}
        </CalendarGridBody>
      </CalendarGrid>
      {errorMessage && (
        <Text slot="errorMessage" className="text-sm text-red-9">
          {errorMessage}
        </Text>
      )}
    </AriaRangeCalendar>
  );
}
