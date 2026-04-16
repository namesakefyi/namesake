import { RiSaveLine } from "@remixicon/react";
import type { Meta, StoryFn } from "@storybook/react";
import { Button } from "../Button";
import { Tooltip, TooltipTrigger } from ".";

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryFn<typeof Tooltip>;

export const Example: Story = (args) => (
  <TooltipTrigger>
    <Button>
      <RiSaveLine size={24} />
    </Button>
    <Tooltip {...args}>Save</Tooltip>
  </TooltipTrigger>
);
