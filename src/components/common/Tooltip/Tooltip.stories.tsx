import type { Meta } from "@storybook/react";
import { Printer, Save } from "lucide-react";
import { Tooltip, TooltipTrigger } from ".";
import { Button } from "../Button";

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
};

export default meta;

export const Example = (args: any) => (
  <div className="flex gap-2">
    <TooltipTrigger>
      <Button variant="secondary" className="px-2">
        <Save />
      </Button>
      <Tooltip {...args}>Save</Tooltip>
    </TooltipTrigger>
    <TooltipTrigger>
      <Button variant="secondary" className="px-2">
        <Printer />
      </Button>
      <Tooltip {...args}>Print</Tooltip>
    </TooltipTrigger>
  </div>
);
