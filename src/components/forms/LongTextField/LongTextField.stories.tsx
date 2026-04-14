import type { Meta } from "@storybook/react-vite";
import { LongTextField, type LongTextFieldProps } from "./LongTextField";

const meta: Meta<typeof LongTextField> = {
  component: LongTextField,
  parameters: {
    layout: "padded",
  },
};

export default meta;

export const Example = (args: LongTextFieldProps) => (
  <LongTextField {...args} />
);

Example.args = {
  label: "Free text",
  name: "freeText",
  children: <div>Children</div>,
};
