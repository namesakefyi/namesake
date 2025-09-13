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
  variant?: "warning" | "danger" | "success";
  icon?: LucideIcon;
}

const badge = tv({
  base: "px-1 font-medium w-max tabular-nums text-center inline-flex justify-center gap-1 items-center shrink-0 bg-theme-a3 text-dim forced-colors:border forced-colors:bg-transparent forced-colors:border-[ButtonBorder] forced-colors:text-[CanvasText]",
  variants: {
    size: {
      xs: "text-[10px] rounded-sm h-4 px-1 min-w-4 leading-none",
      sm: "text-xs rounded-sm h-5 min-w-5",
      lg: "text-sm rounded-md px-1.5 h-6 min-w-6 gap-1.5",
    },
    variant: {
      warning: "bg-yellow-4 text-yellow-12",
      danger: "bg-red-4 text-red-12",
      success: "bg-green-4 text-green-12",
    },
  },
  defaultVariants: {
    variant: undefined,
    size: "sm",
  },
});

const icon = tv({
  base: "shrink-0 size-4 forced-colors:text-[CanvasText]",
  variants: {
    size: {
      xs: "size-3",
      sm: "size-4",
      lg: "size-4",
    },
    variant: {
      warning: "text-yellow-11",
      danger: "text-red-11",
      success: "text-green-11",
    },
  },
});

export function Badge({
  icon: Icon,
  className,
  size,
  variant,
  ...props
}: BadgeProps) {
  return (
    <div
      {...props}
      className={badge({
        size,
        variant,
        className,
      })}
      data-testid="badge"
    >
      {Icon && <Icon className={icon({ size, variant })} />}
      {props.children}
    </div>
  );
}
