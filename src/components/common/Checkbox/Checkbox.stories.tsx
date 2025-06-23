import type { Meta } from "@storybook/react-vite";
import { Checkbox } from "@/components/common";

const meta: Meta<typeof Checkbox> = {
  component: Checkbox,
};

export default meta;

export const Example = (args: any) => <Checkbox {...args} />;
