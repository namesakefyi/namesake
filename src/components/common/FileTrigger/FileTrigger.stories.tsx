import { Button, FileTrigger } from "@/components/common";
import type { Meta } from "@storybook/react";

const meta = {
  component: FileTrigger,
} satisfies Meta<typeof FileTrigger>;

export default meta;

export const Default = (args: any) => (
  <FileTrigger {...args}>
    <Button>Upload file</Button>
  </FileTrigger>
);
