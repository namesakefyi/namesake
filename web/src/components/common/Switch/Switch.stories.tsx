import type { Meta, StoryFn } from "@storybook/react";
import { Switch } from ".";

const meta: Meta<typeof Switch> = {
  component: Switch,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryFn<typeof Switch>;

export const Example: Story = (args) => <Switch {...args}>Wi-Fi</Switch>;
