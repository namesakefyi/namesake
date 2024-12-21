import type { Meta } from "@storybook/react";
import { CircleHelp } from "lucide-react";
import { Popover } from ".";
import { Button } from "../Button";
import { DialogTrigger } from "../Dialog";

const meta: Meta<typeof Popover> = {
  component: Popover,
  args: {
    title: "Help",
  },
};

export default meta;

export const Example = (args: any) => (
  <DialogTrigger>
    <Button variant="icon" aria-label="Help">
      <CircleHelp />
    </Button>
    <Popover {...args} className="max-w-[250px]">
      <p className="text-sm">
        For help accessing your account, please contact support.
      </p>
    </Popover>
  </DialogTrigger>
);
