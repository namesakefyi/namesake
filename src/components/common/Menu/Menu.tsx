import {
  Popover,
  type PopoverProps,
  dropdownItemStyles,
} from "@/components/common";
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
  MenuSection as AriaMenuSection,
  type MenuSectionProps as AriaMenuSectionProps,
  MenuTrigger as AriaMenuTrigger,
  SubmenuTrigger as AriaSubmenuTrigger,
  Collection,
  Header,
  type MenuTriggerProps,
  Separator,
  type SeparatorProps,
  type SubmenuTriggerProps,
  composeRenderProps,
} from "react-aria-components";

interface MenuProps<T> extends AriaMenuProps<T> {
  placement?: PopoverProps["placement"];
}

export function MenuTrigger(props: MenuTriggerProps) {
  return <AriaMenuTrigger {...props} />;
}

export function Menu<T extends object>(props: MenuProps<T>) {
  return (
    <Popover placement={props.placement} className="min-w-[150px]">
      <AriaMenu
        {...props}
        className="p-1 outline-none max-h-[inherit] overflow-auto [clip-path:inset(0_0_0_0_round_.75rem)]"
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
            <span className="flex items-center flex-1 gap-2 font-normal truncate">
              {children}
            </span>
            {props.target === "_blank" && (
              <ExternalLink aria-hidden className="size-4 ml-1 text-gray-8" />
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

export interface MenuSectionProps<T> extends AriaMenuSectionProps<T> {
  title?: string;
  items?: any;
}

export function MenuSection<T extends object>(props: MenuSectionProps<T>) {
  return (
    <AriaMenuSection {...props}>
      <Header className="text-sm font-semibold text-gray-dim px-4 py-1 truncate sticky -top-[5px] -mt-px -mx-1 z-10 bg-element border-b border-gray-dim [&+*]:mt-1">
        {props.title}
      </Header>
      <Collection items={props.items}>{props.children}</Collection>
    </AriaMenuSection>
  );
}

export function SubmenuTrigger(props: SubmenuTriggerProps) {
  return <AriaSubmenuTrigger {...props} />;
}
