import { FieldDescription, FieldError, Label } from "@/components/common";
import { composeTailwindRenderProps, focusRing } from "@/components/utils";
import { Check, Minus } from "lucide-react";
import type { ReactNode } from "react";
import {
  Checkbox as AriaCheckbox,
  CheckboxGroup as AriaCheckboxGroup,
  type CheckboxGroupProps as AriaCheckboxGroupProps,
  type CheckboxProps as AriaCheckboxProps,
  type ValidationResult,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

export interface CheckboxGroupProps
  extends Omit<AriaCheckboxGroupProps, "children"> {
  label?: string;
  children?: ReactNode;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  size?: "medium" | "large";
}

export function CheckboxGroup({
  label,
  children,
  description,
  errorMessage,
  size,
  ...props
}: CheckboxGroupProps) {
  return (
    <AriaCheckboxGroup
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "flex flex-col gap-2",
      )}
    >
      <Label size={size}>{label}</Label>
      {children}
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError>{errorMessage}</FieldError>
    </AriaCheckboxGroup>
  );
}

const checkboxStyles = tv({
  base: "flex items-center group transition",
  variants: {
    isDisabled: {
      false: "text-normal cursor-pointer",
      true: "opacity-50 forced-colors:text-[GrayText] cursor-default",
    },
    size: {
      medium: "gap-2",
      large: "gap-3",
    },
    card: {
      true: "border border-dim rounded-lg p-3 pr-4 cursor-pointer hover:bg-theme-a2 selected:bg-primary-a3 selected:border-primary-6",
      false: "w-max",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

const boxStyles = tv({
  extend: focusRing,
  base: "size-6 shrink-0 rounded-sm flex items-center justify-center border transition",
  variants: {
    isSelected: {
      false: "bg-element border-dim",
      true: "bg-primary-9 border-transparent",
    },
    isInvalid: {
      true: "text-red-9",
    },
    isDisabled: {
      true: "text-theme-7",
    },
    size: {
      medium: "size-5",
      large: "size-7",
    },
  },
});

const iconStyles = tv({
  base: "text-white group-disabled:text-theme-4",
  variants: {
    size: {
      medium: "size-4",
      large: "size-5 stroke-[2.5px]",
    },
  },
});

export interface CheckboxProps extends AriaCheckboxProps {
  label?: string;
  description?: string;
  size?: "medium" | "large";
  errorMessage?: string | ((validation: ValidationResult) => string);
  card?: boolean;
}

export function Checkbox({
  label,
  description,
  size,
  card,
  errorMessage,
  className,
  ...props
}: CheckboxProps) {
  return (
    <div>
      <AriaCheckbox
        {...props}
        className={composeRenderProps(className, (className, renderProps) =>
          checkboxStyles({ ...renderProps, size, card, className }),
        )}
      >
        {({
          isFocusVisible,
          isSelected,
          isIndeterminate,
          isDisabled,
          isInvalid,
          defaultChildren,
        }) => (
          <>
            <div
              className={boxStyles({
                isFocusVisible,
                isSelected: isSelected || isIndeterminate,
                size,
                isDisabled,
                isInvalid,
              })}
            >
              {isIndeterminate ? (
                <Minus aria-hidden className={iconStyles({ size })} />
              ) : isSelected ? (
                <Check aria-hidden className={iconStyles({ size })} />
              ) : null}
            </div>
            {label}
            {defaultChildren}
          </>
        )}
      </AriaCheckbox>
      {description && (
        <FieldDescription className="ml-8">{description}</FieldDescription>
      )}
      <FieldError>{errorMessage}</FieldError>
    </div>
  );
}
