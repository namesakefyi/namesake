import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Heading } from "react-aria-components";
import { twMerge } from "tailwind-merge";
import {
  Button,
  type ButtonProps,
  Link,
  type LinkProps,
} from "@/components/common";
import { smartquotes } from "@/utils/smartquotes";

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
        "flex flex-1 flex-col items-center justify-center gap-4 w-full min-h-60 text-normal",
        className,
      )}
    >
      <Icon size={40} className="text-theme-9 shrink-0 stroke-[1.5]" />
      <Heading className="font-semibold text-xl">{smartquotes(title)}</Heading>
      {subtitle && (
        <p className="text-dim -mt-3 text-center">{smartquotes(subtitle)}</p>
      )}
      <div className="flex gap-2">
        {button && <Button {...button} />}
        {link && <Link {...link} />}
      </div>
      {children}
    </div>
  );
}
