import type { RemixiconComponentType } from "@remixicon/react";
import { tv } from "tailwind-variants";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: "sm" | "lg";
  variant?: "info" | "success" | "danger" | "warning";
  icon?: RemixiconComponentType;
}

const badge = tv({
  base: "px-1.5 py-0.5 font-medium text-center inline-flex gap-1 items-center shrink-0 bg-graya-3 dark:bg-graydarka-3 text-gray-dim",
  variants: {
    size: {
      sm: "text-xs rounded",
      lg: "text-sm rounded-md",
    },
    variant: {
      info: "bg-blue-3 dark:bg-bluedark-3 text-blue-normal",
      success: "bg-green-3 dark:bg-greendark-3 text-green-normal",
      danger: "bg-red-3 dark:bg-reddark-3 text-red-normal",
      warning: "bg-amber-3 dark:bg-amberdark-3 text-amber-normal",
    },
  },
  defaultVariants: {
    variant: undefined,
    size: "sm",
  },
});

const icon = tv({
  base: "w-4 h-4",
  variants: {
    variant: {
      info: "text-blue-dim",
      success: "text-green-dim",
      danger: "text-red-dim",
      warning: "text-amber-dim",
    },
  },
});

export function Badge({ icon: Icon, ...props }: BadgeProps) {
  return (
    <div
      {...props}
      className={badge({ variant: props.variant, size: props.size })}
    >
      {Icon && <Icon className={icon({ variant: props.variant })} />}
      {props.children}
    </div>
  );
}
