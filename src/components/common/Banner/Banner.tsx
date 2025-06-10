import {
  Check,
  Info,
  type LucideIcon,
  OctagonAlert,
  TriangleAlert,
} from "lucide-react";
import { tv } from "tailwind-variants";

export interface BannerProps {
  children: React.ReactNode;
  icon?: LucideIcon;
  variant?: "success" | "danger" | "warning";
  size?: "medium" | "large";
  className?: string;
}

const bannerStyles = tv({
  base: "flex items-start w-full rounded-lg bg-theme-3 text-dim prose",
  variants: {
    variant: {
      success: "bg-green-3 text-green-normal [&_a]:text-green-normal",
      danger: "bg-red-3 text-red-normal [&_a]:text-red-normal",
      warning: "bg-yellow-3 text-yellow-normal [&_a]:text-yellow-normal",
    },
    size: {
      medium: "gap-2 p-2.5 px-3 pr-4 !text-sm",
      large: "gap-4 p-3 px-4 !text-base",
    },
  },
  defaultVariants: {
    variant: undefined,
    size: "medium",
  },
});

const iconStyles = tv({
  base: "text-theme-11 shrink-0",
  variants: {
    variant: {
      success: "text-green-11",
      danger: "text-red-11",
      warning: "text-yellow-11",
    },
    size: {
      medium: "size-5",
      large: "size-5 mt-0.5",
    },
  },
  defaultVariants: {
    variant: undefined,
    size: "medium",
  },
});

export function Banner({
  children,
  icon: Icon,
  size,
  variant,
  className,
}: BannerProps) {
  const DefaultIcon = () => {
    switch (variant) {
      case "success":
        return Check;
      case "danger":
        return OctagonAlert;
      case "warning":
        return TriangleAlert;
      default:
        return Info;
    }
  };

  Icon = Icon ?? DefaultIcon();

  return (
    <div role="alert" className={bannerStyles({ variant, size, className })}>
      <Icon className={iconStyles({ variant, size })} />
      <div className="[&>_a]:underline">{children}</div>
    </div>
  );
}
