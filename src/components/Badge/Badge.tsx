import { tv } from "tailwind-variants";

export interface BadgeProps {
  children: React.ReactNode;
  size?: "sm" | "lg";
  variant?: "info" | "success" | "danger" | "warning";
}

const badge = tv({
  base: "px-1.5 py-0.5 font-medium text-center bg-gray-3 dark:bg-graydark-3 text-gray-dim",
  variants: {
    size: {
      sm: "text-xs rounded",
      lg: "text-sm rounded-md",
    },
    variant: {
      info: "bg-blue-3 dark:bg-bluedark-3 text-blue-dim",
      success: "bg-green-3 dark:bg-greendark-3 text-green-dim",
      danger: "bg-red-3 dark:bg-reddark-3 text-red-dim",
      warning: "bg-amber-3 dark:bg-amberdark-3 text-amber-dim",
    },
  },
  defaultVariants: {
    variant: undefined,
    size: "sm",
  },
});

export function Badge(props: BadgeProps) {
  return (
    <span
      {...props}
      className={badge({ variant: props.variant, size: props.size })}
    >
      {props.children}
    </span>
  );
}
