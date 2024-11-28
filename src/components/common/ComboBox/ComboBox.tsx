import { composeTailwindRenderProps } from "@/components/utils";
import { ChevronDown } from "lucide-react";
import type React from "react";
import {
  ComboBox as AriaComboBox,
  type ComboBoxProps as AriaComboBoxProps,
  ListBox,
  type ListBoxItemProps,
  type ValidationResult,
} from "react-aria-components";
import { Button } from "../Button";
import {
  FieldDescription,
  FieldError,
  FieldGroup,
  Input,
  Label,
} from "../Field";
import {
  DropdownItem,
  DropdownSection,
  type DropdownSectionProps,
} from "../ListBox";
import { Popover } from "../Popover";

export interface ComboBoxProps<T extends object>
  extends Omit<AriaComboBoxProps<T>, "children"> {
  label?: string;
  description?: string | null;
  errorMessage?: string | ((validation: ValidationResult) => string);
  children: React.ReactNode | ((item: T) => React.ReactNode);
}

export function ComboBox<T extends object>({
  label,
  description,
  errorMessage,
  children,
  items,
  ...props
}: ComboBoxProps<T>) {
  return (
    <AriaComboBox
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "group flex flex-col gap-1",
      )}
    >
      <Label>{label}</Label>
      <FieldGroup>
        <Input />
        <Button variant="icon" className="w-7 h-7 p-0 mr-1 outline-offset-0">
          <ChevronDown aria-hidden className="w-4 h-4" />
        </Button>
      </FieldGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError>{errorMessage}</FieldError>
      <Popover className="w-[--trigger-width]">
        <ListBox
          items={items}
          className="outline-0 p-1 max-h-[inherit] overflow-auto [clip-path:inset(0_0_0_0_round_.75rem)]"
        >
          {children}
        </ListBox>
      </Popover>
    </AriaComboBox>
  );
}

export function ComboBoxItem(props: ListBoxItemProps) {
  return <DropdownItem {...props} />;
}

export function ComboBoxSection<T extends object>(
  props: DropdownSectionProps<T>,
) {
  return <DropdownSection {...props} />;
}
