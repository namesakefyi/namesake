import type { RemixiconComponentType } from "@remixicon/react";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { focusRing } from "../utils";

export interface ButtonProps extends AriaButtonProps {
  children?: React.ReactNode;
  icon?: RemixiconComponentType;
  variant?: "primary" | "secondary" | "destructive" | "icon" | "ghost";
  size?: "small" | "medium";
}

export const buttonStyles = tv({
  extend: focusRing,
  base: "py-2 text-sm font-medium transition rounded-lg flex gap-1 items-center justify-center border border-black/10 dark:border-white/10 cursor-pointer",
  variants: {
    variant: {
      primary: "bg-purple-solid text-white",
      secondary: "bg-gray-ghost text-gray-normal",
      destructive: "bg-red-solid",
      icon: "bg-gray-ghost text-gray-dim hover:text-gray-normal border-0 flex items-center justify-center rounded-full",
      ghost: "bg-gray-ghost text-gray-dim hover:text-gray-normal border-0",
    },
    size: {
      small: "h-8 px-2",
      medium: "h-10 px-3",
    },
    isDisabled: {
      true: "cursor-default text-gray-dim opacity-50 forced-colors:text-[GrayText]",
    },
  },
  compoundVariants: [
    {
      variant: "icon",
      size: "small",
      className: "w-8 h-8",
    },
    {
      variant: "icon",
      size: "medium",
      className: "w-10 h-10 p-2",
    },
  ],
  defaultVariants: {
    variant: "secondary",
    size: "medium",
  },
});

export function Button({
  variant,
  size,
  icon: Icon,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <AriaButton
      {...props}
      className={composeRenderProps(className, (className, renderProps) =>
        buttonStyles({
          ...renderProps,
          variant,
          size,
          className,
        }),
      )}
    >
      {Icon && <Icon size={size === "small" ? 16 : 20} />}
      {children}
    </AriaButton>
  );
}
