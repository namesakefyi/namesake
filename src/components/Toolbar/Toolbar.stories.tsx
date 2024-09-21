import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react";
import { Group } from "react-aria-components";
import { Toolbar } from ".";
import { Button } from "../Button";
import { Checkbox } from "../Checkbox";
import { Separator } from "../Separator";
import { ToggleButton } from "../ToggleButton";

import type { Meta } from "@storybook/react";

const meta: Meta<typeof Toolbar> = {
  component: Toolbar,
};

export default meta;

export const Example = (args: any) => (
  <Toolbar aria-label="Text formatting" {...args}>
    <Group aria-label="Style" className="contents">
      <ToggleButton aria-label="Bold" className="p-2.5">
        <BoldIcon className="w-4 h-4" />
      </ToggleButton>
      <ToggleButton aria-label="Italic" className="p-2.5">
        <ItalicIcon className="w-4 h-4" />
      </ToggleButton>
      <ToggleButton aria-label="Underline" className="p-2.5">
        <UnderlineIcon className="w-4 h-4" />
      </ToggleButton>
    </Group>
    <Separator
      orientation={args.orientation === "vertical" ? "horizontal" : "vertical"}
    />
    <Group aria-label="Clipboard" className="contents">
      <Button variant="secondary">Copy</Button>
      <Button variant="secondary">Paste</Button>
      <Button variant="secondary">Cut</Button>
    </Group>
    <Separator
      orientation={args.orientation === "vertical" ? "horizontal" : "vertical"}
    />
    <Checkbox>Night Mode</Checkbox>
  </Toolbar>
);
