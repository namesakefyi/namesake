import type { Meta } from "@storybook/react-vite";
import { Calendar } from "@/components/common";

const meta: Meta<typeof Calendar> = {
  component: Calendar,
};

export default meta;

export const Example = (args: any) => (
  <Calendar aria-label="Event date" {...args} />
);
