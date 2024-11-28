import { composeTailwindRenderProps, focusRing } from "@/components/utils";
import {
  GridList as AriaGridList,
  GridListItem as AriaGridListItem,
  Button,
  type GridListItemProps,
  type GridListProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { Checkbox } from "../Checkbox";

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
  base: "relative text-gray-normal flex items-center gap-3 cursor-pointer select-none py-2 px-4 text-sm first:rounded-t-md last:rounded-b-md -mb-px last:mb-0 -outline-offset-2",
  variants: {
    isSelected: {
      false: "",
      true: "bg-purple-3 dark:bg-purpledark-3 z-20",
    },
    isDisabled: {
      true: "opacity-50 cursor-default forced-colors:text-[GrayText] z-10",
    },
  },
});

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
      className={composeTailwindRenderProps(className, itemStyles())}
    >
      {({
        selectionMode,
        selectionBehavior,
        allowsDragging,
        defaultChildren,
      }) => (
        <>
          {/* Add elements for drag and drop and selection. */}
          {allowsDragging && <Button slot="drag">≡</Button>}
          {selectionMode === "multiple" && selectionBehavior === "toggle" && (
            <Checkbox slot="selection" />
          )}
          {defaultChildren}
        </>
      )}
    </AriaGridListItem>
  );
}
