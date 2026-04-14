import type { Meta, StoryFn } from "@storybook/react";
import { ComboBox, ComboBoxItem } from ".";

const meta: Meta<typeof ComboBox> = {
  component: ComboBox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryFn<typeof ComboBox>;

export const Example: Story = (args) => (
  <ComboBox {...args}>
    <ComboBoxItem>Chocolate</ComboBoxItem>
    <ComboBoxItem>Mint</ComboBoxItem>
    <ComboBoxItem>Strawberry</ComboBoxItem>
    <ComboBoxItem>Vanilla</ComboBoxItem>
  </ComboBox>
);

Example.args = {
  label: "Ice cream flavor",
};
