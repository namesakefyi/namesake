import { ToggleButton, ToggleButtonGroup } from "@/components/common";
import type { Meta } from "@storybook/react";

const meta: Meta<typeof ToggleButtonGroup> = {
  component: ToggleButtonGroup,
};

export default meta;

export const Example = (args: any) => (
  <ToggleButtonGroup selectionMode="single" {...args}>
    <ToggleButton id="button-1">Button 1</ToggleButton>
    <ToggleButton id="button-2">Button 2</ToggleButton>
    <ToggleButton id="button-3">Button 3</ToggleButton>
  </ToggleButtonGroup>
);
