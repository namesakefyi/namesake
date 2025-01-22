import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Heading } from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { Button, type ButtonProps } from "../Button";
import { Link, type LinkProps } from "../Link";

interface EmptyProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  className?: string;
  children?: ReactNode;
  button?: ButtonProps;
  link?: LinkProps;
}

export function Empty({
  icon: Icon,
  title,
  subtitle,
  className,
  children,
  button,
  link,
}: EmptyProps) {
  return (
    <div
      className={twMerge(
        "flex flex-1 flex-col items-center justify-center gap-4 w-full min-h-80 text-gray-normal",
        className,
      )}
    >
      <Icon
        size={40}
        className="text-gray-8 dark:text-graydark-8 shrink-0 stroke-[1.5px]"
      />
      <Heading className="font-semibold text-xl">{title}</Heading>
      {subtitle && <p className="text-gray-dim -mt-3">{subtitle}</p>}
      <div className="flex gap-2">
        {button && <Button {...button} />}
        {link && <Link {...link} />}
      </div>
      {children}
    </div>
  );
}
