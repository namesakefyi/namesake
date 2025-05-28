import type { FieldSize } from "@/components/common";
import { focusRing } from "@/components/utils";
import type { LucideIcon, LucideProps } from "lucide-react";
import { Loader2 } from "lucide-react";
import type { Ref } from "react";
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
  variant?:
    | "primary"
    | "secondary"
    | "destructive"
    | "success"
    | "icon"
    | "ghost";
  size?: FieldSize;
  ref?: Ref<HTMLButtonElement>;
  isSubmitting?: boolean;
}

export const buttonStyles = tv({
  extend: focusRing,
  base: "py-2 text-sm font-medium relative whitespace-nowrap rounded-lg border border-gray-dim transition-all duration-200 ease-in-out flex items-center justify-center",
  variants: {
    variant: {
      primary:
        "bg-purple-9 hover:bg-purple-10 text-white border-purple-10 shadow-xs",
      secondary:
        "bg-white dark:bg-gray-3 dark:hover:bg-gray-4 hover:border-gray-normal text-gray-normal shadow-sm",
      destructive:
        "bg-red-9 text-white border-red-11 shadow-sm hover:bg-red-10",
      success:
        "bg-green-9 text-white border-green-11 shadow-sm hover:bg-green-10",
      icon: "bg-transparent hover:bg-gray-a3 text-gray-dim hover:text-gray-normal border-0 flex shrink-0 items-center justify-center rounded-full",
      ghost:
        "bg-transparent hover:bg-gray-a3 text-gray-dim hover:text-gray-normal border-0",
    },
    size: {
      small: "h-8 px-2 gap-1.5",
      medium: "h-10 px-3 gap-1.5",
      large: "h-12 px-3.5 gap-2 text-lg",
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
  ref,
  isSubmitting,
  isDisabled,
  ...props
}: ButtonProps) {
  const iconSize = size === "large" ? 20 : 16;
  const iconStrokeWidth = size === "large" ? 2.5 : 2;
  const sharedIconProps = {
    size: iconSize,
    strokeWidth: iconStrokeWidth,
  };

  const innerContentStyles = tv({
    base: "inline-flex gap-1.5 items-center justify-center w-full",
    variants: {
      isSubmitting: {
        true: "invisible",
        false: "",
      },
    },
  });

  return (
    <AriaButton
      {...props}
      ref={ref}
      isDisabled={isSubmitting || isDisabled}
      className={composeRenderProps(className, (className, renderProps) =>
        buttonStyles({
          ...renderProps,
          variant,
          size,
          className,
        }),
      )}
    >
      <span className={innerContentStyles({ isSubmitting })}>
        {Icon && (
          <Icon {...sharedIconProps} className="shrink-0" {...iconProps} />
        )}
        {children}
        {EndIcon && <EndIcon {...sharedIconProps} {...endIconProps} />}
      </span>
      {isSubmitting && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Loader2 {...sharedIconProps} className="shrink-0 animate-spin" />
        </span>
      )}
    </AriaButton>
  );
}
