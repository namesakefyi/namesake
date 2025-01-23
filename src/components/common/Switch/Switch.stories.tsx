import { Switch } from "@/components/common";
import type { Meta } from "@storybook/react";

const meta: Meta<typeof Switch> = {
  component: Switch,
};

export default meta;

export const Example = (args: any) => <Switch {...args}>Wi-Fi</Switch>;
