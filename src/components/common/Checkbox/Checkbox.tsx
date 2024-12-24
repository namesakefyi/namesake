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
import { FieldDescription, FieldError, Label } from "../Field";

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
      false: "text-gray-normal cursor-pointer",
      true: "opacity-50 forced-colors:text-[GrayText] cursor-default",
    },
    size: {
      medium: "gap-2",
      large: "gap-3",
    },
    card: {
      true: "w-full border border-gray-dim rounded-lg p-3 cursor-pointer hover:bg-graya-2 dark:hover:bg-graydarka-2 selected:bg-purplea-3 dark:selected:bg-purpledarka-3 selected:border-purple-dim",
      false: "w-max",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

const boxStyles = tv({
  extend: focusRing,
  base: "size-6 flex-shrink-0 rounded flex items-center justify-center border transition",
  variants: {
    isSelected: {
      false: "bg-white dark:bg-graydark-1 border-gray-dim",
      true: "bg-purple-9 dark:bg-purpledark-9 border-transparent",
    },
    isInvalid: {
      true: "text-red-9 dark:text-reddark-9",
    },
    isDisabled: {
      true: "text-gray-7 dark:text-graydark-7",
    },
    size: {
      medium: "size-5",
      large: "size-7",
    },
  },
});

const iconStyles = tv({
  base: "text-white group-disabled:text-gray-4 dark:group-disabled:text-gray-9",
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
  card?: boolean;
}

export function Checkbox({
  label,
  description,
  size,
  card,
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
        {({ isSelected, isIndeterminate, ...renderProps }) => (
          <>
            <div
              className={boxStyles({
                isSelected: isSelected || isIndeterminate,
                size,
                ...renderProps,
              })}
            >
              {isIndeterminate ? (
                <Minus aria-hidden className={iconStyles({ size })} />
              ) : isSelected ? (
                <Check aria-hidden className={iconStyles({ size })} />
              ) : null}
            </div>
            {label}
            {renderProps.defaultChildren}
          </>
        )}
      </AriaCheckbox>
      {description && (
        <FieldDescription className="ml-8">{description}</FieldDescription>
      )}
    </div>
  );
}
