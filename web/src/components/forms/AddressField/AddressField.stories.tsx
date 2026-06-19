import type { Meta } from "@storybook/react-vite";
import { FormProvider, useForm } from "react-hook-form";
import { AddressField, type AddressFieldProps } from "./AddressField";

const meta: Meta<typeof AddressField> = {
  component: AddressField,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => {
      const form = useForm();
      return (
        <FormProvider {...form}>
          <Story />
        </FormProvider>
      );
    },
  ],
};

export default meta;

export const Example = (args: AddressFieldProps) => <AddressField {...args} />;

Example.args = {
  type: "residence",
};

export const IncludeAddress2 = (args: AddressFieldProps) => (
  <AddressField {...args} />
);

IncludeAddress2.args = {
  type: "residence",
  includeAddress2: true,
};

export const IncludeCounty = (args: AddressFieldProps) => (
  <AddressField {...args} />
);

IncludeCounty.args = {
  type: "residence",
  includeCounty: true,
};
