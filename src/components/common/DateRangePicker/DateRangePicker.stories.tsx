import type { Meta, StoryFn } from "@storybook/react";
import { DateRangePicker } from ".";

const meta: Meta<typeof DateRangePicker> = {
  component: DateRangePicker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryFn<typeof DateRangePicker>;

export const Example: Story = (args) => <DateRangePicker {...args} />;

Example.args = {
  label: "Event date",
};
