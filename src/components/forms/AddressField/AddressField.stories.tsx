import type { Meta } from "@storybook/react-vite";
import { AddressField, type AddressFieldProps } from "@/components/forms";

const meta: Meta<typeof AddressField> = {
  component: AddressField,
  parameters: {
    layout: "padded",
  },
};

export default meta;

export const Example = (args: AddressFieldProps) => <AddressField {...args} />;

Example.args = {
  type: "residence",
  children: (
    <div className="border border-dim p-3 rounded-lg text-dim">Children</div>
  ),
};

export const IncludeCounty = (args: AddressFieldProps) => (
  <AddressField {...args} includeCounty />
);

IncludeCounty.args = {
  type: "residence",
};
