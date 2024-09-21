import type { Meta } from "@storybook/react";
import { ToggleButton } from ".";

const meta: Meta<typeof ToggleButton> = {
  component: ToggleButton,
};

export default meta;

export const Example = (args: any) => (
  <ToggleButton {...args}>Pin</ToggleButton>
);
