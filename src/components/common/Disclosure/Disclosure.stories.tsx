import { Disclosure, DisclosureGroup } from "@/components/common";
import type { Meta } from "@storybook/react-vite";

const meta: Meta<typeof Disclosure> = {
  component: Disclosure,
  parameters: {
    layout: "padded",
  },
};

export default meta;

export const Example = (args: any) => (
  <Disclosure title="Section 1" {...args}>
    Content for section 1
  </Disclosure>
);

export const Group = (args: any) => (
  <DisclosureGroup {...args}>
    <Disclosure title="Section 1" id="section-1">
      Aenean lacinia bibendum nulla sed consectetur. Fusce dapibus, tellus ac
      cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo
      sit amet risus.
    </Disclosure>
    <Disclosure title="Section 2" id="section-2">
      Nullam quis risus eget urna mollis ornare vel eu leo. Integer posuere erat
      a ante venenatis dapibus posuere velit aliquet.
    </Disclosure>
    <Disclosure title="Section 3" id="section-3">
      Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec
      ullamcorper nulla non metus auctor fringilla.
    </Disclosure>
  </DisclosureGroup>
);

Group.args = {
  allowsMultipleExpanded: true,
};
