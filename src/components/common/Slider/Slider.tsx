import { Label } from "@/components/common";
import { composeTailwindRenderProps, focusRing } from "@/components/utils";
import {
  Slider as AriaSlider,
  type SliderProps as AriaSliderProps,
  SliderOutput,
  type SliderRenderProps,
  SliderThumb,
  SliderTrack,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const trackStyles = tv({
  base: "rounded-full",
  variants: {
    orientation: {
      horizontal: "w-full h-[6px]",
      vertical: "h-full w-[6px] ml-[50%] -translate-x-[50%]",
    },
    isDisabled: {
      false: "bg-gray-5 forced-colors:bg-[ButtonBorder]",
      true: "bg-gray-1 forced-colors:bg-[GrayText]",
    },
  },
});

const thumbStyles = tv({
  extend: focusRing,
  base: "w-6 h-6 group-orientation-horizontal:mt-6 group-orientation-vertical:ml-3 rounded-full bg-theme-9 shadow-sm",
  variants: {
    isDragging: {
      true: "bg-theme-10 forced-colors:bg-[ButtonBorder]",
    },
    isDisabled: {
      true: "border-gray-3 forced-colors:border-[GrayText]",
    },
  },
});

export interface SliderProps<T> extends AriaSliderProps<T> {
  label?: string;
  thumbLabels?: string[];
}

export function Slider<T extends number | number[]>({
  label,
  thumbLabels,
  ...props
}: SliderProps<T>) {
  const getThumbTrackFillStyle = (state: SliderRenderProps["state"]) => {
    if (state.values.length === 2) {
      return {
        left: `${state.getThumbPercent(0) * 100}%`,
        width: `${(state.getThumbPercent(1) - state.getThumbPercent(0)) * 100}%`,
      };
    }

    return { width: `${state.getThumbPercent(0) * 100}%` };
  };

  return (
    <AriaSlider
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "orientation-horizontal:grid orientation-vertical:flex grid-cols-[1fr_auto] flex-col items-center gap-2 orientation-horizontal:w-64",
      )}
    >
      <Label>{label}</Label>
      <SliderOutput className="text-sm text-gray-4 font-medium orientation-vertical:hidden">
        {({ state }) =>
          state.values.map((_, i) => state.getThumbValueLabel(i)).join(" – ")
        }
      </SliderOutput>
      <SliderTrack className="group col-span-2 orientation-horizontal:h-6 orientation-vertical:w-6 orientation-vertical:h-64 flex items-center">
        {({ state, ...renderProps }) => (
          <>
            <div className={trackStyles(renderProps)} />
            <div
              className="absolute h-[6px] top-[50%] translate-y-[-50%] rounded-full bg-theme-6"
              style={getThumbTrackFillStyle(state)}
            />
            {state.values.map((_, i) => (
              <SliderThumb
                key={thumbLabels?.[i]}
                index={i}
                aria-label={thumbLabels?.[i]}
                className={thumbStyles}
              />
            ))}
          </>
        )}
      </SliderTrack>
    </AriaSlider>
  );
}
