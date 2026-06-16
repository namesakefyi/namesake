import { RiArrowRightSLine } from "@remixicon/react";
import {
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  MenuSection as AriaMenuSection,
  MenuTrigger as AriaMenuTrigger,
  SubmenuTrigger as AriaSubmenuTrigger,
  type MenuItemProps,
  type MenuProps,
  type MenuSectionProps,
  type MenuTriggerProps,
  type SubmenuTriggerProps,
} from "react-aria-components";
import { Button } from "../Button";
import { Popover } from "../Popover";

import "./Menu.css";
import React from "react";

export interface MenuButtonProps<T extends object>
  extends MenuProps<T>,
    Omit<MenuTriggerProps, "children"> {
  label?: string;
}

export function MenuButton<T extends object>({
  label,
  children,
  ...props
}: MenuButtonProps<T>) {
  return (
    <MenuTrigger {...props}>
      <Button>{label}</Button>
      <Popover hideArrow>
        <Menu {...props}>{children}</Menu>
      </Popover>
    </MenuTrigger>
  );
}

export function MenuTrigger(props: MenuTriggerProps) {
  return <AriaMenuTrigger {...props} />;
}

export function Menu<T extends object>(props: MenuProps<T>) {
  return <AriaMenu {...props}>{props.children}</AriaMenu>;
}

export function MenuItem(
  props: Omit<MenuItemProps, "children"> & { children?: React.ReactNode },
) {
  const textValue =
    props.textValue ||
    (typeof props.children === "string" ? props.children : undefined);
  return (
    <AriaMenuItem {...props} textValue={textValue}>
      {({ hasSubmenu }) => (
        <>
          {props.children}
          {hasSubmenu && <RiArrowRightSLine size={18} />}
        </>
      )}
    </AriaMenuItem>
  );
}

export function MenuSection<T extends object>(props: MenuSectionProps<T>) {
  return <AriaMenuSection {...props} />;
}

export function SubmenuTrigger(props: SubmenuTriggerProps) {
  const [trigger, menu] = React.Children.toArray(props.children) as [
    React.ReactElement,
    React.ReactElement,
  ];
  return (
    <AriaSubmenuTrigger {...props}>
      {trigger}
      <Popover hideArrow>{menu}</Popover>
    </AriaSubmenuTrigger>
  );
}
