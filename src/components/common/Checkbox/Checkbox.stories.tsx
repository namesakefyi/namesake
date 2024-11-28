import type { Meta } from "@storybook/react";
import { Checkbox } from ".";

const meta: Meta<typeof Checkbox> = {
  component: Checkbox,
};

export default meta;

export const Example = (args: any) => <Checkbox {...args} />;
