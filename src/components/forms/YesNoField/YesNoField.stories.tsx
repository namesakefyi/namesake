import type { Meta } from "@storybook/react-vite";
import { YesNoField, type YesNoFieldProps } from "@/components/forms";

const meta: Meta<typeof YesNoField> = {
  component: YesNoField,
  parameters: {
    layout: "padded",
  },
};

export default meta;

export const Example = (args: YesNoFieldProps) => <YesNoField {...args} />;

Example.args = {
  label: "Custom field",
  name: "customField",
  description: "A custom description",
  children: (
    <div className="border border-dim p-3 rounded-lg text-dim">Children</div>
  ),
};
