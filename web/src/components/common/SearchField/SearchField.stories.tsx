import type { Meta, StoryFn } from "@storybook/react";
import { SearchField } from ".";

const meta: Meta<typeof SearchField> = {
  component: SearchField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryFn<typeof SearchField>;

export const Example: Story = (args) => <SearchField {...args} />;

Example.args = {
  label: "Search",
};
