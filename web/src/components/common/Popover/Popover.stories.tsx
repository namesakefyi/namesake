import { RiQuestionLine } from "@remixicon/react";
import { Button } from "../Button";
import { Heading } from "../Content";
import { DialogTrigger } from "../Dialog";
import { Popover } from ".";

import "./Popover.css";

import type { Meta, StoryFn } from "@storybook/react";

const meta: Meta<typeof Popover> = {
  component: Popover,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryFn<typeof Popover>;

export const Example: Story = (args) => (
  <DialogTrigger>
    <Button aria-label="Help">
      <RiQuestionLine size={18} />
    </Button>
    <Popover {...args} style={{ padding: "var(--space-m)" }}>
      <Heading slot="title">Help</Heading>
      <p>For help accessing your account, please contact support.</p>
    </Popover>
  </DialogTrigger>
);
