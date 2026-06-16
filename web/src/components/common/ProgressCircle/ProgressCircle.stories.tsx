import type { Meta, StoryFn } from "@storybook/react";
import { ProgressCircle } from ".";

const meta: Meta<typeof ProgressCircle> = {
  component: ProgressCircle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryFn<typeof ProgressCircle>;

export const Determinate: Story = (args) => <ProgressCircle {...args} />;

Determinate.args = {
  "aria-label": "Loading…",
  value: 60,
  size: 32,
};

export const Indeterminate: Story = (args) => <ProgressCircle {...args} />;

Indeterminate.args = {
  "aria-label": "Loading…",
  isIndeterminate: true,
  size: 32,
};
