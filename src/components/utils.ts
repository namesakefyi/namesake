import { composeRenderProps } from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

export const focusRing = tv({
  base: "outline outline-offset-2 has-[[data-focus-visible]]:outline-0",
  variants: {
    isFocusVisible: {
      false: "outline-transparent",
      true: "outline-3 outline-purple-a9 animate-focus-ring-in motion-reduce:animate-none",
    },
  },
});

export function composeTailwindRenderProps<T>(
  className: string | ((v: T) => string) | undefined,
  tw: string,
): string | ((v: T) => string) {
  return composeRenderProps(className, (className) => twMerge(tw, className));
}
