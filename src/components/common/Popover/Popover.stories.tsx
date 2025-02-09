import { Button, DialogTrigger, Popover } from "@/components/common";
import type { Meta } from "@storybook/react";
import { CircleHelp } from "lucide-react";

const meta: Meta<typeof Popover> = {
  component: Popover,
  args: {
    title: "Help",
  },
};

export default meta;

export const Example = (args: any) => (
  <DialogTrigger>
    <Button variant="icon" aria-label="Help" icon={CircleHelp} />
    <Popover {...args} className="max-w-[250px]">
      <p className="text-sm">
        For help accessing your account, please contact support.
      </p>
    </Popover>
  </DialogTrigger>
);
