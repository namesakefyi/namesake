import { Radio, RadioGroup } from ".";
import { Button } from "../Button";
import { Form } from "../Form";

export default {
  component: RadioGroup,
  parameters: {
    layout: "centered",
  },

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
