import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge, Button } from "@/components/common";
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

export const Actions: Story = {
  args: {
    title: "Court Order",
    badge: <Badge>MA</Badge>,
    children: <Button>Mark complete</Button>,
  },
};
