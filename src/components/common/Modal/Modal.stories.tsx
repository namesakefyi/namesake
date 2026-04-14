import type { Meta, StoryFn } from "@storybook/react";
import { Button } from "../Button";
import { Heading } from "../Content";
import { Dialog, DialogTrigger } from "../Dialog";
import { TextField } from "../TextField";
import { Modal } from ".";

const meta: Meta<typeof Modal> = {
  component: Modal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryFn<typeof Modal>;

export const Example: Story = (args) => (
  <DialogTrigger>
    <Button>Sign up…</Button>
    <Modal {...args}>
      <Dialog>
        <form>
          <Heading slot="title">Sign up</Heading>
          <TextField autoFocus label="First Name:" />
          <TextField label="Last Name:" />
          <Button slot="close">Submit</Button>
        </form>
      </Dialog>
    </Modal>
  </DialogTrigger>
);
