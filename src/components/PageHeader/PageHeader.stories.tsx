import type { Meta, StoryObj } from "@storybook/react";

import { Badge } from "../Badge";
import { Button } from "../Button";
import { PageHeader } from "./PageHeader";

const meta = {
  component: PageHeader,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof PageHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Court Order",
  },
};

export const Badged: Story = {
  args: {
    title: "Court Order",
    badge: <Badge>MA</Badge>,
  },
};

export const Subtitle: Story = {
  args: {
    title: "Court Order",
    badge: <Badge>MA</Badge>,
    subtitle: "Case #123456",
  },
};

export const Actions: Story = {
  args: {
    title: "Court Order",
    badge: <Badge>MA</Badge>,
    subtitle: "Case #123456",
    children: <Button>Mark complete</Button>,
  },
};
