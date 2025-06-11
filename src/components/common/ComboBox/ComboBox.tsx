import {
  Button,
  DropdownItem,
  DropdownSection,
  type DropdownSectionProps,
  FieldDescription,
  FieldError,
  FieldGroup,
  Input,
  Label,
  Popover,
} from "@/components/common";
import { composeTailwindRenderProps } from "@/components/utils";
import { ChevronDown } from "lucide-react";
import type React from "react";
import {
  ComboBox as AriaComboBox,
  type ComboBoxProps as AriaComboBoxProps,
  type InputProps as AriaInputProps,
  ListBox,
  type ListBoxItemProps,
  type ValidationResult,
} from "react-aria-components";
import { tv } from "tailwind-variants";

export interface ComboBoxProps<T extends object>
  extends Omit<AriaComboBoxProps<T>, "children"> {
  label?: string;
  description?: string | null;
  errorMessage?: string | ((validation: ValidationResult) => string);
  children: React.ReactNode | ((item: T) => React.ReactNode);
  size?: "medium" | "large";
  autoComplete?: AriaInputProps["autoComplete"];
  placeholder?: string;
}

export function ComboBox<T extends object>({
  label,
  description,
  errorMessage,
  children,
  items,
  size = "medium",
  placeholder,
  autoComplete,
  name,
  ...props
}: ComboBoxProps<T>) {
  const buttonStyles = tv({
    base: "size-7 p-0 outline-offset-0",
    variants: {
      size: {
        medium: "mr-1",
        large: "mr-1.5",
      },
    },
  });

  return (
    <AriaComboBox
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "group flex flex-col gap-1.5",
      )}
    >
      {({ isOpen, isDisabled, isInvalid, isRequired }) => (
        <>
          {label && <Label size={size}>{label}</Label>}
          <FieldGroup size={size} isInvalid={isInvalid} isDisabled={isDisabled}>
            <Input
              placeholder={placeholder}
              size={size}
              autoComplete={autoComplete}
              name={name}
              required={isRequired}
            />
            <Button
              variant="icon"
              className={buttonStyles({ size })}
              icon={ChevronDown}
              size={size}
            />
          </FieldGroup>
          {description && <FieldDescription>{description}</FieldDescription>}
          <FieldError>{errorMessage}</FieldError>
          <Popover
            className="w-(--trigger-width)"
            placement="bottom start"
            shouldFlip={false}
            isOpen={isOpen}
          >
            <ListBox
              items={items}
              className="outline-none p-1 max-h-[inherit] overflow-auto [clip-path:inset(0_0_0_0_round_.75rem)]"
            >
              {children}
            </ListBox>
          </Popover>
        </>
      )}
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
