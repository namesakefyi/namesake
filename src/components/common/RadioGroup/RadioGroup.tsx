import { FieldDescription, FieldError, Label } from "@/components/common";
import { composeTailwindRenderProps, focusRing } from "@/components/utils";
import type { ReactNode, Ref } from "react";
import {
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  type RadioGroupProps as AriaRadioGroupProps,
  type RadioProps as AriaRadioProps,
  type ValidationResult,
} from "react-aria-components";
import { tv } from "tailwind-variants";

export interface RadioGroupProps extends Omit<AriaRadioGroupProps, "children"> {
  label?: string;
  children?: ReactNode;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  size?: "medium" | "large";
  ref?: Ref<HTMLDivElement>;
}

export function RadioGroup({
  ref,
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
      ref={ref}
      className={composeTailwindRenderProps(
        className,
        "group flex flex-col gap-2",
      )}
    >
      <Label size={size}>{label}</Label>
      <div className="flex flex-col gap-2 group-orientation-horizontal:gap-4 group-orientation-horizontal:flex-wrap">
        {children}
      </div>
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError>{errorMessage}</FieldError>
    </AriaRadioGroup>
  );
}

const radioItemStyles = tv({
  extend: focusRing,
  base: "flex shrink-0 items-center group text-normal disabled:opacity-50 forced-colors:disabled:text-[GrayText] transition",
  variants: {
    size: {
      medium: "gap-2",
      large: "gap-3",
    },
    card: {
      true: "border border-dim rounded-lg p-3 pr-4 cursor-pointer hover:bg-theme-a2 selected:bg-theme-a3 selected:border-theme-6",
    },
  },
});

const radioStyles = tv({
  extend: focusRing,
  base: "rounded-full border bg-app transition-all ease-out duration-150 cursor-pointer shrink-0",
  variants: {
    isSelected: {
      false: "border-dim",
      true: "bg-white border-[6px] border-theme-9 forced-colors:border-[Highlight]",
    },
    isInvalid: {
      true: "border-red-9 forced-colors:border-[Mark]!",
    },
    isDisabled: {
      true: "border-dim cursor-default forced-colors:border-[GrayText]!",
    },
    size: {
      medium: "size-5",
      large: "size-7",
    },
  },
  defaultVariants: {
    size: "medium",
  },
  compoundVariants: [
    {
      isSelected: true,
      size: "large",
      className: "border-[7px]",
    },
  ],
});

export interface RadioProps extends AriaRadioProps {
  size?: "medium" | "large";
  card?: boolean;
  ref?: Ref<HTMLLabelElement>;
}

export function Radio({
  ref,
  size = "medium",
  card = false,
  className,
  ...props
}: RadioProps) {
  return (
    <AriaRadio
      {...props}
      ref={ref}
      className={composeTailwindRenderProps(
        className,
        radioItemStyles({ size, card }),
      )}
    >
      {({ isSelected, isInvalid, isDisabled, ...renderProps }) => (
        <>
          <div
            className={radioStyles({ isSelected, isInvalid, isDisabled, size })}
          />
          {/* Types workaround: https://github.com/adobe/react-spectrum/issues/7434 */}
          {typeof props.children === "function"
            ? props.children({
                isSelected,
                isInvalid,
                isDisabled,
                ...renderProps,
              })
            : props.children}
        </>
      )}
    </AriaRadio>
  );
}
