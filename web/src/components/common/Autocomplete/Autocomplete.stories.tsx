import type { Meta, StoryFn } from "@storybook/react";
import { MenuItem } from "../Menu";
import { Autocomplete } from ".";

const meta: Meta<typeof Autocomplete> = {
  component: Autocomplete,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryFn<typeof Autocomplete>;

interface Command {
  id: string;
  name: string;
}

const commands: Command[] = [
  { id: "new-file", name: "Create new file..." },
  { id: "new-folder", name: "Create new folder..." },
  { id: "assign", name: "Assign to..." },
  { id: "assign-me", name: "Assign to me" },
  { id: "change-status", name: "Change status..." },
  { id: "change-priority", name: "Change priority..." },
  { id: "add-label", name: "Add label..." },
  { id: "remove-label", name: "Remove label..." },
];

export const Example: Story = (args) => (
  <Autocomplete
    {...args}
    items={commands}
    renderEmptyState={() => "No commands found"}
  >
    {(item: Command) => <MenuItem id={item.id}>{item.name}</MenuItem>}
  </Autocomplete>
);

Example.args = {
  label: "Commands",
  placeholder: "Search commands...",
};
