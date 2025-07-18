import type { Meta } from "@storybook/react-vite";
import { CircleHelp } from "lucide-react";
import { Button, DialogTrigger, Popover } from "@/components/common";

const meta: Meta<typeof Popover> = {
  component: Popover,
};

export default meta;

export const Example = (args: any) => (
  <DialogTrigger>
    <Button variant="icon" aria-label="Help" icon={CircleHelp} />
    <Popover {...args} className="max-w-[250px] p-3">
      <p className="text-sm">
        For help accessing your account, please contact support.
      </p>
    </Popover>
  </DialogTrigger>
);
