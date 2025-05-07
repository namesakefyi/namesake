import { Tag, TagGroup } from "@/components/common";
import type { Meta } from "@storybook/react-vite";

const meta: Meta<typeof Example> = {
  component: TagGroup,
};

export default meta;

export const Example = (args: any) => (
  <TagGroup {...args}>
    <Tag>Chocolate</Tag>
    <Tag>Mint</Tag>
    <Tag>Strawberry</Tag>
    <Tag>Vanilla</Tag>
  </TagGroup>
);

Example.args = {
  label: "Ice cream flavor",
  selectionMode: "single",
};
