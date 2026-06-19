import type { Meta } from "@storybook/react-vite";
import { PronounSelectField } from "./PronounSelectField";

const meta: Meta<typeof PronounSelectField> = {
  component: PronounSelectField,
  parameters: {
    layout: "padded",
  },
};

export default meta;

export const Example = () => <PronounSelectField />;
