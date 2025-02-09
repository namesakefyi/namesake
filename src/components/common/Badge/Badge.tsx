import type { LucideIcon } from "lucide-react";
import { tv } from "tailwind-variants";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: "xs" | "sm" | "lg";
  variant?: "info" | "warning" | "danger" | "waiting" | "success";
  icon?: LucideIcon;
}

const badge = tv({
  base: "px-1 font-medium tabular-nums text-center inline-flex justify-center gap-1 items-center shrink-0 bg-graya-3 dark:bg-graydarka-3 text-gray-dim",
  variants: {
    size: {
      xs: "text-[10px] rounded h-4 px-1 min-w-4 leading-none",
      sm: "text-xs rounded h-5 min-w-5",
      lg: "text-sm rounded-md px-1.5 h-6 min-w-6 gap-1.5",
    },
    variant: {
      info: "bg-bluea-3 dark:bg-bluedarka-3 text-blue-normal",
      warning: "bg-ambera-3 dark:bg-amberdarka-3 text-amber-normal",
      danger: "bg-reda-3 dark:bg-reddarka-3 text-red-normal",
      waiting: "bg-purplea-3 dark:bg-purpledarka-3 text-purple-normal",
      success: "bg-greena-3 dark:bg-greendarka-3 text-green-normal",
    },
  },
  defaultVariants: {
    variant: undefined,
    size: "sm",
  },
});

const icon = tv({
  base: "w-4 h-4 shrink-0",
  variants: {
    variant: {
      info: "text-blue-dim",
      warning: "text-amber-dim",
      danger: "text-red-dim",
      waiting: "text-purple-dim",
      success: "text-green-dim",
    },
  },
});

export function Badge({ icon: Icon, className, ...props }: BadgeProps) {
  return (
    <div
      {...props}
      className={badge({
        variant: props.variant,
        size: props.size,
        className,
      })}
      data-testid="badge"
    >
      {Icon && <Icon className={icon({ variant: props.variant })} />}
      {props.children}
    </div>
  );
}
