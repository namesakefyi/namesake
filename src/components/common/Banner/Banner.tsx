import {
  Check,
  Info,
  type LucideIcon,
  OctagonAlert,
  TriangleAlert,
  X,
} from "lucide-react";
import { tv } from "tailwind-variants";
import { Button } from "../Button/Button";

export interface BannerProps {
  children: React.ReactNode;
  icon?: LucideIcon;
  variant?: "info" | "success" | "danger" | "warning";
  size?: "medium" | "large";
  className?: string;
  onDismiss?: () => void;
}

const bannerStyles = tv({
  base: "relative grid grid-cols-[auto_1fr_auto] gap-2 rounded-lg bg-gray-3 dark:bg-graydark-3 text-gray-dim",
  variants: {
    variant: {
      info: "bg-blue-3 dark:bg-bluedark-3 text-blue-normal [&_a]:text-blue-normal",
      success:
        "bg-green-3 dark:bg-greendark-3 text-green-normal [&_a]:text-green-normal",
      danger:
        "bg-red-3 dark:bg-reddark-3 text-red-normal [&_a]:text-red-normal",
      warning:
        "bg-amber-3 dark:bg-amberdark-3 text-amber-normal [&_a]:text-amber-normal",
    },
    size: {
      medium: "gap-2 p-2.5 px-3 text-sm",
      large: "gap-3 p-3 text-base",
    },
  },
  defaultVariants: {
    variant: undefined,
    size: "medium",
  },
});

const iconStyles = tv({
  base: "text-gray-9 dark:text-graydark-9 shrink-0",
  variants: {
    variant: {
      info: "text-blue-10 dark:text-bluedark-10",
      success: "text-green-10 dark:text-greendark-10",
      danger: "text-red-10 dark:text-reddark-10",
      warning: "text-amber-10 dark:text-amberdark-10",
    },
  },
  defaultVariants: {
    variant: undefined,
  },
});

const dismissStyles = tv({
  base: "rounded-md",
  variants: {
    variant: {
      info: "text-blue-dim hover:text-blue-normal hover:bg-bluea-4 dark:hover:bg-bluedarka-4",
      success:
        "text-green-dim hover:text-green-normal hover:bg-greena-4 dark:hover:bg-greenda-4",
      danger:
        "text-red-dim hover:text-red-normal hover:bg-reda-4 dark:hover:bg-reddarka-4",
      warning:
        "text-amber-dim hover:text-amber-normal hover:bg-ambera-4 dark:hover:bg-amberdarka-4",
    },
    size: {
      medium: "size-6 -mr-0.5",
      large: "size-7",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export function Banner({
  children,
  icon: Icon,
  size,
  variant,
  className,
  onDismiss,
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
      <Icon size={20} className={iconStyles({ variant })} />
      <div>{children}</div>
      {onDismiss && (
        <Button
          variant="icon"
          icon={X}
          size="small"
          onPress={onDismiss}
          aria-label="Dismiss"
          className={dismissStyles({ variant, size })}
        />
      )}
    </div>
  );
}
