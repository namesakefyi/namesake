import type { Meta } from "@storybook/react";
import { ListBox, ListBoxItem } from ".";

const meta: Meta<typeof ListBox> = {
  component: ListBox,
};

export default meta;

export const Example = (args: any) => (
  <ListBox aria-label="Ice cream flavor" {...args}>
    <ListBoxItem id="chocolate">Chocolate</ListBoxItem>
    <ListBoxItem id="mint">Mint</ListBoxItem>
    <ListBoxItem id="strawberry">Strawberry</ListBoxItem>
    <ListBoxItem id="vanilla">Vanilla</ListBoxItem>
  </ListBox>
);

Example.args = {
  onAction: null,
  selectionMode: "multiple",
};

export const DisabledItems = (args: any) => <Example {...args} />;
DisabledItems.args = {
  ...Example.args,
  disabledKeys: ["mint"],
};
