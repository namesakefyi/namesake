import type { Meta } from "@storybook/react-vite";
import { AddressField, type AddressFieldProps } from "./AddressField";

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
  children: <div>Children</div>,
};

export const IncludeCounty = (args: AddressFieldProps) => (
  <AddressField {...args} includeCounty />
);

IncludeCounty.args = {
  type: "residence",
};
