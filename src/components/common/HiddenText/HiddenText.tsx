import { type FocusEventHandler, useState } from "react";
import { tv } from "tailwind-variants";
import { focusRing } from "@/components/utils";

export interface HiddenTextProps {
  children: string;
  className?: string;
}

const styles = tv({
  extend: focusRing,
  base: "inline relative rounded-xs",
  variants: {
    isRevealed: {
      true: "cursor-text select-text",
      false: "cursor-pointer select-none",
    },
  },
});

const contentStyles = tv({
  base: "transition-colors rounded-xs",
  variants: {
    isRevealed: {
      true: "bg-transparent",
      false:
        "text-transparent bg-theme-4 forced-colors:bg-[CanvasText] forced-colors:text-[CanvasText]",
    },
  },
});

export function HiddenText({ children, className }: HiddenTextProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);

  if (!children) return null;

  const handleFocus: FocusEventHandler = (e) => {
    if (e.target.matches(":focus-visible")) setIsFocusVisible(true);
  };

  const handleBlur = () => setIsFocusVisible(false);

  return (
    <label
      className={styles({ isRevealed, isFocusVisible, className })}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <input
        type="checkbox"
        checked={isRevealed}
        onChange={(e) => setIsRevealed(e.target.checked)}
        className="sr-only"
        title="Hidden text, toggle to reveal"
      />
      <span className={contentStyles({ isRevealed })} aria-hidden={!isRevealed}>
        {children}
      </span>
    </label>
  );
}
