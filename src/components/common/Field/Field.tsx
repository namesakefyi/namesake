import { composeTailwindRenderProps, focusRing } from "@/components/utils";
import {
  FieldError as AriaFieldError,
  type GroupProps as AriaGroupProps,
  Input as AriaInput,
  type InputProps as AriaInputProps,
  Label as AriaLabel,
  type LabelProps as AriaLabelProps,
  TextArea as AriaTextArea,
  type FieldErrorProps,
  Group,
  Text,
  type TextAreaProps,
  type TextProps,
  composeRenderProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

interface LabelProps extends AriaLabelProps {
  size?: "medium" | "large";
}

const labelStyles = tv({
  base: "text-sm text-gray-dim cursor-default w-fit",
  variants: {
    size: {
      medium: "text-sm",
      large: "text-base",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export function Label({ size, ...props }: LabelProps) {
  return (
    <AriaLabel
      {...props}
      className={labelStyles({ size, className: props.className })}
    />
  );
}

export function FieldDescription(props: TextProps) {
  return (
    <Text
      {...props}
      slot="description"
      className={twMerge("text-sm text-gray-dim", props.className)}
    />
  );
}

export function FieldError(props: FieldErrorProps) {
  return (
    <AriaFieldError
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "text-sm text-red-9 dark:text-reddark-9 forced-colors:text-[Mark]",
      )}
    />
  );
}

export const fieldBorderStyles = tv({
  variants: {
    isFocusWithin: {
      false: "border-black/10 dark:border-white/10",
      true: "border-black/15 dark:border-white/15",
    },
    isInvalid: {
      true: "border-red-normal bg-red-subtle forced-colors:border-[Mark]",
    },
    isDisabled: {
      true: "border-gray-dim forced-colors:border-[GrayText]",
    },
  },
});

export const fieldGroupStyles = tv({
  extend: focusRing,
  base: "group flex items-center bg-gray-subtle forced-colors:bg-[Field] border rounded-lg overflow-hidden",
  variants: {
    ...fieldBorderStyles.variants,
    size: {
      medium: "h-10",
      large: "h-12",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

interface GroupProps extends AriaGroupProps {
  size?: "medium" | "large";
}

export function FieldGroup({ size, ...props }: GroupProps) {
  return (
    <Group
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        fieldGroupStyles({ ...renderProps, size, className }),
      )}
    />
  );
}

interface InputProps extends Omit<AriaInputProps, "size"> {
  size?: "medium" | "large";
}

export const inputStyles = tv({
  base: "flex-1 min-w-0 outline outline-0 bg-transparent text-gray-normal disabled:text-gray-dim",
  variants: {
    size: {
      medium: "px-3 h-10",
      large: "px-3.5 h-12 text-lg",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export function Input({ size, ...props }: InputProps) {
  return (
    <AriaInput
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        inputStyles({ ...renderProps, size, className }),
      )}
    />
  );
}

export function InputTextArea(props: TextAreaProps) {
  return (
    <AriaTextArea
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        inputStyles({ ...renderProps, className }),
      )}
    />
  );
}
