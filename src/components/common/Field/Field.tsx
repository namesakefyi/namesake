import type { Ref } from "react";
import {
  FieldError as AriaFieldError,
  type GroupProps as AriaGroupProps,
  Input as AriaInput,
  type InputProps as AriaInputProps,
  Label as AriaLabel,
  type LabelProps as AriaLabelProps,
  TextArea as AriaTextArea,
  type TextAreaProps as AriaTextAreaProps,
  composeRenderProps,
  type FieldErrorProps,
  Group,
  Text,
  type TextProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";
import { composeTailwindRenderProps, focusRing } from "@/components/utils";

export type FieldSize = "small" | "medium" | "large";

interface LabelProps extends AriaLabelProps {
  size?: FieldSize;
}

const labelStyles = tv({
  base: "text-sm text-dim cursor-default w-fit",
  variants: {
    size: {
      small: "text-xs",
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
      className={twMerge("text-sm text-dim", props.className)}
    />
  );
}

export function FieldError(props: FieldErrorProps) {
  return (
    <AriaFieldError
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "text-sm text-red-9 forced-colors:text-[Mark]",
      )}
    />
  );
}

export const fieldBorderStyles = tv({
  variants: {
    isFocusWithin: {
      true: "border-normal has-autofill:border-yellow-6 dark:has-autofill:border-violet-6",
      false:
        "border-normal has-autofill:border-yellow-6 dark:has-autofill:border-violet-6",
    },
    isInvalid: {
      true: "border-red-9",
    },
    isDisabled: {
      true: "border-dim",
    },
  },
});

export const innerBorderStyles = tv({
  variants: {
    isFocusWithin: {
      true: "border-normal has-autofill:border-yellow-6 dark:has-autofill:border-violet-6",
      false:
        "border-normal has-autofill:border-yellow-6 dark:has-autofill:border-violet-6",
    },
    isInvalid: {
      true: "border-red-9",
    },
    isDisabled: {
      true: "border-dim",
    },
  },
});

const fieldGroupStyles = tv({
  extend: focusRing,
  base: "border bg-theme-1 dark:bg-theme-2 text-sm group has-autofill:bg-yellow-3 dark:has-autofill:bg-violet-3 flex items-center forced-colors:bg-[Field] rounded-lg",
  variants: {
    ...fieldBorderStyles.variants,
    size: {
      small: "min-h-8",
      medium: "min-h-10 ",
      large: "min-h-12 text-lg",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

interface GroupProps extends AriaGroupProps {
  size?: FieldSize;
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
  size?: FieldSize;
  ref?: Ref<HTMLInputElement>;
}

export const inputStyles = tv({
  base: "flex-1 min-w-0 outline outline-none !bg-transparent disable-native-autofill disabled:text-dim",
  variants: {
    size: {
      // Since the input is wrapped in a fieldGroup which has a border, subtract 2px from the
      // height so the overall height aligns with buttons, etc.
      small: "px-2 h-[calc(2rem-2px)] text-sm",
      medium: "px-3 h-[calc(2.5rem-2px)]",
      large: "px-3.5 h-[calc(3rem-2px)] text-lg",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export function Input({ ref, size, ...props }: InputProps) {
  return (
    <AriaInput
      {...props}
      ref={ref}
      className={composeRenderProps(props.className, (className, renderProps) =>
        inputStyles({ ...renderProps, size, className }),
      )}
    />
  );
}

export const inputTextAreaStyles = tv({
  base: "flex-1 min-w-0 leading-snug outline-none bg-transparent disable-native-autofill text-normal disabled:text-dim",
  variants: {
    size: {
      small: "px-2 py-1",
      medium: "px-3 py-2",
      large: "px-3.5 py-2.5 text-lg leading-snug",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

interface InputTextAreaProps extends Omit<AriaTextAreaProps, "size"> {
  size?: FieldSize;
  ref?: Ref<HTMLTextAreaElement>;
}

export function InputTextArea({ ref, size, ...props }: InputTextAreaProps) {
  return (
    <AriaTextArea
      {...props}
      ref={ref}
      className={composeRenderProps(props.className, (className, renderProps) =>
        inputTextAreaStyles({ ...renderProps, size, className }),
      )}
    />
  );
}
