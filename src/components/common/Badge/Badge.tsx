import type { LucideIcon } from "lucide-react";
import { tv } from "tailwind-variants";
import { Button, type ButtonProps } from "../Button/Button";

export interface BadgeButtonProps
  extends Omit<ButtonProps, "variant" | "size"> {
  label: string;
  icon?: LucideIcon;
}

export function BadgeButton({ icon, label, ...props }: BadgeButtonProps) {
  return (
    <Button
      {...props}
      variant="icon"
      size="small"
      className="size-5 -mx-0.5"
      aria-label={label}
      icon={icon}
      iconProps={{ size: 12 }}
    />
  );
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: "xs" | "sm" | "lg";
  icon?: LucideIcon;
}

const badge = tv({
  base: "px-1 font-medium w-max tabular-nums text-center inline-flex justify-center gap-1 items-center shrink-0 bg-theme-a3 text-dim",
  variants: {
    size: {
      xs: "text-[10px] rounded-sm h-4 px-1 min-w-4 leading-none",
      sm: "text-xs rounded-sm h-5 min-w-5",
      lg: "text-sm rounded-md px-1.5 h-6 min-w-6 gap-1.5",
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

const icon = tv({
  base: "shrink-0 size-4",
  variants: {
    size: {
      xs: "size-3",
      sm: "size-4",
      lg: "size-4.5",
    },
  },
});

export function Badge({ icon: Icon, className, size, ...props }: BadgeProps) {
  return (
    <div
      {...props}
      className={badge({
        size,
        className,
      })}
      data-testid="badge"
    >
      {Icon && <Icon className={icon({ size })} />}
      {props.children}
    </div>
  );
}
