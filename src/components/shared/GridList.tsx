import {
  GridList as AriaGridList,
  GridListItem as AriaGridListItem,
  Button,
  type GridListItemProps,
  type GridListProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { composeTailwindRenderProps, focusRing } from "../utils";
import { Checkbox } from "./Checkbox";

export function GridList<T extends object>({
  children,
  ...props
}: GridListProps<T>) {
  return (
    <AriaGridList
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "overflow-auto relative border border-gray-dim rounded-lg",
      )}
    >
      {children}
    </AriaGridList>
  );
}

const itemStyles = tv({
  extend: focusRing,
  base: "relative flex items-center gap-3 cursor-default select-none py-2 px-3 text-sm border-y border-y-gray-6 dark:border-y-graydark-6 first:border-t-0 last:border-b-0 first:rounded-t-md last:rounded-b-md -mb-px last:mb-0 -outline-offset-2",
  variants: {
    isSelected: {
      false: "hover:bg-gray-3 dark:hover:bg-graydark-3",
      true: "bg-blue-1 dark:bg-blue-10/30 hover:bg-blue-2 dark:hover:bg-blue-10/40 border-y-blue-2 dark:border-y-blue-12 z-20",
    },
    isDisabled: {
      true: "opacity-50 forced-colors:text-[GrayText] z-10",
    },
  },
});

export function GridListItem({ children, ...props }: GridListItemProps) {
  const textValue = typeof children === "string" ? children : undefined;
  return (
    <AriaGridListItem textValue={textValue} {...props} className={itemStyles}>
      {({ selectionMode, selectionBehavior, allowsDragging }) => (
        <>
          {/* Add elements for drag and drop and selection. */}
          {allowsDragging && <Button slot="drag">≡</Button>}
          {selectionMode === "multiple" && selectionBehavior === "toggle" && (
            <Checkbox slot="selection" />
          )}
          {children}
        </>
      )}
    </AriaGridListItem>
  );
}
