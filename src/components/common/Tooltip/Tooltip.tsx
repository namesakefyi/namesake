import type React from "react";
import {
  Tooltip as AriaTooltip,
  type TooltipProps as AriaTooltipProps,
  TooltipTrigger as AriaTooltipTrigger,
  OverlayArrow,
  type TooltipTriggerComponentProps,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

export interface TooltipProps extends Omit<AriaTooltipProps, "children"> {
  children: React.ReactNode;
}

const styles = tv({
  base: "group bg-gray-12 text-gray-1 text-sm rounded-lg drop-shadow-lg will-change-transform px-3 py-1",
  variants: {
    isEntering: {
      true: "animate-in fade-in placement-bottom:slide-in-from-top-0.5 placement-top:slide-in-from-bottom-0.5 placement-left:slide-in-from-right-0.5 placement-right:slide-in-from-left-0.5 ease-out duration-200",
    },
    isExiting: {
      true: "animate-out fade-out placement-bottom:slide-out-to-top-0.5 placement-top:slide-out-to-bottom-0.5 placement-left:slide-out-to-right-0.5 placement-right:slide-out-to-left-0.5 ease-in duration-150",
    },
  },
});

export function Tooltip({ children, ...props }: TooltipProps) {
  return (
    <AriaTooltip
      {...props}
      offset={10}
      className={composeRenderProps(props.className, (className, renderProps) =>
        styles({ ...renderProps, className }),
      )}
    >
      <OverlayArrow>
        <svg
          width={8}
          height={8}
          viewBox="0 0 8 8"
          className="fill-gray-12 forced-colors:fill-[Canvas] group-placement-[bottom]:rotate-180 group-placement-[left]:-rotate-90 group-placement-[right]:rotate-90"
        >
          <path d="M0 0 L4 4 L8 0" />
        </svg>
      </OverlayArrow>
      {children}
    </AriaTooltip>
  );
}

export function TooltipTrigger({
  delay,
  ...props
}: TooltipTriggerComponentProps) {
  return <AriaTooltipTrigger delay={delay ?? 400} {...props} />;
}
