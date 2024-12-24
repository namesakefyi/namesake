import { composeTailwindRenderProps, focusRing } from "@/components/utils";
import type { ReactNode } from "react";
import {
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  type RadioGroupProps as AriaRadioGroupProps,
  type RadioProps as AriaRadioProps,
  type ValidationResult,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { FieldDescription, FieldError, Label } from "../Field";

export interface RadioGroupProps extends Omit<AriaRadioGroupProps, "children"> {
  label?: string;
  children?: ReactNode;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  size?: "medium" | "large";
}

export function RadioGroup({
  className,
  label,
  children,
  description,
  errorMessage,
  size,
  ...props
}: RadioGroupProps) {
  return (
    <AriaRadioGroup
      {...props}
      className={composeTailwindRenderProps(
        className,
        "group flex flex-col gap-2",
      )}
    >
      <Label size={size}>{label}</Label>
      <div className="flex group-orientation-vertical:flex-col gap-2 group-orientation-horizontal:gap-4">
        {children}
      </div>
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError>{errorMessage}</FieldError>
    </AriaRadioGroup>
  );
}

const radioItemStyles = tv({
  base: "flex items-center group text-gray-normal disabled:opacity-50 forced-colors:disabled:text-[GrayText] transition",
  variants: {
    size: {
      medium: "gap-2",
      large: "gap-3",
    },
    card: {
      true: "border border-gray-dim rounded-lg p-3 cursor-pointer hover:bg-graya-2 dark:hover:bg-graydarka-2 selected:bg-purplea-3 dark:selected:bg-purpledarka-3 selected:border-purple-dim",
    },
  },
});

const radioStyles = tv({
  extend: focusRing,
  base: "rounded-full border bg-white dark:bg-graydark-1 transition-all cursor-pointer",
  variants: {
    isSelected: {
      false: "border-gray-dim",
      true: "border-[7px] dark:bg-white border-purple-9 dark:border-purpledark-9 forced-colors:!border-[Highlight] group-pressed:border-purple-10 dark:group-pressed:border-purpledark-10",
    },
    isInvalid: {
      true: "border-red-9 dark:border-reddark-9 group-pressed:border-red-11 dark:group-pressed:border-reddark-11 forced-colors:!border-[Mark]",
    },
    isDisabled: {
      true: "border-gray-2 dark:border-gray-8 cursor-default forced-colors:!border-[GrayText]",
    },
    size: {
      medium: "size-5",
      large: "size-7",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export interface RadioProps extends AriaRadioProps {
  size?: "medium" | "large";
  card?: boolean;
}

export function Radio({
  className,
  size = "medium",
  card = false,
  ...props
}: RadioProps) {
  return (
    <AriaRadio
      {...props}
      className={composeTailwindRenderProps(
        className,
        radioItemStyles({ size, card }),
      )}
    >
      {(renderProps) => (
        <>
          <div className={radioStyles({ ...renderProps, size })} />
          {/* Types workaround: https://github.com/adobe/react-spectrum/issues/7434 */}
          {typeof props.children === "function"
            ? props.children(renderProps)
            : props.children}
        </>
      )}
    </AriaRadio>
  );
}
