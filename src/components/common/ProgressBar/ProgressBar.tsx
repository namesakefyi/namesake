import {
  ProgressBar as AriaProgressBar,
  type ProgressBarProps as AriaProgressBarProps,
} from "react-aria-components";
import { Label } from "../Form";
import "./ProgressBar.css";

export interface ProgressBarProps extends AriaProgressBarProps {
  label?: string;
}

export function ProgressBar({ label, ...props }: ProgressBarProps) {
  return (
    <AriaProgressBar {...props}>
      {({ percentage, valueText, isIndeterminate }) => {
        const translateX = isIndeterminate
          ? "translateX(-60%)"
          : `translateX(${(percentage ?? 0) - 100}%)`;

        return (
          <>
            <Label className="label">{label}</Label>
            <span className="value">{valueText}</span>
            <div className="bar">
              <div
                className="fill"
                style={{
                  width: "100%",
                  transform: translateX,
                }}
              />
            </div>
          </>
        );
      }}
    </AriaProgressBar>
  );
}
