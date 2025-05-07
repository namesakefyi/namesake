import { Slider } from "@/components/common";
import type { Meta } from "@storybook/react-vite";

const meta: Meta<typeof Slider> = {
  component: Slider,
};

export default meta;

export const Example = (args: any) => <Slider {...args} />;

Example.args = {
  label: "Range",
  defaultValue: [30],
  thumbLabels: ["start"],
};

export const TwoValues = (args: any) => <Slider {...args} />;

TwoValues.args = {
  label: "Range",
  defaultValue: [30, 60],
  thumbLabels: ["start", "end"],
};
