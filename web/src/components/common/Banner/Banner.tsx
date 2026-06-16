import {
  type RemixiconComponentType,
  RiCheckLine,
  RiCloseCircleLine,
  RiErrorWarningLine,
  RiInformation2Line,
} from "@remixicon/react";
import "./Banner.css";
import clsx from "clsx";

export interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "info" | "success" | "warning" | "error";
  icon?: RemixiconComponentType;
}

const variantToIcon = {
  info: RiInformation2Line,
  success: RiCheckLine,
  warning: RiErrorWarningLine,
  error: RiCloseCircleLine,
};

export function Banner({
  children,
  icon,
  variant = "info",
  className,
  ...props
}: BannerProps) {
  const Icon = icon ?? variantToIcon[variant];
  const role =
    variant === "error" || variant === "warning" ? "alert" : "status";

  return (
    <div
      role={role}
      className={clsx("banner", className)}
      data-variant={variant}
      {...props}
    >
      <div className="banner-icon">
        <Icon size={24} />
      </div>
      <div className="banner-content">{children}</div>
    </div>
  );
}
