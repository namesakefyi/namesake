import type { Meta } from "@storybook/react-vite";
import { ProgressBar } from "@/components/common";

const meta: Meta<typeof ProgressBar> = {
  component: ProgressBar,
};

export default meta;

export const Example = (args: any) => <ProgressBar {...args} />;

Example.args = {
  label: "Loading…",
  value: 80,
};
