import type { Meta } from "@storybook/react";
import { Calendar } from ".";

const meta: Meta<typeof Calendar> = {
  component: Calendar,
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const Example = (args: any) => (
  <Calendar aria-label="Event date" {...args} />
);
