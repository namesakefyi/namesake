import { RiPrinterLine, RiSaveLine } from "@remixicon/react";
import type { Meta } from "@storybook/react";
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
        <RiSaveLine />
      </Button>
      <Tooltip {...args}>Save</Tooltip>
    </TooltipTrigger>
    <TooltipTrigger>
      <Button variant="secondary" className="px-2">
        <RiPrinterLine />
      </Button>
      <Tooltip {...args}>Print</Tooltip>
    </TooltipTrigger>
  </div>
);
