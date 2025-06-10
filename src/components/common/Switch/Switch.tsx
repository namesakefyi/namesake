import { composeTailwindRenderProps, focusRing } from "@/components/utils";
import type React from "react";
import {
  Switch as AriaSwitch,
  type SwitchProps as AriaSwitchProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

export interface SwitchProps extends Omit<AriaSwitchProps, "children"> {
  children: React.ReactNode;
}

const track = tv({
  extend: focusRing,
  base: "flex h-5 w-9 px-px items-center shrink-0 cursor-pointer rounded-full transition duration-200 ease-in-out border border-transparent",
  variants: {
    isSelected: {
      false: "bg-theme-a4",
      true: "bg-theme-9 forced-colors:bg-[Highlight]!",
    },
    isDisabled: {
      true: "bg-gray-2 forced-colors:group-selected:!bg-[GrayText] forced-colors:border-[GrayText]",
    },
  },
});

const handle = tv({
  base: "h-4 w-4 transform rounded-full bg-white outline-1 -outline-offset-1 outline-transparent shadow-sm transition duration-200 ease-in-out",
  variants: {
    isSelected: {
      false: "translate-x-0",
      true: "translate-x-[100%]",
    },
    isDisabled: {
      true: "forced-colors:outline-[GrayText]",
    },
  },
});

export function Switch({ children, ...props }: SwitchProps) {
  return (
    <AriaSwitch
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "group flex gap-2 items-center disabled:opacity-50 forced-colors:disabled:text-[GrayText] text-sm transition",
      )}
    >
      {(renderProps) => (
        <>
          <div className={track(renderProps)}>
            <span className={handle(renderProps)} />
          </div>
          {children}
        </>
      )}
    </AriaSwitch>
  );
}
