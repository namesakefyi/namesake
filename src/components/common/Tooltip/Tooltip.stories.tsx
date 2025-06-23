import type { Meta } from "@storybook/react-vite";
import { Printer, Save } from "lucide-react";
import { Button, Tooltip, TooltipTrigger } from "@/components/common";

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
};

export default meta;

export const Example = (args: any) => (
  <div className="flex gap-2">
    <TooltipTrigger>
      <Button variant="secondary" className="px-2" icon={Save} />
      <Tooltip {...args}>Save</Tooltip>
    </TooltipTrigger>
    <TooltipTrigger>
      <Button variant="secondary" className="px-2" icon={Printer} />
      <Tooltip {...args}>Print</Tooltip>
    </TooltipTrigger>
  </div>
);
