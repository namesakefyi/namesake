import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { focusRing } from "../utils";

export interface ButtonProps extends AriaButtonProps {
  variant?: "primary" | "secondary" | "destructive" | "icon";
}

const button = tv({
  extend: focusRing,
  base: "px-3 py-2 h-10 text-sm font-medium transition rounded-lg flex gap-1 items-center justify-center border border-black/10 dark:border-white/10 cursor-pointer",
  variants: {
    variant: {
      primary: "bg-purple-solid",
      secondary: "bg-gray-ghost text-gray-normal",
      destructive: "bg-red-solid",
      icon: "bg-gray-ghost border-0 p-2 flex items-center justify-center rounded-full",
    },
    isDisabled: {
      true: "cursor-default text-gray-dim opacity-50 forced-colors:text-[GrayText]",
    },
  },
  defaultVariants: {
    variant: "secondary",
  },
});

export function Button(props: ButtonProps) {
  return (
    <AriaButton
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        button({ ...renderProps, variant: props.variant, className }),
      )}
    />
  );
}
