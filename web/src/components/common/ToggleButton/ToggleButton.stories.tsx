import type { Meta, StoryFn } from "@storybook/react";
import { ToggleButton } from ".";

const meta: Meta<typeof ToggleButton> = {
  component: ToggleButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryFn<typeof ToggleButton>;

export const Example: Story = (args) => (
  <ToggleButton {...args}>Pin</ToggleButton>
);
