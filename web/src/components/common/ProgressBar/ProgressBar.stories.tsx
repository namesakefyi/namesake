import type { Meta, StoryFn } from "@storybook/react";
import { ProgressBar } from ".";

const meta: Meta<typeof ProgressBar> = {
  component: ProgressBar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryFn<typeof ProgressBar>;

export const Example: Story = (args) => <ProgressBar {...args} />;

Example.args = {
  label: "Loading…",
  value: 80,
};

export const Indeterminate: Story = (args) => <ProgressBar {...args} />;

Indeterminate.args = {
  label: "Loading…",
  isIndeterminate: true,
};

export const ZeroPercent: Story = (args) => <ProgressBar {...args} />;

ZeroPercent.args = {
  label: "Starting…",
  value: 0,
};

export const Complete: Story = (args) => <ProgressBar {...args} />;

Complete.args = {
  label: "Complete!",
  value: 100,
};
