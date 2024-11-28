import type { Meta } from "@storybook/react";
import { ProgressBar } from ".";

const meta: Meta<typeof ProgressBar> = {
  component: ProgressBar,
};

export default meta;

export const Example = (args: any) => <ProgressBar {...args} />;

Example.args = {
  label: "Loading…",
  value: 80,
};
