import {
  Button,
  DropdownItem,
  DropdownSection,
  type DropdownSectionProps,
  FieldDescription,
  FieldError,
  Label,
  Popover,
} from "@/components/common";
import { composeTailwindRenderProps } from "@/components/utils";
import { ChevronDown } from "lucide-react";
import type React from "react";
import {
  Select as AriaSelect,
  type SelectProps as AriaSelectProps,
  ListBox,
  type ListBoxItemProps,
  SelectValue,
  type ValidationResult,
} from "react-aria-components";

export interface SelectProps<T extends object>
  extends Omit<AriaSelectProps<T>, "children"> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  items?: Iterable<T>;
  size?: "medium" | "large";
  children: React.ReactNode | ((item: T) => React.ReactNode);
}

export function Select<T extends object>({
  label,
  description,
  errorMessage,
  children,
  items,
  size = "medium",
  ...props
}: SelectProps<T>) {
  return (
    <AriaSelect
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "group flex flex-col gap-1.5",
      )}
    >
      {label && <Label size={size}>{label}</Label>}
      <Button
        className="text-left"
        size={size}
        endIcon={ChevronDown}
        endIconProps={{
          className:
            "size-4 text-gray-dim forced-colors:text-[ButtonText] group-disabled:opacity-50 forced-colors:group-disabled:text-[GrayText] shrink-0",
        }}
      >
        <SelectValue className="flex-1 text-gray-normal placeholder-shown:font-normal placeholder-shown:text-gray-9" />
      </Button>
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError>{errorMessage}</FieldError>
      <Popover title="Select an option" className="min-w-(--trigger-width)">
        <ListBox
          items={items}
          className="outline-hidden p-1 max-h-[inherit] overflow-auto [clip-path:inset(0_0_0_0_round_.75rem)]"
        >
          {children}
        </ListBox>
      </Popover>
    </AriaSelect>
  );
}

export interface SelectItemProps extends ListBoxItemProps {
  description?: string;
  children: React.ReactNode;
}

export function SelectItem(props: SelectItemProps) {
  return <DropdownItem {...props} />;
}

export function SelectSection<T extends object>(
  props: DropdownSectionProps<T>,
) {
  return <DropdownSection {...props} />;
}
