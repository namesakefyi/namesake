import type { Meta } from "@storybook/react";
import { ToggleButtonGroup } from ".";

const meta: Meta<typeof ToggleButtonGroup> = {
  component: ToggleButtonGroup,
};

export default meta;

export const Example = (args: any) => <ToggleButtonGroup {...args} />;
