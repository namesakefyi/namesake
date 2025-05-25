import { Button, DateRangePicker, Form } from "@/components/common";
import type { Meta } from "@storybook/react-vite";

const meta: Meta<typeof DateRangePicker> = {
  component: DateRangePicker,
  args: {
    label: "Trip dates",
  },
};

export default meta;

export const Example = (args: any) => <DateRangePicker {...args} />;

export const Validation = (args: any) => (
  <Form className="flex flex-col gap-2 items-start">
    <DateRangePicker {...args} />
    <Button type="submit" variant="secondary">
      Submit
    </Button>
  </Form>
);

Validation.args = {
  isRequired: true,
};
