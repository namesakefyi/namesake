import type { Meta } from "@storybook/react-vite";
import { RangeCalendar } from "@/components/common";

const meta: Meta<typeof RangeCalendar> = {
  component: RangeCalendar,
};

export default meta;

export const Example = (args: any) => (
  <RangeCalendar aria-label="Trip dates" {...args} />
);
