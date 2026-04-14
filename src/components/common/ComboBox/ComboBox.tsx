import { RiArrowDownSLine } from "@remixicon/react";
import {
  ComboBox as AriaComboBox,
  type ComboBoxProps as AriaComboBoxProps,
  Input,
  type InputProps,
  type ListBoxItemProps,
  type ValidationResult,
} from "react-aria-components";
import { Text } from "../Content";
import { FieldButton, FieldError, Label } from "../Form";
import { ListBox, ListBoxItem } from "../ListBox";
import { Popover } from "../Popover";
import "./ComboBox.css";
import clsx from "clsx";

export interface ComboBoxProps<T extends object>
  extends Omit<AriaComboBoxProps<T>, "children"> {
  label?: string;
  description?: string | null;
  placeholder?: string;
  autoComplete?: InputProps["autoComplete"];
  errorMessage?: string | ((validation: ValidationResult) => string);
  children: React.ReactNode | ((item: T) => React.ReactNode);
}

export function ComboBox<T extends object>({
  label,
  description,
  placeholder,
  errorMessage,
  autoComplete,
  children,
  className,
  name,
  ...props
}: ComboBoxProps<T>) {
  return (
    <AriaComboBox
      className={clsx("namesake-combobox", className)}
      name={name}
      {...props}
    >
      {({ isInvalid, isRequired }) => (
        <>
          <Label>{label}</Label>
          <div className="namesake-combobox-container">
            <Input
              placeholder={placeholder}
              autoComplete={autoComplete}
              required={isRequired}
              name={name}
            />
            <FieldButton>
              <RiArrowDownSLine size={20} />
            </FieldButton>
          </div>
          {description && !isInvalid && (
            <Text slot="description">{description}</Text>
          )}
          <FieldError>{errorMessage}</FieldError>
          <Popover hideArrow>
            <ListBox>{children}</ListBox>
          </Popover>
        </>
      )}
    </AriaComboBox>
  );
}

export function ComboBoxItem(props: ListBoxItemProps) {
  return <ListBoxItem {...props} />;
}
