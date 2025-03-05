import { useState } from "react";
import { tv } from "tailwind-variants";

export interface RedactedTextProps {
  children: string;
  className?: string;
}

const styles = tv({
  base: "inline relative",
  variants: {
    revealed: {
      true: "cursor-text select-text",
      false: "cursor-pointer select-none",
    },
  },
});

const contentStyles = tv({
  base: "transition-colors",
  variants: {
    revealed: {
      true: "bg-transparent",
      false: "bg-gray-9 text-gray-9",
    },
  },
});

export function RedactedText({ children, className }: RedactedTextProps) {
  const [revealed, setRevealed] = useState(false);

  if (!children) return null;

  return (
    <label className={styles({ revealed, className })}>
      <input
        type="checkbox"
        checked={revealed}
        onChange={(e) => setRevealed(e.target.checked)}
        className="sr-only"
        aria-label="Reveal spoiler"
      />
      {!revealed && (
        <span className="sr-only" aria-live="polite">
          Spoiler text hidden. Check checkbox to reveal.
        </span>
      )}
      <span className={contentStyles({ revealed })} aria-hidden={!revealed}>
        {children}
      </span>
      {revealed && (
        <span className="sr-only" aria-live="polite">
          Spoiler text revealed: {children}
        </span>
      )}
    </label>
  );
}
