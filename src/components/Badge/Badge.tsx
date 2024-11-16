import type { RemixiconComponentType } from "@remixicon/react";
import { tv } from "tailwind-variants";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: "sm" | "lg";
  variant?: "info" | "success" | "danger" | "warning" | "waiting";
  icon?: RemixiconComponentType;
}

const badge = tv({
  base: "px-1.5 py-0.5 font-medium text-center inline-flex gap-1 items-center shrink-0 bg-graya-3 dark:bg-graydarka-3 text-gray-dim",
  variants: {
    size: {
      sm: "text-xs rounded",
      lg: "text-sm rounded-md px-2 gap-1.5",
    },
    variant: {
      info: "bg-bluea-3 dark:bg-bluedarka-3 text-blue-normal",
      success: "bg-greena-3 dark:bg-greendarka-3 text-green-normal",
      danger: "bg-reda-3 dark:bg-reddarka-3 text-red-normal",
      warning: "bg-ambera-3 dark:bg-amberdarka-3 text-amber-normal",
      waiting: "bg-purplea-3 dark:bg-purpledarka-3 text-purple-normal",
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
      waiting: "text-purple-dim",
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
