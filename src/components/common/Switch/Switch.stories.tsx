import type { Meta } from "@storybook/react-vite";
import { Switch } from "@/components/common";

const meta: Meta<typeof Switch> = {
  component: Switch,
};

export default meta;

export const Example = (args: any) => <Switch {...args}>Wi-Fi</Switch>;
