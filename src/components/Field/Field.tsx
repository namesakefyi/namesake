import {
  FieldError as AriaFieldError,
  Input as AriaInput,
  Label as AriaLabel,
  TextArea as AriaTextArea,
  type FieldErrorProps,
  Group,
  type GroupProps,
  type InputProps,
  type LabelProps,
  Text,
  type TextAreaProps,
  type TextProps,
  composeRenderProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";
import { composeTailwindRenderProps, focusRing } from "../utils";

export function Label(props: LabelProps) {
  return (
    <AriaLabel
      {...props}
      className={twMerge(
        "text-sm text-gray-normal font-medium cursor-default w-fit",
        props.className,
      )}
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
      false: "border-gray-dim forced-colors:border-[ButtonBorder]",
      true: "border-gray-dim forced-colors:border-[Highlight]",
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
  variants: fieldBorderStyles.variants,
});

export function FieldGroup(props: GroupProps) {
  return (
    <Group
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        fieldGroupStyles({ ...renderProps, className }),
      )}
    />
  );
}

const inputStyles =
  "px-3 py-2 flex-1 min-w-0 outline outline-0 bg-gray-subtle text-gray-normal disabled:text-gray-dim";

export function Input(props: InputProps) {
  return (
    <AriaInput
      {...props}
      className={composeTailwindRenderProps(props.className, inputStyles)}
    />
  );
}

export function InputTextArea(props: TextAreaProps) {
  return (
    <AriaTextArea
      {...props}
      className={composeTailwindRenderProps(props.className, inputStyles)}
    />
  );
}
