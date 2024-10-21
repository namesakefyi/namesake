import type { RemixiconComponentType } from "@remixicon/react";
import { twMerge } from "tailwind-merge";

export interface PageHeaderProps {
  title: string;
  icon?: RemixiconComponentType;
  badge?: React.ReactNode;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}

export const PageHeader = ({
  title,
  icon: Icon,
  badge,
  subtitle,
  children,
  className,
}: PageHeaderProps) => {
  return (
    <header
      className={twMerge(
        "h-12 flex items-center justify-between gap-6 text-gray-normal",
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        <div className="flex gap-2 items-center">
          {Icon && <Icon className="text-gray-dim" />}
          <h1 className="text-xl font-medium">{title}</h1>
          {badge}
        </div>
        {subtitle && <p className="text-gray-dim">{subtitle}</p>}
      </div>
      {children}
    </header>
  );
};
