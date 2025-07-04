import type { Meta } from "@storybook/react-vite";
import { AlertDialog, Button, DialogTrigger, Modal } from "@/components/common";

const meta: Meta<typeof AlertDialog> = {
  component: AlertDialog,
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const Example = (args: any) => (
  <DialogTrigger>
    <Button variant="secondary">Delete…</Button>
    <Modal>
      <AlertDialog {...args} />
    </Modal>
  </DialogTrigger>
);

Example.args = {
  title: "Delete folder",
  children:
    'Are you sure you want to delete "Documents"? All contents will be permanently destroyed.',
  variant: "destructive",
  actionLabel: "Delete",
};
