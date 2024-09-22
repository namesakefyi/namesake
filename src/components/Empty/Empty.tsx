import type { RemixiconComponentType } from "@remixicon/react";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { Button, type ButtonProps } from "../Button";

interface EmptyProps {
  icon: RemixiconComponentType;
  title: string;
  subtitle?: string;
  className?: string;
  children?: ReactNode;
  button?: ButtonProps;
}

export function Empty({
  icon: Icon,
  title,
  subtitle,
  className,
  button,
}: EmptyProps) {
  return (
    <div
      className={twMerge(
        "flex flex-1 flex-col items-center justify-center gap-4 w-full min-h-80 text-gray-normal",
        className,
      )}
    >
      <Icon size={40} className="text-gray-8 dark:text-graydark-8" />
      <h2 className="font-semibold text-xl">{title}</h2>
      {subtitle && <p className="text-gray-dim -mt-3">{subtitle}</p>}
      {button && <Button {...button} />}
    </div>
  );
}
