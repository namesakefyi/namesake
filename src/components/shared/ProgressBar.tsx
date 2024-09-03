import {
  ProgressBar as AriaProgressBar,
  type ProgressBarProps as AriaProgressBarProps,
} from "react-aria-components";
import { composeTailwindRenderProps } from "../utils";
import { Label } from "./Field";

export interface ProgressBarProps extends AriaProgressBarProps {
  label?: string;
}

export function ProgressBar({ label, ...props }: ProgressBarProps) {
  return (
    <AriaProgressBar
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "flex flex-col gap-1",
      )}
    >
      {({ percentage, valueText, isIndeterminate }) => (
        <>
          <div className="flex justify-between gap-2">
            <Label>{label}</Label>
            <span className="text-sm text-gray-6 dark:text-gray-4">
              {valueText}
            </span>
          </div>
          <div className="w-64 h-2 rounded-full bg-gray-3 dark:bg-gray-8 outline outline-1 -outline-offset-1 outline-transparent relative overflow-hidden">
            <div
              className={`absolute top-0 h-full rounded-full bg-blue-9 dark:bg-blue-5 forced-colors:bg-[Highlight] ${isIndeterminate ? "left-full animate-in duration-10 [--tw-enter-translate-x:calc(-16rem-1%)] slide-out-to-right-full repeat-infinite ease-out" : "left-0"}`}
              style={{ width: `${isIndeterminate ? 40 : percentage}%` }}
            />
          </div>
        </>
      )}
    </AriaProgressBar>
  );
}
