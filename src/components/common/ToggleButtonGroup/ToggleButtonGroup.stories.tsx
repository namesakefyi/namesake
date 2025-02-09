import { ToggleButtonGroup } from "@/components/common";
import type { Meta } from "@storybook/react";

const meta: Meta<typeof ToggleButtonGroup> = {
  component: ToggleButtonGroup,
};

export default meta;

export const Example = (args: any) => <ToggleButtonGroup {...args} />;
