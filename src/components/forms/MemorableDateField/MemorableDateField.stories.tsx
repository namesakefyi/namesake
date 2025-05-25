import {
  MemorableDateField,
  type MemorableDateFieldProps,
} from "@/components/forms";
import type { Meta } from "@storybook/react-vite";

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
  name: "dateOfBirth",
  label: "Birthdate",
  children: (
    <div className="border border-gray-dim p-3 rounded-lg text-gray-dim">
      Children
    </div>
  ),
};
