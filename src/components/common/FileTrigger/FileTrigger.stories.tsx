import type { Meta } from "@storybook/react-vite";
import { Button, FileTrigger } from "@/components/common";

const meta = {
  component: FileTrigger,
} satisfies Meta<typeof FileTrigger>;

export default meta;

export const Default = (args: any) => (
  <FileTrigger {...args}>
    <Button>Upload file</Button>
  </FileTrigger>
);
