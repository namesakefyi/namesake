import { composeTailwindRenderProps, focusRing } from "@/components/utils";
import {
  FieldError as AriaFieldError,
  type GroupProps as AriaGroupProps,
  Input as AriaInput,
  type InputProps as AriaInputProps,
  Label as AriaLabel,
  type LabelProps as AriaLabelProps,
  TextArea as AriaTextArea,
  type TextAreaProps as AriaTextAreaProps,
  type FieldErrorProps,
  Group,
  Text,
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
      false: "ring-gray-6 dark:ring-graydark-6",
      true: "ring-gray-7 dark:ring-graydark-7",
    },
    isInvalid: {
      true: "ring-red-9 dark:ring-reddark-9",
    },
    isDisabled: {
      true: "ring-gray-4 dark:ring-graydark-4",
    },
  },
});

const fieldGroupStyles = tv({
  extend: focusRing,
  base: "border-none ring-inset ring-1 group flex items-center bg-gray-subtle forced-colors:bg-[Field] rounded-lg overflow-hidden",
  variants: {
    ...fieldBorderStyles.variants,
    size: {
      medium: "min-h-10",
      large: "min-h-12 text-lg",
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

export const inputTextAreaStyles = tv({
  base: "flex-1 min-w-0 leading-snug outline outline-0 bg-transparent text-gray-normal disabled:text-gray-dim",
  variants: {
    size: {
      medium: "px-3 py-2",
      large: "px-3.5 py-2.5 text-lg leading-snug",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

interface InputTextAreaProps extends Omit<AriaTextAreaProps, "size"> {
  size?: "medium" | "large";
}

export function InputTextArea({ size, ...props }: InputTextAreaProps) {
  return (
    <AriaTextArea
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        inputTextAreaStyles({ ...renderProps, size, className }),
      )}
    />
  );
}
