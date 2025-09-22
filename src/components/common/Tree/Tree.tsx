import { ChevronRight, type LucideIcon } from "lucide-react";
import type React from "react";
import {
  Tree as AriaTree,
  TreeItem as AriaTreeItem,
  TreeItemContent as AriaTreeItemContent,
  type TreeItemContentProps as AriaTreeItemContentProps,
  type TreeItemProps as AriaTreeItemProps,
  type TreeProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { Button, Checkbox } from "@/components/common";
import { composeTailwindRenderProps, focusRing } from "@/components/utils";

const itemStyles = tv({
  extend: focusRing,
  base: "relative flex group gap-3 cursor-default select-none p-2 text-sm text-normal rounded-md",
  variants: {
    isSelected: {
      false: "hover:bg-theme-a3",
      true: "bg-primary-a3 text-normal hover:bg-primary-a4 z-20 [&:has(+[data-selected])]:rounded-b-none [&+[data-selected]]:rounded-t-none",
    },
    isDisabled: {
      true: "text-dim opacity-50 cursor-default forced-colors:text-[GrayText] z-10",
    },
    isFocusVisible: {
      true: "rounded-md!",
    },
  },
});

export function Tree<T extends object>({
  children,
  title,
  ...props
}: TreeProps<T> & { title: string }) {
  return (
    <AriaTree
      aria-label={title}
      {...props}
      className={composeTailwindRenderProps(props.className, "relative")}
    >
      {children}
    </AriaTree>
  );
}

const expandButton = tv({
  extend: focusRing,
  base: "shrink-0 size-5 p-0 rounded-md cursor-default mr-1.5",
  variants: {
    isSelected: {
      true: "hover:bg-primary-a3",
    },
  },
});

const chevron = tv({
  base: "h-5 w-8 transition-all duration-200 ease-in-out",
  variants: {
    isExpanded: {
      true: "transform rotate-90",
    },
    isSelected: {
      true: "text-primary-12/30 hover:text-primary-12",
      false: "text-theme-12/30 hover:text-theme-12",
    },
    isDisabled: {
      true: "text-dim forced-colors:text-[GrayText]",
      false: "pointer-events-none forced-colors:text-[ButtonText]",
    },
  },
});

type TreeItemIcon =
  | LucideIcon // Single icon
  | [LucideIcon, LucideIcon]; // [default, expanded]

interface TreeItemContentProps
  extends Omit<AriaTreeItemContentProps, "children"> {
  icon?: TreeItemIcon;
  children?: React.ReactNode;
}

function TreeItemContent({ children, icon, ...props }: TreeItemContentProps) {
  return (
    <AriaTreeItemContent {...props}>
      {({
        isSelected,
        selectionMode,
        selectionBehavior,
        hasChildItems,
        isExpanded,
        isDisabled,
      }) => {
        const Icon = Array.isArray(icon)
          ? isExpanded
            ? icon[1]
            : icon[0]
          : icon;

        return (
          <div className="flex items-center">
            {selectionMode === "multiple" && selectionBehavior === "toggle" && (
              <Checkbox slot="selection" size="medium" className="mr-1.5" />
            )}
            <div className="shrink-0 w-[calc(calc(var(--tree-item-level)_-_1)_*_calc(var(--spacing)_*_3))]" />
            {hasChildItems ? (
              <Button
                slot="chevron"
                className={expandButton({ isSelected })}
                isDisabled={isDisabled}
                variant="ghost"
                size="small"
              >
                <ChevronRight
                  aria-hidden
                  className={chevron({ isSelected, isExpanded, isDisabled })}
                />
              </Button>
            ) : (
              <div className="shrink-0 h-5 w-6.5" />
            )}
            {Icon && (
              <Icon className="size-5 text-dim p-0.5 mr-1.5 forced-colors:text-[ButtonText]" />
            )}
            {children}
          </div>
        );
      }}
    </AriaTreeItemContent>
  );
}

interface TreeItemProps extends Partial<AriaTreeItemProps> {
  children?: React.ReactNode;
  icon?: TreeItemIcon;
  label: string;
}

export function TreeItem({ children, label, icon, ...props }: TreeItemProps) {
  return (
    <AriaTreeItem className={itemStyles} textValue={label} {...props}>
      <TreeItemContent icon={icon}>{label}</TreeItemContent>
      {children}
    </AriaTreeItem>
  );
}
