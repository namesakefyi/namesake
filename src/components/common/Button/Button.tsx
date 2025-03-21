import type { FieldSize } from "@/components/common";
import { focusRing } from "@/components/utils";
import type { LucideIcon, LucideProps } from "lucide-react";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

export interface ButtonProps extends AriaButtonProps {
  children?: React.ReactNode;
  label?: string;
  icon?: LucideIcon;
  iconProps?: LucideProps;
  endIcon?: LucideIcon;
  endIconProps?: LucideProps;
  variant?: "primary" | "secondary" | "destructive" | "icon" | "ghost";
  size?: FieldSize;
}

export const buttonStyles = tv({
  extend: focusRing,
  base: "py-2 text-sm font-medium whitespace-nowrap rounded-lg flex gap-1.5 items-center justify-center border border-gray-dim transition",
  variants: {
    variant: {
      primary:
        "bg-purple-9 hover:bg-purple-10 text-white border-purple-10 shadow-xs",
      secondary:
        "bg-white dark:bg-gray-3 dark:hover:bg-gray-4 hover:border-gray-normal text-gray-normal shadow-sm",
      destructive:
        "bg-red-9 text-white border-red-11 shadow-sm hover:bg-red-10",
      icon: "bg-transparent hover:bg-gray-a3 text-gray-dim hover:text-gray-normal border-0 flex shrink-0 items-center justify-center rounded-full",
      ghost:
        "bg-transparent hover:bg-gray-a3 text-gray-dim hover:text-gray-normal border-0",
    },
    size: {
      small: "h-8 px-2",
      medium: "h-10 px-3",
      large: "h-12 px-3.5 text-lg",
    },
    isDisabled: {
      false: "cursor-pointer",
      true: "cursor-default opacity-40",
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
  iconProps,
  endIcon: EndIcon,
  endIconProps,
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
      {Icon && (
        <Icon
          size={size === "large" ? 20 : 16}
          strokeWidth={size === "large" ? 2.5 : 2}
          className="shrink-0"
          {...iconProps}
        />
      )}
      {children}
      {EndIcon && (
        <EndIcon
          size={size === "large" ? 20 : 16}
          strokeWidth={size === "large" ? 2.5 : 2}
          {...endIconProps}
        />
      )}
    </AriaButton>
  );
}
