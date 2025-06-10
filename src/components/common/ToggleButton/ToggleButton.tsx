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
  base: "px-3.5 [&:has(svg:only-child)]:px-2 text-sm text-center font-medium transition rounded-lg border border-transparent relative isolate shrink-0 flex items-center justify-center gap-2",
  variants: {
    isSelected: {
      false:
        "bg-transparent text-dim hover:text-normal before:absolute before:-z-1 before:inset-1 before:rounded-full before:bg-transparent hover:before:bg-theme-2/80 dark:hover:before:bg-theme-11/15",
      true: "bg-theme-1 dark:bg-theme-3 text-normal shadow-xs border border-dim",
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
      {Icon && <Icon size={size === "small" ? 16 : 20} className="shrink-0" />}
      {children}
    </AriaToggleButton>
  );
}
