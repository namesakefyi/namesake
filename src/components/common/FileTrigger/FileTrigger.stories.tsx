import type { Meta } from "@storybook/react";

import { Button } from "../Button";
import { FileTrigger } from "./FileTrigger";

const meta = {
  component: FileTrigger,
} satisfies Meta<typeof FileTrigger>;

export default meta;

export const Default = (args: any) => (
  <FileTrigger {...args}>
    <Button>Upload file</Button>
  </FileTrigger>
);
