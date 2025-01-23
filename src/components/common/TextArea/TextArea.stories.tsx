import type { Meta } from "@storybook/react";

import { Button, Form, TextArea } from "@/components/common";

const meta = {
  component: TextArea,
  args: {
    label: "Bio",
  },
} satisfies Meta<typeof TextArea>;

export default meta;

export const Example = (args: any) => <TextArea {...args} />;

export const Validation = (args: any) => (
  <Form className="flex flex-col gap-2 items-start">
    <TextArea {...args} />
    <Button type="submit" variant="secondary">
      Submit
    </Button>
  </Form>
);

Validation.args = {
  isRequired: true,
};
