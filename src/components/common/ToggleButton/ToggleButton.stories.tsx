import { ToggleButton } from "@/components/common";
import type { Meta } from "@storybook/react";

const meta: Meta<typeof ToggleButton> = {
  component: ToggleButton,
};

export default meta;

export const Example = (args: any) => (
  <ToggleButton {...args}>Pin</ToggleButton>
);
