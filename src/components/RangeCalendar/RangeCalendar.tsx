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
  base: "w-full h-full flex items-center justify-center rounded-full cursor-pointer forced-color-adjust-none text-gray-normal",
  variants: {
    selectionState: {
      none: "group-hover:bg-gray-3 dark:group-hover:bg-graydark-3 group-pressed:bg-gray-2 dark:group-pressed:bg-gray-6",
      middle: [
        "group-hover:bg-purple-4 dark:group-hover:bg-purpledark-4 forced-colors:group-hover:bg-[Highlight]",
        "group-invalid:group-hover:bg-red-4 dark:group-invalid:group-hover:bg-reddark-4 forced-colors:group-invalid:group-hover:bg-[Mark]",
      ],
      cap: "bg-purple-9 dark:bg-purpledark-9 group-invalid:bg-red-9 dark:group-invalid:bg-reddark-9 forced-colors:bg-[Highlight] forced-colors:group-invalid:bg-[Mark] text-white forced-colors:text-[HighlightText]",
    },
    isDisabled: {
      true: "text-gray-dim opacity-50 forced-colors:text-[GrayText] cursor-default",
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
              className="group w-9 h-9 text-sm outline outline-0 cursor-default outside-month:text-gray-10 dark:outside-month:text-graydark-9 selected:bg-purple-3 selected:text-purple-12 dark:selected:bg-purpledark-3 dark:selected:text-purpledark-12 forced-colors:selected:bg-[Highlight] invalid:selected:bg-red-3 dark:invalid:selected:bg-reddark-3 forced-colors:invalid:selected:bg-[Mark] [td:first-child_&]:rounded-s-full selection-start:rounded-s-full [td:last-child_&]:rounded-e-full selection-end:rounded-e-full"
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
