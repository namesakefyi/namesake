import { useState } from "react";
import { tv } from "tailwind-variants";

export interface RedactedTextProps {
  children: string;
  className?: string;
}

const styles = tv({
  base: "inline relative [&>mark]:bg-none [&>mark]:text-inherit",
  variants: {
    revealed: {
      true: "[&>mark]:bg-transparent cursor-text select-text",
      false:
        "[&>mark]:bg-gray-9 [&>mark]:text-gray-9 cursor-pointer select-none",
    },
  },
});

export function RedactedText({ children, className }: RedactedTextProps) {
  const [revealed, setRevealed] = useState(false);

  if (!children) return null;

  return (
    <button
      className={styles({ revealed, className })}
      onClick={() => setRevealed(true)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          setRevealed(true);
        }
      }}
      aria-label={revealed ? undefined : "Reveal spoiler"}
      type="button"
    >
      <mark aria-hidden={!revealed}>{children}</mark>
    </button>
  );
}
