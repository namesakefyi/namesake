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
  base: "flex items-start w-full rounded-lg bg-primary-3 text-primary-12 [&_a]:text-primary-12 prose forced-colors:border forced-colors:border-[ButtonBorder]",
  variants: {
    variant: {
      success: "bg-green-3 text-green-12 [&_a]:text-green-12",
      danger: "bg-red-3 text-red-12 [&_a]:text-red-12",
      warning: "bg-yellow-3 text-yellow-12 [&_a]:text-yellow-12",
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
  base: "text-primary-11 shrink-0 forced-colors:text-[ButtonText]",
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

const DefaultIcon = (variant: BannerProps["variant"]) => {
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

export function Banner({
  children,
  icon: Icon,
  size,
  variant,
  className,
}: BannerProps) {
  Icon = Icon ?? DefaultIcon(variant);

  return (
    <div role="alert" className={bannerStyles({ variant, size, className })}>
      <Icon className={iconStyles({ variant, size })} />
      <div className="[&>_a]:underline">{children}</div>
    </div>
  );
}
