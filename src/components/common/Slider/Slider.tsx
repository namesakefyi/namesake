import {
  Slider as AriaSlider,
  type SliderProps as AriaSliderProps,
  SliderOutput,
  SliderThumb,
  SliderTrack,
} from "react-aria-components";
import { Label } from "../Form";
import "./Slider.css";

export interface SliderProps<T> extends AriaSliderProps<T> {
  label?: string;
  thumbLabels?: string[];
}

export function Slider<T extends number | number[]>({
  label,
  thumbLabels,
  ...props
}: SliderProps<T>) {
  return (
    <AriaSlider {...props}>
      {label && <Label>{label}</Label>}
      <SliderOutput>
        {({ state }) =>
          state.values.map((_, i) => state.getThumbValueLabel(i)).join(" – ")
        }
      </SliderOutput>
      <SliderTrack>
        {({ state }) =>
          state.values.map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: the index will be consistent
            <SliderThumb key={i} index={i} aria-label={thumbLabels?.[i]} />
          ))
        }
      </SliderTrack>
    </AriaSlider>
  );
}
