import {
  Button,
  Checkbox,
  Separator,
  ToggleButton,
  Toolbar,
} from "@/components/common";
import { Bold, Italic, Underline } from "lucide-react";
import { Group } from "react-aria-components";

import type { Meta } from "@storybook/react-vite";

const meta: Meta<typeof Toolbar> = {
  component: Toolbar,
};

export default meta;

export const Example = (args: any) => (
  <Toolbar aria-label="Text formatting" {...args}>
    <Group aria-label="Style" className="contents">
      <ToggleButton aria-label="Bold" className="p-2.5">
        <Bold className="w-4 h-4" />
      </ToggleButton>
      <ToggleButton aria-label="Italic" className="p-2.5">
        <Italic className="w-4 h-4" />
      </ToggleButton>
      <ToggleButton aria-label="Underline" className="p-2.5">
        <Underline className="w-4 h-4" />
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
