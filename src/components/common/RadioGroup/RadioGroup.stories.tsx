import { Button, Form, Radio, RadioGroup } from "@/components/common";

export default {
  component: RadioGroup,

  argTypes: {},
  args: {
    label: "Favorite sport",
    isDisabled: false,
    isRequired: false,
    description: "",
    children: (
      <>
        <Radio value="soccer">Soccer</Radio>
        <Radio value="baseball">Baseball</Radio>
        <Radio value="basketball">Basketball</Radio>
      </>
    ),
  },
};

export const Default = {
  args: {},
};

export const Validation = (args: any) => (
  <Form className="flex flex-col gap-2 items-start">
    <RadioGroup {...args} />
    <Button type="submit" variant="secondary">
      Submit
    </Button>
  </Form>
);

Validation.args = {
  isRequired: true,
};
