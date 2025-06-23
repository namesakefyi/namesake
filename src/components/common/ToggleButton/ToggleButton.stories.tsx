import type { Meta } from "@storybook/react-vite";
import { ToggleButton } from "@/components/common";

const meta: Meta<typeof ToggleButton> = {
  component: ToggleButton,
};

export default meta;

export const Example = (args: any) => (
  <ToggleButton {...args}>Pin</ToggleButton>
);
