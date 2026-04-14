import type { Meta, StoryFn } from "@storybook/react";
import { ToggleButton } from "react-aria-components";
import { ToggleButtonGroup } from ".";

const meta: Meta<typeof ToggleButtonGroup> = {
  component: ToggleButtonGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryFn<typeof ToggleButtonGroup>;

export const Example: Story = (args) => (
  <ToggleButtonGroup {...args}>
    <ToggleButton id="left">Left</ToggleButton>
    <ToggleButton id="center">Center</ToggleButton>
    <ToggleButton id="right">Right</ToggleButton>
  </ToggleButtonGroup>
);
