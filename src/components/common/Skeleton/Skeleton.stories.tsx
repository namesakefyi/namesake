import type { Meta } from "@storybook/react";

import { Skeleton, SkeletonCircle, SkeletonText } from "./Skeleton";

const meta = {
  component: Skeleton,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Skeleton>;

export default meta;

export const Default = (args: any) => <Skeleton {...args} />;

Default.args = {
  className: "w-48 h-24",
};

export const Circle = (args: any) => <SkeletonCircle {...args} />;

Circle.args = {
  className: "w-10 h-10",
};

export const Text = (args: any) => <SkeletonText {...args} />;

Text.args = {
  lines: 3,
  align: "left",
};
