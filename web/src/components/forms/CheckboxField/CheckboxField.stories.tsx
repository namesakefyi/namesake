import type { Meta } from "@storybook/react-vite";
import { CheckboxField, type CheckboxFieldProps } from "./CheckboxField";

const meta: Meta<typeof CheckboxField> = {
  component: CheckboxField,
  parameters: {
    layout: "padded",
  },
};

export default meta;

export const Example = (args: CheckboxFieldProps) => (
  <CheckboxField {...args} />
);

Example.args = {
  name: "shouldReturnOriginalDocuments",
  label: "I would like my documents returned",
  children: <div>Children</div>,
};
