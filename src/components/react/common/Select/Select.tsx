import { RiArrowDownSLine } from "@remixicon/react";
import {
  Select as AriaSelect,
  type SelectProps as AriaSelectProps,
  type ListBoxItemProps,
  SelectValue,
  type ValidationResult,
} from "react-aria-components";
import { Button } from "../Button";
import { Text } from "../Content";
import { FieldError, Label } from "../Form";
import { ListBox, ListBoxItem } from "../ListBox";
import { Popover } from "../Popover";
import "./Select.css";

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
    <AriaSelect {...props}>
      <Label>{label}</Label>
      <Button>
        <SelectValue />
        <span aria-hidden="true">
          <RiArrowDownSLine size={16} />
        </span>
      </Button>
      {description && <Text slot="description">{description}</Text>}
      <FieldError>{errorMessage}</FieldError>
      <Popover hideArrow>
        <ListBox items={items}>{children}</ListBox>
      </Popover>
    </AriaSelect>
  );
}

export function SelectItem(props: ListBoxItemProps) {
  return <ListBoxItem {...props} />;
}
