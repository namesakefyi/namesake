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
import { CalendarGridHeader, CalendarHeader } from "@/components/common";
import { focusRing } from "@/components/utils";

export interface RangeCalendarProps<T extends DateValue>
  extends Omit<AriaRangeCalendarProps<T>, "visibleDuration"> {
  errorMessage?: string;
}

const cell = tv({
  extend: focusRing,
  base: "w-full h-full flex items-center justify-center rounded-full cursor-pointer forced-color-adjust-none text-normal",
  variants: {
    selectionState: {
      none: "group-hover:bg-primary-3 group-pressed:bg-primary-2",
      middle: [
        "group-hover:bg-primary-4 forced-colors:group-hover:bg-[Highlight]",
        "group-hover:group-invalid:bg-red-4 forced-colors:group-hover:group-invalid:bg-[Mark]",
      ],
      cap: "bg-primary-9 group-invalid:bg-red-9 forced-colors:bg-[Highlight] forced-colors:group-invalid:bg-[Mark] text-white forced-colors:text-[HighlightText]",
    },
    isDisabled: {
      true: "text-dim opacity-50 forced-colors:text-[GrayText] cursor-default",
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
              className="group size-9 text-sm outline-none cursor-default outside-month:opacity-70 selected:bg-primary-3 selected:text-theme-12 forced-colors:selected:bg-[Highlight] invalid:selected:bg-red-3 forced-colors:invalid:selected:bg-[Mark] [td:first-child_&]:rounded-s-full selection-start:rounded-s-full [td:last-child_&]:rounded-e-full selection-end:rounded-e-full"
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
