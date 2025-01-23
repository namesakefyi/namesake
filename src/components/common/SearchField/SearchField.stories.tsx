import { Button, Form, SearchField } from "@/components/common";
import type { Meta } from "@storybook/react";

const meta: Meta<typeof SearchField> = {
  component: SearchField,

  args: {
    label: "Search",
  },
};

export default meta;

export const Example = (args: any) => <SearchField {...args} />;

export const Validation = (args: any) => (
  <Form className="flex flex-col gap-2 items-start">
    <SearchField {...args} />
    <Button type="submit" variant="secondary">
      Submit
    </Button>
  </Form>
);

Validation.args = {
  isRequired: true,
};
