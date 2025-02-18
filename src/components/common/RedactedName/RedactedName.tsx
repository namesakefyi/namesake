import { Button, Tooltip, TooltipTrigger } from "@/components/common";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { JSX } from "react/jsx-runtime";
import { tv } from "tailwind-variants";

export interface RedactedNameProps {
  children: string;
  className?: string;
}

const redactedStyles = tv({
  base: "inline-flex items-center gap-1.5 rounded-md transition-colors",
  variants: {
    isRevealed: {
      true: "bg-graya-2 dark:bg-graydarka-2",
      false: "bg-graya-3 dark:bg-graydarka-3 text-transparent select-none",
    },
  },
});

export function RedactedName({
  children,
  className,
}: RedactedNameProps): JSX.Element | null {
  const [isRevealed, setIsRevealed] = useState(false);

  if (!children) return null;

  return (
    <span className={redactedStyles({ isRevealed, className })}>
      <span className="px-1.5 py-0.5" aria-hidden={!isRevealed}>
        {children}
      </span>
      <TooltipTrigger>
        <Button
          variant="ghost"
          size="small"
          icon={isRevealed ? EyeOff : Eye}
          onPress={() => setIsRevealed(!isRevealed)}
          aria-label={isRevealed ? "Hide Deadname" : "Show Deadname"}
          className="p-1.5"
        />
        <Tooltip>{isRevealed ? "Hide Deadname" : "Show Deadname"}</Tooltip>
      </TooltipTrigger>
    </span>
  );
}
