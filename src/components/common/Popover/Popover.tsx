import type React from "react";
import type { Ref } from "react";
import {
  Popover as AriaPopover,
  type PopoverProps as AriaPopoverProps,
  composeRenderProps,
  PopoverContext,
  useSlottedContext,
} from "react-aria-components";
import { tv } from "tailwind-variants";

export interface PopoverProps extends Omit<AriaPopoverProps, "children"> {
  children: React.ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export const popoverStyles = tv({
  base: "bg-element outline-none forced-colors:bg-[Canvas] shadow-2xl rounded-xl bg-clip-padding border border-overlay text-normal",
  variants: {
    isEntering: {
      true: "animate-in fade-in placement-bottom:slide-in-from-top-1 placement-top:slide-in-from-bottom-1 placement-left:slide-in-from-right-1 placement-right:slide-in-from-left-1 ease-out duration-200",
    },
    isExiting: {
      true: "animate-out fade-out placement-bottom:slide-out-to-top-1 placement-top:slide-out-to-bottom-1 placement-left:slide-out-to-right-1 placement-right:slide-out-to-left-1 ease-in duration-150",
    },
  },
});

export function Popover({ children, className, ref, ...props }: PopoverProps) {
  const popoverContext = useSlottedContext(PopoverContext)!;
  const isSubmenu = popoverContext?.trigger === "SubmenuTrigger";
  const offset = isSubmenu ? 2 : 8;

  return (
    <AriaPopover
      offset={offset}
      {...props}
      className={composeRenderProps(className, (className, renderProps) =>
        popoverStyles({ ...renderProps, className }),
      )}
      ref={ref}
    >
      {children}
    </AriaPopover>
  );
}
