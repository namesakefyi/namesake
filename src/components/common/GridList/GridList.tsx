import { Checkbox } from "@/components/common";
import { composeTailwindRenderProps, focusRing } from "@/components/utils";
import {
  GridList as AriaGridList,
  GridListItem as AriaGridListItem,
  type GridListItemProps as AriaGridListItemProps,
  Button,
  type GridListProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

export function GridList<T extends object>({
  children,
  className,
  ...props
}: GridListProps<T>) {
  return (
    <AriaGridList
      {...props}
      className={composeTailwindRenderProps(
        className,
        "relative border border-gray-dim rounded-lg p-1",
      )}
    >
      {children}
    </AriaGridList>
  );
}

const itemStyles = tv({
  extend: focusRing,
  base: "group relative text-gray-normal flex items-center gap-3 select-none py-1 px-3 text-sm -outline-offset-2 rounded-md peer",
  variants: {
    isSelected: {
      false: "hover:bg-gray-a2",
      true: "bg-purple-9 text-white z-20 [&:has(+[data-selected])]:rounded-b-none [&+[data-selected]]:rounded-t-none",
    },
    isDisabled: {
      false: "cursor-pointer",
      true: "text-slate-300 dark:text-zinc-600 forced-colors:text-[GrayText] z-10",
    },
  },
});

interface GridListItemProps extends AriaGridListItemProps {
  children: React.ReactNode;
  className?: string;
}

export function GridListItem({
  children,
  className,
  ...props
}: GridListItemProps) {
  const textValue = typeof children === "string" ? children : undefined;
  return (
    <AriaGridListItem
      textValue={textValue}
      {...props}
      className={({ isFocusVisible, isSelected, isDisabled }) =>
        itemStyles({ isFocusVisible, isSelected, isDisabled, className })
      }
    >
      {({ selectionMode, selectionBehavior, allowsDragging }) => (
        <>
          {/* Add elements for drag and drop and selection. */}
          {allowsDragging && <Button slot="drag">≡</Button>}
          {selectionMode === "multiple" && selectionBehavior === "toggle" && (
            <Checkbox slot="selection" />
          )}
          {children}
          <div className="absolute left-4 right-4 bottom-0 h-px bg-white/20 forced-colors:bg-[HighlightText] hidden [.group[data-selected]:has(+[data-selected])_&]:block" />
        </>
      )}
    </AriaGridListItem>
  );
}
