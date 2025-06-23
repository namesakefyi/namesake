import type { Meta } from "@storybook/react-vite";
import {
  LanguageSelectField,
  type LanguageSelectFieldProps,
} from "@/components/forms";

const meta: Meta<typeof LanguageSelectField> = {
  component: LanguageSelectField,
  parameters: {
    layout: "padded",
  },
};

export default meta;

export const Example = (args: LanguageSelectFieldProps) => (
  <LanguageSelectField {...args} />
);

Example.args = {
  label: "Language",
  name: "language",
  children: (
    <div className="border border-dim p-3 rounded-lg text-dim">Children</div>
  ),
};
