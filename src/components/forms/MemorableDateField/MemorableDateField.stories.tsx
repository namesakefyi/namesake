import type { Meta } from "@storybook/react";
import { MemorableDateField, type MemorableDateFieldProps } from ".";

const meta: Meta<typeof MemorableDateField> = {
  component: MemorableDateField,
  parameters: {
    layout: "padded",
  },
};

export default meta;

export const Example = (args: MemorableDateFieldProps) => (
  <MemorableDateField {...args} />
);

Example.args = {
  label: "Birthdate",
  children: (
    <div className="border border-gray-dim p-3 rounded-lg text-gray-dim">
      Children
    </div>
  ),
};
