import {
  Check,
  ChevronRight,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import {
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  type MenuItemProps as AriaMenuItemProps,
  type MenuProps as AriaMenuProps,
  MenuTrigger as AriaMenuTrigger,
  SubmenuTrigger as AriaSubmenuTrigger,
  type MenuTriggerProps,
  Separator,
  type SeparatorProps,
  type SubmenuTriggerProps,
  composeRenderProps,
} from "react-aria-components";
import {
  DropdownSection,
  type DropdownSectionProps,
  dropdownItemStyles,
} from "../ListBox";
import { Popover, type PopoverProps } from "../Popover";

interface MenuProps<T> extends AriaMenuProps<T> {
  placement?: PopoverProps["placement"];
}

export function MenuTrigger(props: MenuTriggerProps) {
  return <AriaMenuTrigger {...props} />;
}

export function Menu<T extends object>(props: MenuProps<T>) {
  return (
    <Popover
      title="Select an option"
      placement={props.placement}
      className="min-w-[150px]"
    >
      <AriaMenu
        {...props}
        className="p-1 outline outline-0 max-h-[inherit] overflow-auto [clip-path:inset(0_0_0_0_round_.75rem)]"
      />
    </Popover>
  );
}

interface MenuItemProps extends AriaMenuItemProps {
  icon?: LucideIcon;
}

export function MenuItem({ className, icon: Icon, ...props }: MenuItemProps) {
  return (
    <AriaMenuItem
      {...props}
      className={composeRenderProps(className, (className, renderProps) =>
        dropdownItemStyles({ ...renderProps, className }),
      )}
    >
      {composeRenderProps(
        props.children,
        (children, { selectionMode, isSelected, hasSubmenu }) => (
          <>
            {selectionMode !== "none" && (
              <span className="flex items-center w-4">
                {isSelected && <Check aria-hidden className="w-4 h-4" />}
              </span>
            )}
            {Icon && <Icon aria-hidden className="w-4 h-4" />}
            <span className="flex items-center flex-1 gap-2 font-normal truncate group-selected:font-semibold">
              {children}
            </span>
            {props.target === "_blank" && (
              <ExternalLink
                aria-hidden
                className="size-4 ml-1 text-gray-8 dark:text-graydark-8"
              />
            )}
            {hasSubmenu && (
              <ChevronRight aria-hidden className="size-4 ml-auto -mr-1" />
            )}
          </>
        ),
      )}
    </AriaMenuItem>
  );
}

export function MenuSeparator(props: SeparatorProps) {
  return (
    <Separator {...props} className="mx-3 my-1 border-b border-gray-dim" />
  );
}

export function MenuSection<T extends object>(props: DropdownSectionProps<T>) {
  return <DropdownSection {...props} />;
}

export function SubmenuTrigger(props: SubmenuTriggerProps) {
  return <AriaSubmenuTrigger {...props} />;
}
