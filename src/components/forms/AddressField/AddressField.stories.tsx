import type { Meta } from "@storybook/react";
import { AddressField, type AddressFieldProps } from ".";

const meta: Meta<typeof AddressField> = {
  component: AddressField,
  parameters: {
    layout: "padded",
  },
};

export default meta;

export const Example = (args: AddressFieldProps) => <AddressField {...args} />;

Example.args = {
  children: (
    <div className="border border-gray-dim p-3 rounded-lg text-gray-dim">
      Children
    </div>
  ),
};
