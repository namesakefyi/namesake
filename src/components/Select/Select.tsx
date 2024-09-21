import { ChevronDown } from "lucide-react";
import type React from "react";
import {
  Select as AriaSelect,
  type SelectProps as AriaSelectProps,
  Button,
  ListBox,
  type ListBoxItemProps,
  SelectValue,
  type ValidationResult,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { FieldDescription, FieldError, Label } from "../Field";
import {
  DropdownItem,
  DropdownSection,
  type DropdownSectionProps,
} from "../ListBox";
import { Popover } from "../Popover";
import { composeTailwindRenderProps, focusRing } from "../utils";

const styles = tv({
  extend: focusRing,
  base: "flex items-center text-start gap-4 w-full cursor-default border border-black/10 dark:border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] dark:shadow-none rounded-lg pl-3 pr-2 py-2 min-w-[150px] transition bg-gray-ui",
  variants: {
    isDisabled: {
      false:
        "hover:bg-gray-1 pressed:bg-gray-2 dark:hover:bg-graydark-1 dark:pressed:bg-graydark-2 group-invalid:border-red- forced-colors:group-invalid:border-[Mark]",
      true: "opacity-50 forced-colors:text-[GrayText] forced-colors:border-[GrayText]",
    },
  },
});

export interface SelectProps<T extends object>
  extends Omit<AriaSelectProps<T>, "children"> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  items?: Iterable<T>;
  children: React.ReactNode | ((item: T) => React.ReactNode);
}

export function Select<T extends object>({
  label,
  description,
  errorMessage,
  children,
  items,
  ...props
}: SelectProps<T>) {
  return (
    <AriaSelect
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "group flex flex-col gap-2",
      )}
    >
      {label && <Label>{label}</Label>}
      <Button className={styles}>
        <SelectValue className="flex-1 placeholder-shown:italic" />
        <ChevronDown
          aria-hidden
          className="w-4 h-4 text-gray-dim forced-colors:text-[ButtonText] group-disabled:opacity-50 forced-colors:group-disabled:text-[GrayText]"
        />
      </Button>
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError>{errorMessage}</FieldError>
      <Popover className="min-w-[--trigger-width]">
        <ListBox
          items={items}
          className="outline-none p-1 max-h-[inherit] overflow-auto [clip-path:inset(0_0_0_0_round_.75rem)]"
        >
          {children}
        </ListBox>
      </Popover>
    </AriaSelect>
  );
}

export function SelectItem(props: ListBoxItemProps) {
  return <DropdownItem {...props} />;
}

export function SelectSection<T extends object>(
  props: DropdownSectionProps<T>,
) {
  return <DropdownSection {...props} />;
}
