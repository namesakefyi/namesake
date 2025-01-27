import { buttonStyles } from "@/components/common";
import { focusRing } from "@/components/utils";
import type { LucideIcon } from "lucide-react";
import {
  ToggleButton as AriaToggleButton,
  type ToggleButtonProps as AriaToggleButtonProps,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

export interface ToggleButtonProps extends AriaToggleButtonProps {
  children?: React.ReactNode;
  icon?: LucideIcon;
  size?: "small" | "medium";
}

const styles = tv({
  extend: focusRing,
  base: "px-3.5 [&:has(svg:only-child)]:px-2 text-sm text-center font-medium transition rounded-lg border border-transparent",
  variants: {
    isSelected: {
      false: "bg-transparent text-gray-dim hover:text-gray-normal",
      true: "bg-white dark:bg-graydark-3 text-gray-normal shadow-sm border border-gray-dim",
    },
    isDisabled: buttonStyles.variants.isDisabled,
    size: {
      small: "h-8",
      medium: "h-10",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export function ToggleButton({
  size,
  icon: Icon,
  className,
  children,
  ...props
}: ToggleButtonProps) {
  return (
    <AriaToggleButton
      {...props}
      className={composeRenderProps(className, (className, renderProps) =>
        styles({ ...renderProps, size, className }),
      )}
    >
      {Icon && <Icon size={size === "small" ? 16 : 20} />}
      {children}
    </AriaToggleButton>
  );
}
