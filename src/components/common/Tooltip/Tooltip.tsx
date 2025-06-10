import type { ThemeColor } from "@/constants";
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
  color?: ThemeColor;
}

const styles = tv({
  base: "group bg-theme-12 text-theme-1 text-sm rounded-lg drop-shadow-md will-change-transform px-3 py-1",
  variants: {
    color: {
      pink: "bg-pink-12",
      red: "bg-red-12",
      orange: "bg-orange-12",
      yellow: "bg-yellow-12",
      green: "bg-green-12",
      turquoise: "bg-turquoise-12",
      indigo: "bg-indigo-12",
      violet: "bg-violet-12",
      gray: "bg-gray-12",
    },
    isEntering: {
      true: "animate-in fade-in placement-bottom:slide-in-from-top-0.5 placement-top:slide-in-from-bottom-0.5 placement-left:slide-in-from-right-0.5 placement-right:slide-in-from-left-0.5 ease-out duration-200",
    },
    isExiting: {
      true: "animate-out fade-out placement-bottom:slide-out-to-top-0.5 placement-top:slide-out-to-bottom-0.5 placement-left:slide-out-to-right-0.5 placement-right:slide-out-to-left-0.5 ease-in duration-150",
    },
  },
});

const arrowStyles = tv({
  base: "fill-theme-12 forced-colors:fill-[Canvas] group-placement-bottom:rotate-180 group-placement-left:-rotate-90 group-placement-right:rotate-90",
  variants: {
    color: {
      pink: "fill-pink-12",
      red: "fill-red-12",
      orange: "fill-orange-12",
      yellow: "fill-yellow-12",
      green: "fill-green-12",
      turquoise: "fill-turquoise-12",
      indigo: "fill-indigo-12",
      violet: "fill-violet-12",
      gray: "fill-gray-12",
    },
  },
});

export function Tooltip({ children, color, ...props }: TooltipProps) {
  return (
    <AriaTooltip
      offset={10}
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        styles({ ...renderProps, color, className }),
      )}
    >
      <OverlayArrow>
        <svg
          width={8}
          height={8}
          viewBox="0 0 8 8"
          className={arrowStyles({ color })}
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
