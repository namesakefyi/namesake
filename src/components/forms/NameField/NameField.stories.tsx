import type { Meta } from "@storybook/react-vite";
import { NameField, type NameFieldProps } from "@/components/forms";

const meta: Meta<typeof NameField> = {
  component: NameField,
  parameters: {
    layout: "padded",
  },
};

export default meta;

export const Example = (args: NameFieldProps) => <NameField {...args} />;

Example.args = {
  type: "newName",
  children: (
    <div className="border border-dim p-3 rounded-lg text-dim">Children</div>
  ),
};
