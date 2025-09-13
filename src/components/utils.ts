import { composeRenderProps } from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

export const focusRing = tv({
  base: "outline outline-offset-2 has-[button[data-focus-visible]]:outline-none forced-colors:outline-[Highlight]",
  variants: {
    isFocusVisible: {
      false: "outline-transparent outline-0",
      true: "outline-3 outline-primary-a8 animate-focus-ring-in motion-reduce:animate-none",
    },
  },
});

export function composeTailwindRenderProps<T>(
  className: string | ((v: T) => string) | undefined,
  tw: string,
): string | ((v: T) => string) {
  return composeRenderProps(className, (className) => twMerge(tw, className));
}
