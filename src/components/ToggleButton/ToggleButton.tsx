import type { LucideIcon } from "lucide-react";
import {
  ToggleButton as AriaToggleButton,
  type ToggleButtonProps as AriaToggleButtonProps,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { buttonStyles } from "../Button";
import { focusRing } from "../utils";

export interface ToggleButtonProps extends AriaToggleButtonProps {
  children?: React.ReactNode;
  icon?: LucideIcon;
  size?: "small" | "medium";
}

const styles = tv({
  extend: focusRing,
  base: "px-3.5 [&:has(svg:only-child)]:px-2 text-sm text-center transition rounded-lg border border-black/10 dark:border-white/10",
  variants: {
    isSelected: {
      false: buttonStyles.variants.variant.secondary,
      true: "bg-gray-12 dark:bg-graydark-12 text-gray-1 dark:text-gray-12 shadow-sm",
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
