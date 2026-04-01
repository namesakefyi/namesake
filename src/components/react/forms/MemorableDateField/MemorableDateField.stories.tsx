import type { Meta } from "@storybook/react-vite";
import {
  MemorableDateField,
  type MemorableDateFieldProps,
} from "./MemorableDateField";

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
  children: <div>Children</div>,
};
