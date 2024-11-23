import type { Meta } from "@storybook/react";
import { CircleHelp } from "lucide-react";
import { Heading } from "react-aria-components";
import { Popover } from ".";
import { Button } from "../Button";
import { Dialog, DialogTrigger } from "../Dialog";

const meta: Meta<typeof Popover> = {
  component: Popover,
  args: {},
};

export default meta;

export const Example = (args: any) => (
  <DialogTrigger>
    <Button variant="icon" aria-label="Help">
      <CircleHelp />
    </Button>
    <Popover {...args} className="max-w-[250px]">
      <Dialog>
        <Heading slot="title" className="text-lg font-semibold mb-2">
          Help
        </Heading>
        <p className="text-sm">
          For help accessing your account, please contact support.
        </p>
      </Dialog>
    </Popover>
  </DialogTrigger>
);
