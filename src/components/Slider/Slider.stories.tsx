import type { Meta } from "@storybook/react";
import { Slider } from ".";

const meta: Meta<typeof Slider> = {
  component: Slider,
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const Example = (args: any) => <Slider {...args} />;

Example.args = {
  label: "Range",
  defaultValue: [30, 60],
  thumbLabels: ["start", "end"],
};
