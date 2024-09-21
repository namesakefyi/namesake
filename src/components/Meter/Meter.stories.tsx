import type { Meta } from "@storybook/react";
import { Meter } from ".";

const meta: Meta<typeof Meter> = {
  component: Meter,
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const Example = (args: any) => <Meter {...args} />;

Example.args = {
  label: "Storage space",
  value: 80,
};
